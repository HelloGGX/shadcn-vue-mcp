import { createChecker, type MetaCheckerOptions } from "vue-component-meta";
import axios from "axios";
import crypto from "crypto";
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
} from "../types/metadata.js";
import type {
  ShadcnVueComponent,
  ShadcnVueChartComponent,
} from "./componentServices.js";
import path from "path";
import fs from "fs";

export class ShadcnVueMetadataExtractor {
  private static instance: ShadcnVueMetadataExtractor;
  private metadataCache = new Map<string, MetadataCacheEntry>();
  private checker: ReturnType<typeof createChecker> | null = null;
  private cacheOptions: MetadataCacheOptions;

  private static readonly SHADCN_VUE_REPO_BASE =
    "https://cdn.jsdelivr.net/gh/unovue/shadcn-vue@dev/apps/v4/registry/new-york-v4/ui/";
  private static readonly DEFAULT_CACHE_OPTIONS: MetadataCacheOptions = {
    maxAge: 24 * 60 * 60 * 1000, // 24小时
    maxSize: 100, // 最大缓存100个组件
  };

  private constructor(cacheOptions: MetadataCacheOptions = {}) {
    this.cacheOptions = {
      ...ShadcnVueMetadataExtractor.DEFAULT_CACHE_OPTIONS,
      ...cacheOptions,
    };
  }

