import z from "zod";

// Shadcn/Vue 组件和对应的 demo 列表
export const SHADCN_VUE_COMPONENTS = {
  accordion: ["AccordionDemo"],
  "alert-dialog": ["AlertDialogDemo", "AlertDemo", "AlertDestructiveDemo"],
  alert: ["AlertDemo", "AlertDestructiveDemo"],

  "aspect-ratio": ["AspectRatioDemo"],
  "auto-form": [
    "AutoFormApi",
    "AutoFormArray",
    "AutoFormBasic",
    "AutoFormConfirmPassword",
    "AutoFormControlled",
    "AutoFormDependencies",
    "AutoFormInputWithoutLabel",
    "AutoFormSubObject",
  ],
  avatar: ["AvatarDemo"],
  badge: [
    "BadgeDemo",
    "BadgeDestructiveDemo",
    "BadgeOutlineDemo",
    "BadgeSecondaryDemo",
  ],

  breadcrumb: [
    "BreadcrumbDemo",
    "BreadcrumbDropdown",
    "BreadcrumbEllipsisDemo",
    "BreadcrumbLinkDemo",
    "BreadcrumbResponsive",
    "BreadcrumbSeparatorDemo",
  ],
  button: [
    "ButtonAsChildDemo",
    "ButtonDemo",
    "ButtonDestructiveDemo",
    "ButtonGhostDemo",
    "ButtonIconDemo",
    "ButtonLinkDemo",
    "ButtonLoadingDemo",
    "ButtonOutlineDemo",
    "ButtonSecondaryDemo",
    "ButtonWithIconDemo",
  ],
  calendar: ["CalendarDemo", "CalendarForm", "CalendarWithSelect"],
  card: ["CardChat", "CardDemo", "CardFormDemo", "CardStats", "CardWithForm"],
  carousel: [
    "CarouselApi",
    "CarouselDemo",
    "CarouselOrientation",
    "CarouselPlugin",
    "CarouselSize",
    "CarouselSpacing",
    "CarouselThumbnails",
  ],
  checkbox: [
    "CheckboxDemo",
    "CheckboxDisabled",
    "CheckboxFormMultiple",
    "CheckboxFormSingle",
    "CheckboxWithText",
  ],
  collapsible: ["CollapsibleDemo"],
  combobox: [
    "ComboboxDemo",
    "ComboboxDropdownMenu",
    "ComboboxForm",
    "ComboboxPopover",
    "ComboboxResponsive",
    "ComboboxTrigger",
  ],
  command: [
    "CommandDemo",
    "CommandDialogDemo",
    "CommandDropdownMenu",
    "CommandForm",
    "CommandPopover",
    "CommandResponsive",
  ],
  "context-menu": ["ContextMenuDemo"],
  "data-table": [
    "DataTableColumnPinningDemo",
    "DataTableDemo",
    "DataTableDemoColumn",
    "DataTableReactiveDemo",
  ],
  "date-picker": [
    "DatePickerDemo",
    "DatePickerForm",
    "DatePickerWithIndependentMonths",
    "DatePickerWithPresets",
    "DatePickerWithRange",
  ],
  dialog: [
    "DialogCustomCloseButton",
    "DialogDemo",
    "DialogForm",
    "DialogScrollBodyDemo",
    "DialogScrollOverlayDemo",
  ],
  drawer: ["DrawerDemo", "DrawerDialog"],
  "dropdown-menu": [
    "DropdownMenuCheckboxes",
    "DropdownMenuDemo",
    "DropdownMenuRadioGroup",
  ],
  "hover-card": ["HoverCardDemo"],
  input: [
    "InputDemo",
    "InputDisabled",
    "InputFile",
    "InputForm",
    "InputFormAutoAnimate",
    "InputWithButton",
    "InputWithIcon",
    "InputWithLabel",
  ],
  label: ["LabelDemo"],
  menubar: ["MenubarDemo"],
  "navigation-menu": ["NavigationMenuDemo"],
  "number-field": [
    "NumberFieldCurrency",
    "NumberFieldDecimal",
    "NumberFieldDemo",
    "NumberFieldDisabled",
    "NumberFieldForm",
    "NumberFieldPercentage",
  ],
  pagination: ["PaginationDemo"],
  "pin-input": [
    "PinInputControlled",
    "PinInputDemo",
    "PinInputDisabled",
    "PinInputFormDemo",
    "PinInputSeparatorDemo",
  ],
  popover: ["PopoverDemo"],
  progress: ["ProgressDemo"],
  "radio-group": ["RadioGroupDemo", "RadioGroupForm"],
  "range-calendar": ["RangeCalendarDemo"],
  resizable: ["ResizableDemo", "ResizableHandleDemo", "ResizableVerticalDemo"],
  "scroll-area": ["ScrollAreaDemo", "ScrollAreaHorizontalDemo"],
  select: ["SelectDemo", "SelectForm", "SelectScrollable"],
  separator: ["SeparatorDemo"],
  sheet: ["SheetDemo", "SheetSideDemo"],
  sidebar: [], // 添加 sidebar 组件，暂无 demo
  skeleton: ["SkeletonCard", "SkeletonDemo"],
  slider: ["SliderDemo", "SliderForm"],
  sonner: ["SonnerDemo", "SonnerWithDialog"],
  stepper: [
    "StepperDemo",
    "StepperForm",
    "StepperHorizental",
    "StepperVertical",
  ],
  switch: ["SwitchDemo", "SwitchForm"],
  table: ["TableDemo"],
  tabs: ["TabsDemo", "TabsVerticalDemo"],
  "tags-input": ["TagsInputComboboxDemo", "TagsInputDemo", "TagsInputFormDemo"],
  textarea: [
    "TextareaDemo",
    "TextareaDisabled",
    "TextareaForm",
    "TextareaWithButton",
    "TextareaWithLabel",
    "TextareaWithText",
  ],
  toast: [
    "ToastDemo",
    "ToastDestructive",
    "ToastSimple",
    "ToastWithAction",
    "ToastWithTitle",
  ],
  toggle: [
    "ToggleDemo",
    "ToggleDisabledDemo",
    "ToggleItalicDemo",
    "ToggleItalicWithTextDemo",
    "ToggleLargeDemo",
    "ToggleSmallDemo",
  ],
  "toggle-group": [
    "ToggleGroupDemo",
    "ToggleGroupDisabledDemo",
    "ToggleGroupLargeDemo",
    "ToggleGroupOutlineDemo",
    "ToggleGroupSingleDemo",
    "ToggleGroupSmallDemo",
  ],
  tooltip: ["TooltipDemo"],
  typography: [
    "TypographyBlockquote",
    "TypographyDemo",
    "TypographyH1",
    "TypographyH2",
    "TypographyH3",
    "TypographyH4",
    "TypographyInlineCode",
    "TypographyLarge",
    "TypographyLead",
    "TypographyList",
    "TypographyMuted",
    "TypographyP",
    "TypographySmall",
    "TypographyTable",
  ],
} as const;

