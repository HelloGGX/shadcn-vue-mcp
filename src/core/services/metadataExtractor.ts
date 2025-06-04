import { createChecker, type MetaCheckerOptions } from 'vue-component-meta';
import axios from 'axios';
import path from 'path';
import crypto from 'crypto';
import type {
  ComponentMetadata,
  PropMetadata,
  SlotMetadata,
  EventMetadata,
  MetadataExtractionOptions,
  MetadataExtractionResult,
  MetadataCacheEntry,
  MetadataCacheOptions,
  DependencyMetadata,
  ExampleMetadata
} from '../types/metadata.js';
import type { ShadcnVueComponent, ShadcnVueChartComponent } from './componentServices.js';

export class ShadcnVueMetadataExtractor {
  private static instance: ShadcnVueMetadataExtractor;
  private metadataCache = new Map<string, MetadataCacheEntry>();
  private checker: ReturnType<typeof createChecker> | null = null;
  private cacheOptions: MetadataCacheOptions;

  private static readonly SHADCN_VUE_REPO_BASE = 'https://cdn.jsdelivr.net/gh/unovue/shadcn-vue@dev/apps/v4/registry/new-york-v4/ui/';
  private static readonly DEFAULT_CACHE_OPTIONS: MetadataCacheOptions = {
    maxAge: 24 * 60 * 60 * 1000, // 24小时
    maxSize: 100 // 最大缓存100个组件
  };

  private constructor(cacheOptions: MetadataCacheOptions = {}) {
    this.cacheOptions = { ...ShadcnVueMetadataExtractor.DEFAULT_CACHE_OPTIONS, ...cacheOptions };
  }

  static getInstance(cacheOptions?: MetadataCacheOptions): ShadcnVueMetadataExtractor {
    if (!ShadcnVueMetadataExtractor.instance) {
      ShadcnVueMetadataExtractor.instance = new ShadcnVueMetadataExtractor(cacheOptions);
    }
    return ShadcnVueMetadataExtractor.instance;
  }

  /**
   * 初始化vue-component-meta检查器
   */
  private async initializeChecker(): Promise<void> {
    if (this.checker) return;

    try {
      // 配置vue-component-meta选项
      const checkerOptions: MetaCheckerOptions = {
        forceUseTs: true,
        schema: { ignore: ['MyIgnoredNestedProps'] },
        printer: { newLine: 1 },
      };

      // 注意：在实际使用中，我们需要一个有效的tsconfig.json路径
      // 这里我们创建一个虚拟的配置，主要用于分析远程组件
      this.checker = createChecker(
        process.cwd(), // 使用当前工作目录
        checkerOptions
      );
    } catch (error) {
      console.warn('Failed to initialize vue-component-meta checker:', error);
      this.checker = null;
    }
  }

