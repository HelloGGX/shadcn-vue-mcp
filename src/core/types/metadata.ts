// 组件元数据类型定义
export interface PropMetadata {
  name: string;
  type: string | string[];
  required: boolean;
  default?: any;
  description?: string;
  validator?: string;
  examples?: string[];
}

export interface SlotMetadata {
  name: string;
  description?: string;
  props?: Record<string, string>; // slot props类型
  required: boolean;
}

export interface EventMetadata {
  name: string;
  description?: string;
  payload?: Record<string, string>;
  example?: string;
}

export interface VariantMetadata {
  name: string;
  description?: string;
  propsOverride: Record<string, any>;
  example?: string;
}

export interface DependencyMetadata {
  components: string[]; // 依赖的其他组件
  utilities: string[];  // 依赖的工具函数
  styles: string[];     // 依赖的样式
}


export interface ComponentMetadata {
  // 基础信息
  name: string;
  
  // 详细信息
  props: PropMetadata[];
  slots: SlotMetadata[];
  events: EventMetadata[];
  variants: VariantMetadata[];
  dependencies: DependencyMetadata;
  
  // 元数据信息
  extractedAt: Date;
  sourceHash?: string;
  version?: string;
}

// 元数据提取配置
export interface MetadataExtractionOptions {
  includePrivateProps?: boolean;
  includeGlobalProps?: boolean;
  extractDependencies?: boolean;
  analyzeVariants?: boolean;
  cacheResults?: boolean;
}

// 元数据提取结果
export interface MetadataExtractionResult {
  success: boolean;
  metadata?: ComponentMetadata[];
  error?: string;
  warnings?: string[];
}

// 缓存相关类型
export interface MetadataCacheEntry {
  metadata: ComponentMetadata[];
  cachedAt: Date;
}

export interface MetadataCacheOptions {
  maxAge?: number; // 缓存最大时间（毫秒）
  maxSize?: number; // 最大缓存条目数
} 