  static getInstance(
    cacheOptions?: MetadataCacheOptions
  ): ShadcnVueMetadataExtractor {
    if (!ShadcnVueMetadataExtractor.instance) {
      ShadcnVueMetadataExtractor.instance = new ShadcnVueMetadataExtractor(
        cacheOptions
      );
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
        schema: { ignore: ["MyIgnoredNestedProps"] },
        printer: { newLine: 1 },
      };

      this.checker = createChecker(process.cwd(), checkerOptions);
    } catch (error) {
      console.warn("Failed to initialize vue-component-meta checker:", error);
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
            metadata: cached.metadata,
          };
        }
      }

      // 获取组件源码
      const componentsSources = await this.fetchComponentSource(componentName);
      if (!componentsSources) {
        return {
          success: false,
          error: `Failed to fetch source code for component: ${componentName}`,
        };
      }

      const metadata = await Promise.all(
        componentsSources.map(async (sourceCode) => {
          // 提取基础元数据
          const metadata = await this.extractMetadataFromSource(
            componentName,
            sourceCode,
            options
          );

          return metadata;
        })
      );
      // 缓存结果
      if (options.cacheResults !== false && metadata) {
        this.setCachedMetadata(componentName, metadata);
      }

      return {
        success: true,
        metadata,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * 从源码中提取元数据
   */
  private async extractMetadataFromSource(
    componentName: string,
    sourceCode: string,
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
        const tempFilePath = await this.createTempComponentFile(
          componentName,
          sourceCode
        );
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
        console.warn(
          "vue-component-meta analysis failed, falling back to manual parsing:",
          error
        );
      }
    }

    // 提取其他元数据
    const dependencies = options.extractDependencies
      ? this.extractDependencies(sourceCode)
      : { components: [], utilities: [], styles: [] };

    return {
      name: componentName,
      props,
      slots,
      events,
      variants: [], // TODO: 后续实现变体分析
      dependencies,
      extractedAt: new Date(),
      version: "latest",
    };
  }

  /**
   * 获取组件源码
   */
  private async fetchComponentSource(
    componentName: string
  ): Promise<string[] | null> {
    try {
      // 首先获取组件的index.ts文件，解析导出结构
      const indexPath = this.getComponentIndexPath(componentName);
      const indexUrl = `${ShadcnVueMetadataExtractor.SHADCN_VUE_REPO_BASE}${indexPath}`;

      const indexResponse = await axios.get(indexUrl, { timeout: 10000 });
      const indexContent = indexResponse.data;

      // 解析所有组件
      const allComponents = this.parseAllComponentExports(indexContent);

      const componentSources = await Promise.all(
        allComponents.map(async (component) => {
          // 获取组件的.vue文件内容
          const componentPath = this.getComponentFilePath(
            componentName,
            component.fileName
          );
          const componentUrl = `${ShadcnVueMetadataExtractor.SHADCN_VUE_REPO_BASE}${componentPath}`;

          const componentResponse = await axios.get(componentUrl, {
            timeout: 10000,
          });
          return componentResponse.data;
        })
      );
      return componentSources;
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
  private getComponentFilePath(
    componentName: string,
    fileName: string
  ): string {
    return `${componentName}/${fileName}`;
  }

  /**
   * 解析index.ts中的所有组件导出信息
   */
  private parseAllComponentExports(indexContent: string): Array<{
    exportName: string;
    fileName: string;
  }> {
    const components: Array<{ exportName: string; fileName: string }> = [];

    // 匹配 export { default as ComponentName } from './ComponentFile.vue'
    const exportRegex =
      /export\s+\{\s*default\s+as\s+(\w+)\s*\}\s+from\s+['"`]\.\/([^'"`]+)['"`]/g;
    let match;

    while ((match = exportRegex.exec(indexContent)) !== null) {
      const [, exportName, fileName] = match;
      components.push({
        exportName,
        fileName,
      });
    }

    // 如果没有找到上述格式，尝试其他导出格式
    if (components.length === 0) {
      // 匹配 export { ComponentName } from './ComponentFile.vue'
      const alternateRegex =
        /export\s+\{\s*(\w+)\s*\}\s+from\s+['"`]\.\/([^'"`]+)['"`]/g;

      while ((match = alternateRegex.exec(indexContent)) !== null) {
        const [, exportName, fileName] = match;
        components.push({
          exportName,
          fileName,
        });
      }
    }

    return components;
  }

  /**
   * 获取组件的所有相关文件元数据
   */
  async extractAllComponentFiles(componentName: string): Promise<{
    allFiles: Array<{ exportName: string; fileName: string }>;
    indexContent: string;
  }> {
    try {
      const indexPath = this.getComponentIndexPath(componentName);
      const indexUrl = `${ShadcnVueMetadataExtractor.SHADCN_VUE_REPO_BASE}${indexPath}`;

      const indexResponse = await axios.get(indexUrl, { timeout: 10000 });
      const indexContent = indexResponse.data;

      // 解析所有导出的组件信息
      const allFiles = this.parseAllComponentExports(indexContent);

      return {
        allFiles,
        indexContent,
      };
    } catch (error) {
      console.warn(
        `Failed to fetch component files for ${componentName}:`,
        error
      );
      return {
        allFiles: [],
        indexContent: "",
      };
    }
  }

  /**
   * 从vue-component-meta结果中提取props
   */
  private extractPropsFromMeta(
    metaProps: any[],
    options: MetadataExtractionOptions
  ): PropMetadata[] {
    return metaProps
      .filter((prop) => {
        if (!options.includeGlobalProps && prop.global) return false;
        if (!options.includePrivateProps && prop.name.startsWith("_"))
          return false;
        return true;
      })
      .map((prop) => ({
        name: prop.name,
        type: prop.type || "unknown",
        required: prop.required || false,
        default: prop.default,
        description: prop.description || "",
        examples: [],
      }));
  }

  /**
   * 从vue-component-meta结果中提取slots
   */
  private extractSlotsFromMeta(metaSlots: any[]): SlotMetadata[] {
    return metaSlots.map((slot) => ({
      name: slot.name,
      description: slot.description,
      props: slot.props || {},
      required: slot.required || false,
    }));
  }

  /**
   * 从vue-component-meta结果中提取events
   */
  private extractEventsFromMeta(metaEvents: any[]): EventMetadata[] {
    return metaEvents.map((event) => ({
      name: event.name,
      description: event.description,
      payload: event.payload || {},
    }));
  }

  /**
   * 提取依赖关系
   */
  private extractDependencies(sourceCode: string): DependencyMetadata {
    const dependencies: DependencyMetadata = {
      components: [],
      utilities: [],
      styles: [],
    };

    // 提取import语句
    const importRegex =
      /import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"`]([^'"`]+)['"`]/g;
    let match;

    while ((match = importRegex.exec(sourceCode)) !== null) {
      const importPath = match[1];

      if (importPath.includes("components/")) {
        dependencies.components.push(importPath);
      } else if (importPath.includes("utils/") || importPath.includes("lib/")) {
        dependencies.utilities.push(importPath);
      } else if (importPath.includes(".css") || importPath.includes(".scss")) {
        dependencies.styles.push(importPath);
      }
    }

    return dependencies;
  }

  /**
   * 创建临时组件文件（用于vue-component-meta分析）
   */
  private async createTempComponentFile(
    componentName: string,
    sourceCode: string
  ): Promise<string> {
    //在项目跟目录的temp目录下创建一个临时文件
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const filePath = path.join(tempDir, `${componentName}.vue`);
    fs.writeFileSync(filePath, sourceCode);
    return filePath;
  }

  /**
   * 清理临时文件
   */
  private async cleanupTempFile(filePath: string): Promise<void> {
    // 清理临时文件的逻辑
    fs.unlinkSync(filePath);
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

    if (
      age >
      (this.cacheOptions.maxAge ||
        ShadcnVueMetadataExtractor.DEFAULT_CACHE_OPTIONS.maxAge!)
    ) {
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
    metadata: ComponentMetadata[]
  ): void {
    // 检查缓存大小限制
    const maxSize =
      this.cacheOptions.maxSize ||
      ShadcnVueMetadataExtractor.DEFAULT_CACHE_OPTIONS.maxSize!;

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
      maxAge: this.cacheOptions.maxAge,
    };
  }
}