export const SHADCN_VUE_CHART_COMPONENTS = {
  area: ["AreaChartCustomTooltip", "AreaChartDemo", "AreaChartSparkline"],
  bar: [
    "BarChartCustomTooltip",
    "BarChartDemo",
    "BarChartRounded",
    "BarChartStacked",
  ],
  donut: [
    "DonutChartColor",
    "DonutChartCustomTooltip",
    "DonutChartDemo",
    "DonutChartPie",
  ],
  line: ["LineChartCustomTooltip", "LineChartDemo", "LineChartSparkline"],
} as const;

// 导出组件名称类型
export type ShadcnVueComponent = keyof typeof SHADCN_VUE_COMPONENTS;
export type ShadcnVueChartComponent = keyof typeof SHADCN_VUE_CHART_COMPONENTS;

export class ComponentServices {
  private static readonly BASE_URL = `https://cdn.jsdelivr.net/gh/unovue/shadcn-vue@dev/apps`;
  private static readonly CONTEXT7_API_BASE_URL = "https://context7.com/api";
  private static readonly DEFAULT_TYPE = "txt";
  private static readonly DEFAULT_MINIMUM_TOKENS = 1000;

  constructor() {}

  static async fetchLibraryDocumentation(
    libraryId: string,
    options: {
      tokens?: number;
      topic?: string;
      folders?: string;
    } = {
      tokens: ComponentServices.DEFAULT_MINIMUM_TOKENS,
      topic: "general",
      folders: "docs",
    }
  ): Promise<string | null> {
    try {
      if (libraryId.startsWith("/")) {
        libraryId = libraryId.slice(1);
      }
      const url = new URL(
        `${ComponentServices.CONTEXT7_API_BASE_URL}/v1/${libraryId}`
      );
      if (options.tokens)
        url.searchParams.set("tokens", options.tokens.toString());
      if (options.topic) url.searchParams.set("topic", options.topic);
      if (options.folders) url.searchParams.set("folders", options.folders);
      url.searchParams.set("type", ComponentServices.DEFAULT_TYPE);
      const response = await fetch(url, {
        headers: {
          "X-Context7-Source": "mcp-server",
        },
      });
      if (!response.ok) {
        console.error(`Failed to fetch documentation: ${response.status}`);
        return null;
      }
      const text = await response.text();
      if (
        !text ||
        text === "No content available" ||
        text === "No context data available"
      ) {
        return null;
      }
      return text;
    } catch (error) {
      console.error("Error fetching library documentation:", error);
      return null;
    }
  }
  static async readFullComponentDoc({
    name,
    type,
  }: {
    name: string;
    type: string;
  }) {
    const res = await fetch(
      `${ComponentServices.BASE_URL}/www/src/content/docs/${type}/${name}.md`
    );
    const content = await res.text();
    // 检查内容是否包含 404 错误信息
    if (content.includes('<div class="error-code">404</div>')) {
      return "No documentation found for this component";
    }
    return content;
  }