  /**
   * 提取组件的完整元数据
   */
  async extractComponentMetadata(
    componentName: ShadcnVueComponent | ShadcnVueChartComponent,
    options: MetadataExtractionOptions = {}
  ): Promise<MetadataExtractionResult> {
    try {
      // 检查缓存
      if (options.cacheResults !== false) {
        const cached = this.getCachedMetadata(componentName);
        if (cached) {
          return {
            success: true,
            metadata: cached.metadata
          };
        }
      }

      // 获取组件源码
      const sourceCode = await this.fetchComponentSource(componentName);
      if (!sourceCode) {
        return {
          success: false,
          error: `Failed to fetch source code for component: ${componentName}`
        };
      }

      // 生成源码hash用于缓存
      const sourceHash = this.generateSourceHash(sourceCode);

      // 提取基础元数据
      const metadata = await this.extractMetadataFromSource(
        componentName,
        sourceCode,
        sourceHash,
        options
      );

      // 缓存结果
      if (options.cacheResults !== false && metadata) {
        this.setCachedMetadata(componentName, metadata, sourceHash);
      }

      return {
        success: true,
        metadata
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * 从源码中提取元数据
   */
  private async extractMetadataFromSource(
    componentName: string,
    sourceCode: string,
    sourceHash: string,
    options: MetadataExtractionOptions
  ): Promise<ComponentMetadata> {
    await this.initializeChecker();

    let props: PropMetadata[] = [];
    let slots: SlotMetadata[] = [];
    let events: EventMetadata[] = [];

    // 如果vue-component-meta可用，使用它进行分析
    if (this.checker) {
      try {
        // 注意：这里需要临时文件路径，实际实现中可能需要创建临时文件
        // 或者使用vue-component-meta的字符串分析功能（如果支持）
        const tempFilePath = await this.createTempComponentFile(componentName, sourceCode);
        if (tempFilePath) {
          const meta = this.checker.getComponentMeta(tempFilePath);
          
          // 提取props
          props = this.extractPropsFromMeta(meta.props, options);
          
          // 提取slots
          slots = this.extractSlotsFromMeta(meta.slots);
          
          // 提取events
          events = this.extractEventsFromMeta(meta.events);
          
          // 清理临时文件
          await this.cleanupTempFile(tempFilePath);
        }
      } catch (error) {
        console.warn('vue-component-meta analysis failed, falling back to manual parsing:', error);
      }
    }

    // 如果自动分析失败，进行手动解析
    if (props.length === 0) {
      props = this.parsePropsFromSource(sourceCode);
    }
    if (slots.length === 0) {
      slots = this.parseSlotsFromSource(sourceCode);
    }
    if (events.length === 0) {
      events = this.parseEventsFromSource(sourceCode);
    }

    // 提取其他元数据
    const dependencies = options.extractDependencies 
      ? this.extractDependencies(sourceCode)
      : { components: [], utilities: [], styles: [] };

    const examples = await this.extractExamples(componentName);
    
    const description = this.extractDescription(sourceCode);
    const category = this.inferCategory(componentName);

    return {
      name: componentName,
      description,
      category,
      props,
      slots,
      events,
      variants: [], // TODO: 后续实现变体分析
      dependencies,
      examples,
      extractedAt: new Date(),
      sourceHash,
      version: 'latest'
    };
  }

  /**
   * 获取组件源码
   */
  private async fetchComponentSource(componentName: string): Promise<string | null> {
    try {
      // 首先获取组件的index.ts文件，解析导出结构
      const indexPath = this.getComponentIndexPath(componentName);
      const indexUrl = `${ShadcnVueMetadataExtractor.SHADCN_VUE_REPO_BASE}${indexPath}`;
      
      const indexResponse = await axios.get(indexUrl, { timeout: 10000 });
      const indexContent = indexResponse.data;
      
      // 解析主要组件（通常是与组件名相同的那个）
      const mainComponentFile = this.parseMainComponentFromIndex(indexContent, componentName);
      
      if (!mainComponentFile) {
        console.warn(`Could not determine main component file for ${componentName}`);
        return null;
      }
      
      // 获取主要组件的.vue文件内容
      const componentPath = this.getComponentFilePath(componentName, mainComponentFile);
      const componentUrl = `${ShadcnVueMetadataExtractor.SHADCN_VUE_REPO_BASE}${componentPath}`;
      
      const componentResponse = await axios.get(componentUrl, { timeout: 10000 });
      return componentResponse.data;
    } catch (error) {
      console.warn(`Failed to fetch source for ${componentName}:`, error);
      return null;
    }
  }

  /**
   * 获取组件index.ts路径
   */
  private getComponentIndexPath(componentName: string): string {
    return `${componentName}/index.ts`;
  }

  /**
   * 获取组件.vue文件路径
   */
  private getComponentFilePath(componentName: string, fileName: string): string {
    return `${componentName}/${fileName}`;
  }

  /**
   * 从index.ts内容中解析主要组件文件名
   */
  private parseMainComponentFromIndex(indexContent: string, componentName: string): string | null {
    // 解析export语句，查找主要组件
    const exportLines = indexContent.split('\n').filter(line => line.trim().startsWith('export'));
    
    // 首先尝试找到与组件名完全匹配的导出（通常是主组件）
    const exactMatch = exportLines.find(line => {
      const match = line.match(/export\s+\{\s*default\s+as\s+(\w+)\s*\}\s+from\s+['"`]\.\/([^'"`]+)['"`]/);
      if (match) {
        const [, exportName] = match;
        return exportName.toLowerCase() === componentName.toLowerCase();
      }
      return false;
    });

    if (exactMatch) {
      const match = exactMatch.match(/from\s+['"`]\.\/([^'"`]+)['"`]/);
      return match ? match[1] : null;
    }

    // 如果没有完全匹配，尝试找到第一个默认导出
    const firstExport = exportLines[0];
    if (firstExport) {
      const match = firstExport.match(/from\s+['"`]\.\/([^'"`]+)['"`]/);
      return match ? match[1] : null;
    }

    return null;
  }

  /**
   * 获取组件的所有相关文件元数据
   */
  async extractAllComponentFiles(componentName: string): Promise<{
    mainComponent: string | null;
    allFiles: string[];
    indexContent: string;
  }> {
    try {
      const indexPath = this.getComponentIndexPath(componentName);
      const indexUrl = `${ShadcnVueMetadataExtractor.SHADCN_VUE_REPO_BASE}${indexPath}`;
      
      const indexResponse = await axios.get(indexUrl, { timeout: 10000 });
      const indexContent = indexResponse.data;
      
      // 解析所有导出的文件
      const allFiles = this.parseAllComponentFiles(indexContent);
      const mainComponent = this.parseMainComponentFromIndex(indexContent, componentName);
      
      return {
        mainComponent,
        allFiles,
        indexContent
      };
    } catch (error) {
      console.warn(`Failed to fetch component files for ${componentName}:`, error);
      return {
        mainComponent: null,
        allFiles: [],
        indexContent: ''
      };
    }
  }

  /**
   * 从index.ts中解析所有组件文件
   */
  private parseAllComponentFiles(indexContent: string): string[] {
    const files: string[] = [];
    const exportLines = indexContent.split('\n').filter(line => line.trim().startsWith('export'));
    
    for (const line of exportLines) {
      const match = line.match(/from\s+['"`]\.\/([^'"`]+)['"`]/);
      if (match) {
        files.push(match[1]);
      }
    }
    
    return files;
  }

  /**
   * 从vue-component-meta结果中提取props
   */
  private extractPropsFromMeta(metaProps: any[], options: MetadataExtractionOptions): PropMetadata[] {
    return metaProps
      .filter(prop => {
        if (!options.includeGlobalProps && prop.global) return false;
        if (!options.includePrivateProps && prop.name.startsWith('_')) return false;
        return true;
      })
      .map(prop => ({
        name: prop.name,
        type: prop.type || 'unknown',
        required: prop.required || false,
        default: prop.default,
        description: prop.description || '',
        examples: []
      }));
  }

  /**
   * 从vue-component-meta结果中提取slots
   */
  private extractSlotsFromMeta(metaSlots: any[]): SlotMetadata[] {
    return metaSlots.map(slot => ({
      name: slot.name,
      description: slot.description,
      props: slot.props || {},
      required: slot.required || false
    }));
  }

  /**
   * 从vue-component-meta结果中提取events
   */
  private extractEventsFromMeta(metaEvents: any[]): EventMetadata[] {
    return metaEvents.map(event => ({
      name: event.name,
      description: event.description,
      payload: event.payload || {}
    }));
  }

  /**
   * 手动解析props（fallback方法）- 更新以处理Vue单文件组件
   */
  private parsePropsFromSource(sourceCode: string): PropMetadata[] {
    const props: PropMetadata[] = [];
    
    // 提取script setup部分
    const scriptSetupMatch = sourceCode.match(/<script\s+setup(?:\s+[^>]*)?>([^]*?)<\/script>/);
    const scriptContent = scriptSetupMatch ? scriptSetupMatch[1] : sourceCode;
    
    // 方法1: 匹配defineProps<interface>()
    const definePropsInterfaceRegex = /defineProps<\{([^}]+)\}>/g;
    let match = definePropsInterfaceRegex.exec(scriptContent);
    
    if (match) {
      const propsString = match[1];
      const propLines = propsString.split('\n').map(line => line.trim()).filter(Boolean);
      
      for (const line of propLines) {
        const propMatch = line.match(/(\w+)(\?)?\s*:\s*(.+)/);
        if (propMatch) {
          const [, name, optional, type] = propMatch;
          props.push({
            name,
            type: type.replace(/[;,]$/, ''),
            required: !optional,
            description: ''
          });
        }
      }
      return props;
    }

    // 方法2: 匹配defineProps()对象语法
    const definePropsObjectRegex = /defineProps\(\s*\{([^}]+)\}\s*\)/g;
    match = definePropsObjectRegex.exec(scriptContent);
    
    if (match) {
      const propsString = match[1];
      const propLines = propsString.split('\n').map(line => line.trim()).filter(Boolean);
      
      for (const line of propLines) {
        // 匹配 propName: Type 或 propName: { type: Type, required: boolean }
        const simplePropMatch = line.match(/(\w+)\s*:\s*(\w+)/);
        const complexPropMatch = line.match(/(\w+)\s*:\s*\{([^}]+)\}/);
        
        if (complexPropMatch) {
          const [, name, config] = complexPropMatch;
          const typeMatch = config.match(/type\s*:\s*(\w+)/);
          const requiredMatch = config.match(/required\s*:\s*(true|false)/);
          const defaultMatch = config.match(/default\s*:\s*([^,}]+)/);
          
          props.push({
            name,
            type: typeMatch ? typeMatch[1] : 'unknown',
            required: requiredMatch ? requiredMatch[1] === 'true' : false,
            default: defaultMatch ? defaultMatch[1].trim() : undefined,
            description: ''
          });
        } else if (simplePropMatch) {
          const [, name, type] = simplePropMatch;
          props.push({
            name,
            type,
            required: false,
            description: ''
          });
        }
      }
    }
    
    return props;
  }

  /**
   * 手动解析slots（fallback方法）- 更新以处理Vue单文件组件
   */
  private parseSlotsFromSource(sourceCode: string): SlotMetadata[] {
    const slots: SlotMetadata[] = [];
    
    // 提取template部分
    const templateMatch = sourceCode.match(/<template[^>]*>([^]*?)<\/template>/);
    const templateContent = templateMatch ? templateMatch[1] : sourceCode;
    
    // 查找template中的slot标签
    const slotRegex = /<slot(?:\s+name=["']([^"']+)["'])?[^>]*>/g;
    let match;
    
    while ((match = slotRegex.exec(templateContent)) !== null) {
      const slotName = match[1] || 'default';
      if (!slots.find(s => s.name === slotName)) {
        slots.push({
          name: slotName,
          required: false,
          description: this.extractSlotDescription(templateContent, slotName)
        });
      }
    }
    
    return slots;
  }

  /**
   * 手动解析events（fallback方法）- 更新以处理Vue单文件组件
   */
  private parseEventsFromSource(sourceCode: string): EventMetadata[] {
    const events: EventMetadata[] = [];
    
    // 提取script setup部分
    const scriptSetupMatch = sourceCode.match(/<script\s+setup(?:\s+[^>]*)?>([^]*?)<\/script>/);
    const scriptContent = scriptSetupMatch ? scriptSetupMatch[1] : sourceCode;
    
    // 方法1: 查找defineEmits定义
    const defineEmitsRegex = /defineEmits<\{([^}]+)\}>/g;
    let match = defineEmitsRegex.exec(scriptContent);
    
    if (match) {
      const emitsString = match[1];
      const emitLines = emitsString.split('\n').map(line => line.trim()).filter(Boolean);
      
      for (const line of emitLines) {
        const emitMatch = line.match(/(\w+)\s*:\s*\[([^\]]*)\]/);
        if (emitMatch) {
          const [, eventName, payload] = emitMatch;
          events.push({
            name: eventName,
            payload: this.parseEventPayload(payload),
            description: ''
          });
        }
      }
      return events;
    }

    // 方法2: 查找defineEmits数组语法
    const defineEmitsArrayRegex = /defineEmits\(\s*\[([^\]]+)\]\s*\)/g;
    match = defineEmitsArrayRegex.exec(scriptContent);
    
    if (match) {
      const emitsString = match[1];
      const eventNames = emitsString.split(',').map(name => 
        name.trim().replace(/['"]/g, '')
      ).filter(Boolean);
      
      for (const eventName of eventNames) {
        events.push({
          name: eventName,
          description: ''
        });
      }
      return events;
    }

    // 方法3: 查找$emit调用（fallback）
    const emitRegex = /\$emit\s*\(\s*['"`]([^'"`]+)['"`]/g;
    
    while ((match = emitRegex.exec(scriptContent)) !== null) {
      const eventName = match[1];
      if (!events.find(e => e.name === eventName)) {
        events.push({
          name: eventName,
          description: ''
        });
      }
    }
    
    return events;
  }

  /**
   * 提取slot描述信息
   */
  private extractSlotDescription(templateContent: string, slotName: string): string | undefined {
    // 查找slot前的注释
    const slotPattern = slotName === 'default' 
      ? /<slot(?!\s+name)[^>]*>/
      : new RegExp(`<slot\\s+name=["']${slotName}["'][^>]*>`);
    
    const match = slotPattern.exec(templateContent);
    if (match) {
      const beforeSlot = templateContent.substring(0, match.index);
      const commentMatch = beforeSlot.match(/<!--\s*([^-]+)\s*-->\s*$/);
      if (commentMatch) {
        return commentMatch[1].trim();
      }
    }
    
    return undefined;
  }

  /**
   * 解析事件payload类型
   */
  private parseEventPayload(payloadString: string): Record<string, string> | undefined {
    if (!payloadString.trim()) return undefined;
    
    const payload: Record<string, string> = {};
    const params = payloadString.split(',').map(p => p.trim());
    
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      const match = param.match(/(\w+)\s*:\s*(.+)/);
      if (match) {
        const [, name, type] = match;
        payload[name] = type;
      } else {
        payload[`param${i}`] = param || 'unknown';
      }
    }
    
    return Object.keys(payload).length > 0 ? payload : undefined;
  }

  /**
   * 提取依赖关系
   */
  private extractDependencies(sourceCode: string): DependencyMetadata {
    const dependencies: DependencyMetadata = {
      components: [],
      utilities: [],
      styles: []
    };

    // 提取import语句
    const importRegex = /import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"`]([^'"`]+)['"`]/g;
    let match;

    while ((match = importRegex.exec(sourceCode)) !== null) {
      const importPath = match[1];
      
      if (importPath.includes('components/')) {
        dependencies.components.push(importPath);
      } else if (importPath.includes('utils/') || importPath.includes('lib/')) {
        dependencies.utilities.push(importPath);
      } else if (importPath.includes('.css') || importPath.includes('.scss')) {
        dependencies.styles.push(importPath);
      }
    }

    return dependencies;
  }

  /**
   * 提取组件示例
   */
  private async extractExamples(componentName: string): Promise<ExampleMetadata[]> {
    // 这里可以从demo代码中提取示例
    // 暂时返回空数组，后续可以集成到ComponentServices的fetchUsageDemo方法
    return [];
  }

  /**
   * 提取组件描述
   */
  private extractDescription(sourceCode: string): string | undefined {
    // 查找JSDoc注释
    const jsdocRegex = /\/\*\*\s*([\s\S]*?)\s*\*\//;
    const match = jsdocRegex.exec(sourceCode);
    
    if (match) {
      return match[1]
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, '').trim())
        .filter(Boolean)
        .join(' ');
    }
    
    return undefined;
  }

  /**
   * 推断组件分类
   */
  private inferCategory(componentName: string): string {
    const categoryMap: Record<string, string> = {
      'button': 'form',
      'input': 'form',
      'checkbox': 'form',
      'radio': 'form',
      'select': 'form',
      'textarea': 'form',
      'alert': 'feedback',
      'toast': 'feedback',
      'dialog': 'overlay',
      'modal': 'overlay',
      'card': 'layout',
      'grid': 'layout',
      'table': 'data'
    };

    for (const [key, category] of Object.entries(categoryMap)) {
      if (componentName.includes(key)) {
        return category;
      }
    }

    return 'general';
  }

  /**
   * 创建临时组件文件（用于vue-component-meta分析）
   */
  private async createTempComponentFile(componentName: string, sourceCode: string): Promise<string> {
    // 在实际实现中，这里需要创建临时文件
    // 暂时返回一个模拟路径
    return `/tmp/${componentName}.vue`;
  }

  /**
   * 清理临时文件
   */
  private async cleanupTempFile(filePath: string): Promise<void> {
    // 清理临时文件的逻辑
  }

  /**
   * 生成源码hash
   */
  private generateSourceHash(sourceCode: string): string {
    return crypto.createHash('md5').update(sourceCode).digest('hex');
  }

  /**
   * 获取缓存的元数据
   */
  private getCachedMetadata(componentName: string): MetadataCacheEntry | null {
    const cached = this.metadataCache.get(componentName);
    
    if (!cached) return null;
    
    // 检查缓存是否过期
    const now = Date.now();
    const age = now - cached.cachedAt.getTime();
    
    if (age > (this.cacheOptions.maxAge || ShadcnVueMetadataExtractor.DEFAULT_CACHE_OPTIONS.maxAge!)) {
      this.metadataCache.delete(componentName);
      return null;
    }
    
    return cached;
  }

  /**
   * 设置缓存元数据
   */
  private setCachedMetadata(
    componentName: string, 
    metadata: ComponentMetadata, 
    sourceHash: string
  ): void {
    // 检查缓存大小限制
    const maxSize = this.cacheOptions.maxSize || ShadcnVueMetadataExtractor.DEFAULT_CACHE_OPTIONS.maxSize!;
    
    if (this.metadataCache.size >= maxSize) {
      // 删除最旧的缓存项
      const oldestKey = this.metadataCache.keys().next().value;
      if (oldestKey !== undefined) {
        this.metadataCache.delete(oldestKey);
      }
    }
    
    this.metadataCache.set(componentName, {
      metadata,
      cachedAt: new Date(),
      sourceHash
    });
  }

  /**
   * 清除所有缓存
   */
  clearCache(): void {
    this.metadataCache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats() {
    return {
      size: this.metadataCache.size,
      maxSize: this.cacheOptions.maxSize,
      maxAge: this.cacheOptions.maxAge
    };
  }
} 