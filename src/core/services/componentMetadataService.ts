import { ShadcnVueMetadataExtractor } from './metadataExtractor.js';
import { ComponentServices, SHADCN_VUE_COMPONENTS, SHADCN_VUE_CHART_COMPONENTS } from './componentServices.js';
import type {
  ComponentMetadata,
  MetadataExtractionOptions,
  MetadataExtractionResult
} from '../types/metadata.js';
import type { ShadcnVueComponent, ShadcnVueChartComponent } from './componentServices.js';

/**
 * 组件元数据服务
 * 整合元数据提取器和现有组件服务，提供完整的组件信息
 */
export class ComponentMetadataService {
  private static instance: ComponentMetadataService;
  private metadataExtractor: ShadcnVueMetadataExtractor;

  private constructor() {
    this.metadataExtractor = ShadcnVueMetadataExtractor.getInstance();
  }

  static getInstance(): ComponentMetadataService {
    if (!ComponentMetadataService.instance) {
      ComponentMetadataService.instance = new ComponentMetadataService();
    }
    return ComponentMetadataService.instance;
  }

  /**
   * 获取组件的完整信息（包含元数据和demo）
   */
  async getComponentFullInfo(
    componentName: ShadcnVueComponent | ShadcnVueChartComponent,
    options: MetadataExtractionOptions = {}
  ): Promise<{
    metadata: ComponentMetadata | null;
    demos: Array<{ name: string; code: string; }>;
    documentation: string | null;
    allFiles: string[];
    error?: string;
  }> {
    try {
      // 并行获取元数据和demo信息
      const [metadataResult, demosResult, documentation, componentFiles] = await Promise.all([
        this.metadataExtractor.extractComponentMetadata(componentName, options),
        ComponentServices.fetchUsageDemo(componentName),
        this.fetchComponentDocumentation(componentName),
        this.metadataExtractor.extractAllComponentFiles(componentName)
      ]);

      // 处理demos结果
      const demos = Array.isArray(demosResult) ? demosResult : [];

      return {
        metadata: metadataResult.success ? metadataResult.metadata || null : null,
        demos,
        documentation,
        allFiles: componentFiles.allFiles,
        error: metadataResult.success ? undefined : metadataResult.error
      };
    } catch (error) {
      return {
        metadata: null,
        demos: [],
        documentation: null,
        allFiles: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * 获取组件文档
   */
  private async fetchComponentDocumentation(componentName: string): Promise<string | null> {
    try {
      // 尝试获取组件文档，这里可以根据需要实现具体逻辑
      const doc = await ComponentServices.readFullComponentDoc({
        name: componentName,
        type: 'vue'
      });
      return doc;
    } catch (error) {
      console.warn(`Failed to fetch documentation for ${componentName}:`, error);
      return null;
    }
  }

  /**
   * 获取所有组件列表
   */
  private getAllComponents(): ShadcnVueComponent[] {
    return Object.keys(SHADCN_VUE_COMPONENTS) as ShadcnVueComponent[];
  }

  /**
   * 获取所有图表组件列表
   */
  private getAllChartComponents(): ShadcnVueChartComponent[] {
    return Object.keys(SHADCN_VUE_CHART_COMPONENTS) as ShadcnVueChartComponent[];
  }

  /**
   * 获取组件元数据
   */
  async getComponentMetadata(
    componentName: ShadcnVueComponent | ShadcnVueChartComponent,
    options: MetadataExtractionOptions = {}
  ): Promise<MetadataExtractionResult> {
    return this.metadataExtractor.extractComponentMetadata(componentName, options);
  }

  /**
   * 获取组件的所有文件结构
   */
  async getComponentFiles(componentName: ShadcnVueComponent | ShadcnVueChartComponent) {
    return this.metadataExtractor.extractAllComponentFiles(componentName);
  }

  /**
   * 批量获取多个组件的元数据
   */
  async getBatchComponentMetadata(
    componentNames: (ShadcnVueComponent | ShadcnVueChartComponent)[],
    options: MetadataExtractionOptions = {}
  ): Promise<Record<string, MetadataExtractionResult>> {
    const results: Record<string, MetadataExtractionResult> = {};
    
    // 使用并行处理提高效率
    const promises = componentNames.map(async (componentName) => {
      const result = await this.metadataExtractor.extractComponentMetadata(componentName, options);
      return { componentName, result };
    });

    const resolvedPromises = await Promise.allSettled(promises);
    
    resolvedPromises.forEach((promise, index) => {
      const componentName = componentNames[index];
      if (promise.status === 'fulfilled') {
        results[componentName] = promise.value.result;
      } else {
        results[componentName] = {
          success: false,
          error: `Failed to extract metadata: ${promise.reason}`
        };
      }
    });

    return results;
  }

  /**
   * 搜索组件（基于名称、分类、props等）
   */
  async searchComponents(query: {
    name?: string;
    category?: string;
    hasProps?: string[];
    hasEvents?: string[];
    hasSlots?: string[];
  }): Promise<ComponentMetadata[]> {
    // 获取所有可用组件
    const allComponents = [
      ...this.getAllComponents(),
      ...this.getAllChartComponents()
    ];

    const results: ComponentMetadata[] = [];

    for (const componentName of allComponents) {
      try {
        const metadataResult = await this.metadataExtractor.extractComponentMetadata(
          componentName,
          { cacheResults: true }
        );

        if (metadataResult.success && metadataResult.metadata) {
          const metadata = metadataResult.metadata;
          let matches = true;

          // 检查名称匹配
          if (query.name && !metadata.name.toLowerCase().includes(query.name.toLowerCase())) {
            matches = false;
          }

          // 检查分类匹配
          if (query.category && metadata.category !== query.category) {
            matches = false;
          }

          // 检查是否包含指定props
          if (query.hasProps && query.hasProps.length > 0) {
            const propNames = metadata.props.map(p => p.name.toLowerCase());
            const hasAllProps = query.hasProps.every(prop => 
              propNames.includes(prop.toLowerCase())
            );
            if (!hasAllProps) {
              matches = false;
            }
          }

          // 检查是否包含指定events
          if (query.hasEvents && query.hasEvents.length > 0) {
            const eventNames = metadata.events.map(e => e.name.toLowerCase());
            const hasAllEvents = query.hasEvents.every(event => 
              eventNames.includes(event.toLowerCase())
            );
            if (!hasAllEvents) {
              matches = false;
            }
          }

          // 检查是否包含指定slots
          if (query.hasSlots && query.hasSlots.length > 0) {
            const slotNames = metadata.slots.map(s => s.name.toLowerCase());
            const hasAllSlots = query.hasSlots.every(slot => 
              slotNames.includes(slot.toLowerCase())
            );
            if (!hasAllSlots) {
              matches = false;
            }
          }

          if (matches) {
            results.push(metadata);
          }
        }
      } catch (error) {
        console.warn(`Failed to search component ${componentName}:`, error);
      }
    }

    return results;
  }

  /**
   * 获取组件统计信息
   */
  async getComponentStats(): Promise<{
    totalComponents: number;
    componentsByCategory: Record<string, number>;
    averagePropsCount: number;
    averageEventsCount: number;
    averageSlotsCount: number;
    cacheStats: any;
  }> {
    const allComponents = [
      ...this.getAllComponents(),
      ...this.getAllChartComponents()
    ];

    const componentsByCategory: Record<string, number> = {};
    let totalProps = 0;
    let totalEvents = 0;
    let totalSlots = 0;
    let processedComponents = 0;

    for (const componentName of allComponents) {
      try {
        const metadataResult = await this.metadataExtractor.extractComponentMetadata(
          componentName,
          { cacheResults: true }
        );

        if (metadataResult.success && metadataResult.metadata) {
          const metadata = metadataResult.metadata;
          processedComponents++;

          // 统计分类
          const category = metadata.category || 'unknown';
          componentsByCategory[category] = (componentsByCategory[category] || 0) + 1;

          // 统计props、events、slots
          totalProps += metadata.props.length;
          totalEvents += metadata.events.length;
          totalSlots += metadata.slots.length;
        }
      } catch (error) {
        console.warn(`Failed to get stats for component ${componentName}:`, error);
      }
    }

    return {
      totalComponents: allComponents.length,
      componentsByCategory,
      averagePropsCount: processedComponents > 0 ? totalProps / processedComponents : 0,
      averageEventsCount: processedComponents > 0 ? totalEvents / processedComponents : 0,
      averageSlotsCount: processedComponents > 0 ? totalSlots / processedComponents : 0,
      cacheStats: this.metadataExtractor.getCacheStats()
    };
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.metadataExtractor.clearCache();
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats() {
    return this.metadataExtractor.getCacheStats();
  }
} 