  static async fetchUsageDemo(name: ShadcnVueComponent | ShadcnVueChartComponent) {
    // 从相应的结构中获取 demo 列表
    let demoList: readonly string[];
    
    if (name in SHADCN_VUE_COMPONENTS) {
      demoList = SHADCN_VUE_COMPONENTS[name as ShadcnVueComponent];
    } else if (name in SHADCN_VUE_CHART_COMPONENTS) {
      demoList = SHADCN_VUE_CHART_COMPONENTS[name as ShadcnVueChartComponent];
    } else {
      return "No demo found for this component";
    }
    
    if (!demoList || demoList.length === 0) {
      return "No demo found for this component";
    }

    // 使用Promise.all 并发请求, 返回格式为 {name: demoName, code: content}
    const demos = await Promise.all(
      demoList.map(async (demo) => {
        return {
          name: demo,
          code: await fetch(
            `${ComponentServices.BASE_URL}/www/src/registry/default/examples/${demo}.vue`
          ).then((res) => res.text()),
        };
      })
    );
    return demos;
  }

  static createNecessityFilter(necessity: string) {
    return (component: { necessity: string }) => {
      const score: Record<string, number> = {
        critical: 3,
        important: 2,
        optional: 1,
      };
      return (score[component.necessity] ?? 0) >= (score[necessity] ?? 0);
    };
  }

  /**
   * 将文档中的 ComponentPreview 标签替换为对应的 demo 代码
   * @param doc 原始文档内容
   * @param demos demo 数组，包含 {name, code} 格式
   * @returns 处理后的文档内容
   */
  static replaceComponentPreviewsWithCode(
    doc: string,
    demos: Array<{ name: string; code: string }>
  ): string {
    if (!Array.isArray(demos) || demos.length === 0) {
      return doc;
    }
    // 正则匹配 <ComponentPreview name="demoName" /> 格式：
    // <ComponentPreview name="ComboboxPopover" />
    const componentPreviewRegex = /<ComponentPreview\s+name="([^"]+)"\s*\/>/g;

    return doc.replace(componentPreviewRegex, (match, demoName) => {
      // 在demos数组中查找匹配的demo
      const demo = demos.find((d) => d.name === demoName);
      if (demo && demo.code) {
        // 将demo代码包装在代码块中
        return `\`\`\`vue\n${demo.code}\n\`\`\``;
      }
      // 如果找不到对应的demo，保持原样
      return match;
    });
  }

  /**
   * 检查组件是否存在
   */
  static isValidComponent(name: string): name is ShadcnVueComponent | ShadcnVueChartComponent {
    return name in SHADCN_VUE_COMPONENTS || name in SHADCN_VUE_CHART_COMPONENTS;
  }

  /**
   * 获取指定组件的所有 demo 名称
   */
  static getComponentDemos(name: ShadcnVueComponent | ShadcnVueChartComponent): readonly string[] {
    if (name in SHADCN_VUE_COMPONENTS) {
      return SHADCN_VUE_COMPONENTS[name as ShadcnVueComponent];
    } else if (name in SHADCN_VUE_CHART_COMPONENTS) {
      return SHADCN_VUE_CHART_COMPONENTS[name as ShadcnVueChartComponent];
    }
    return [];
  }
}

export const ComponentSchema = z.object({
  name: z.string(),
  necessity: z.enum(["critical", "important", "optional"]),
  justification: z.string(),
});

export const ComponentsSchema = z.object({
  components: z.array(ComponentSchema),
  charts: z.array(ComponentSchema),
});

export default ComponentServices;
