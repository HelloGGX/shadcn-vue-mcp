import z from "zod";

// Shadcn/Vue 组件列表 - 基于官方文档
export const SHADCN_VUE_COMPONENTS = [
  "accordion",
  "alert-dialog",
  "alert",
  "aspect-ratio",
  "auto-form",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "data-table",
  "date-picker",
  "dialog",
  "drawer",
  "dropdown-menu",
  "form",
  "hover-card",
  "input",
  "label",
  "menubar",
  "navigation-menu",
  "number-field",
  "pagination",
  "pin-input",
  "popover",
  "progress",
  "radio-group",
  "range-calendar",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "stepper",
  "switch",
  "table",
  "tabs",
  "tags-input",
  "textarea",
  "toast",
  "toggle-group",
  "toggle",
  "tooltip",
  "typography",
] as const;
export const SHADCN_VUE_CHARTS = ["area", "bar", "donut", "line"] as const;
export const SHADCN_VUE_DEMO_LISTS = [
  "AccordionDemo.vue",
  "AlertDemo.vue",
  "AlertDestructiveDemo.vue",
  "AlertDialogDemo.vue",
  "AreaChartCustomTooltip.vue",
  "AreaChartDemo.vue",
  "AreaChartSparkline.vue",
  "AspectRatioDemo.vue",
  "AutoFormApi.vue",
  "AutoFormArray.vue",
  "AutoFormBasic.vue",
  "AutoFormConfirmPassword.vue",
  "AutoFormControlled.vue",
  "AutoFormDependencies.vue",
  "AutoFormInputWithoutLabel.vue",
  "AutoFormSubObject.vue",
  "AvatarDemo.vue",
  "BadgeDemo.vue",
  "BadgeDestructiveDemo.vue",
  "BadgeOutlineDemo.vue",
  "BadgeSecondaryDemo.vue",
  "BarChartCustomTooltip.vue",
  "BarChartDemo.vue",
  "BarChartRounded.vue",
  "BarChartStacked.vue",
  "BreadcrumbDemo.vue",
  "BreadcrumbDropdown.vue",
  "BreadcrumbEllipsisDemo.vue",
  "BreadcrumbLinkDemo.vue",
  "BreadcrumbResponsive.vue",
  "BreadcrumbSeparatorDemo.vue",
  "ButtonAsChildDemo.vue",
  "ButtonDemo.vue",
  "ButtonDestructiveDemo.vue",
  "ButtonGhostDemo.vue",
  "ButtonIconDemo.vue",
  "ButtonLinkDemo.vue",
  "ButtonLoadingDemo.vue",
  "ButtonOutlineDemo.vue",
  "ButtonSecondaryDemo.vue",
  "ButtonWithIconDemo.vue",
  "CalendarDemo.vue",
  "CalendarForm.vue",
  "CalendarWithSelect.vue",
  "CardChat.vue",
  "CardDemo.vue",
  "CardFormDemo.vue",
  "CardStats.vue",
  "CardWithForm.vue",
  "Cards",
  "CarouselApi.vue",
  "CarouselDemo.vue",
  "CarouselOrientation.vue",
  "CarouselPlugin.vue",
  "CarouselSize.vue",
  "CarouselSpacing.vue",
  "CarouselThumbnails.vue",
  "CheckboxDemo.vue",
  "CheckboxDisabled.vue",
  "CheckboxFormMultiple.vue",
  "CheckboxFormSingle.vue",
  "CheckboxWithText.vue",
  "CollapsibleDemo.vue",
  "ComboboxDemo.vue",
  "ComboboxDropdownMenu.vue",
  "ComboboxForm.vue",
  "ComboboxPopover.vue",
  "ComboboxResponsive.vue",
  "ComboboxTrigger.vue",
  "CommandDemo.vue",
  "CommandDialogDemo.vue",
  "CommandDropdownMenu.vue",
  "CommandForm.vue",
  "CommandPopover.vue",
  "CommandResponsive.vue",
  "ContextMenuDemo.vue",
  "CustomChartTooltip.vue",
  "DataTableColumnPinningDemo.vue",
  "DataTableDemo.vue",
  "DataTableDemoColumn.vue",
  "DataTableReactiveDemo.vue",
  "DatePickerDemo.vue",
  "DatePickerForm.vue",
  "DatePickerWithIndependentMonths.vue",
  "DatePickerWithPresets.vue",
  "DatePickerWithRange.vue",
  "DialogCustomCloseButton.vue",
  "DialogDemo.vue",
  "DialogForm.vue",
  "DialogScrollBodyDemo.vue",
  "DialogScrollOverlayDemo.vue",
  "DonutChartColor.vue",
  "DonutChartCustomTooltip.vue",
  "DonutChartDemo.vue",
  "DonutChartPie.vue",
  "DrawerDemo.vue",
  "DrawerDialog.vue",
  "DropdownMenuCheckboxes.vue",
  "DropdownMenuDemo.vue",
  "DropdownMenuRadioGroup.vue",
  "HoverCardDemo.vue",
  "InputDemo.vue",
  "InputDisabled.vue",
  "InputFile.vue",
  "InputForm.vue",
  "InputFormAutoAnimate.vue",
  "InputWithButton.vue",
  "InputWithIcon.vue",
  "InputWithLabel.vue",
  "LabelDemo.vue",
  "LineChartCustomTooltip.vue",
  "LineChartDemo.vue",
  "LineChartSparkline.vue",
  "MenubarDemo.vue",
  "NavigationMenuDemo.vue",
  "NumberFieldCurrency.vue",
  "NumberFieldDecimal.vue",
  "NumberFieldDemo.vue",
  "NumberFieldDisabled.vue",
  "NumberFieldForm.vue",
  "NumberFieldPercentage.vue",
  "PaginationDemo.vue",
  "PinInputControlled.vue",
  "PinInputDemo.vue",
  "PinInputDisabled.vue",
  "PinInputFormDemo.vue",
  "PinInputSeparatorDemo.vue",
  "PopoverDemo.vue",
  "ProgressDemo.vue",
  "RadioGroupDemo.vue",
  "RadioGroupForm.vue",
  "RangeCalendarDemo.vue",
  "ResizableDemo.vue",
  "ResizableHandleDemo.vue",
  "ResizableVerticalDemo.vue",
  "ScrollAreaDemo.vue",
  "ScrollAreaHorizontalDemo.vue",
  "SelectDemo.vue",
  "SelectForm.vue",
  "SelectScrollable.vue",
  "SeparatorDemo.vue",
  "SheetDemo.vue",
  "SheetSideDemo.vue",
  "SkeletonCard.vue",
  "SkeletonDemo.vue",
  "SliderDemo.vue",
  "SliderForm.vue",
  "SonnerDemo.vue",
  "SonnerWithDialog.vue",
  "StepperDemo.vue",
  "StepperForm.vue",
  "StepperHorizental.vue",
  "StepperVertical.vue",
  "SwitchDemo.vue",
  "SwitchForm.vue",
  "TableDemo.vue",
  "TabsDemo.vue",
  "TabsVerticalDemo.vue",
  "TagsInputComboboxDemo.vue",
  "TagsInputDemo.vue",
  "TagsInputFormDemo.vue",
  "TextareaDemo.vue",
  "TextareaDisabled.vue",
  "TextareaForm.vue",
  "TextareaWithButton.vue",
  "TextareaWithLabel.vue",
  "TextareaWithText.vue",
  "ToastDemo.vue",
  "ToastDestructive.vue",
  "ToastSimple.vue",
  "ToastWithAction.vue",
  "ToastWithTitle.vue",
  "ToggleDemo.vue",
  "ToggleDisabledDemo.vue",
  "ToggleGroupDemo.vue",
  "ToggleGroupDisabledDemo.vue",
  "ToggleGroupLargeDemo.vue",
  "ToggleGroupOutlineDemo.vue",
  "ToggleGroupSingleDemo.vue",
  "ToggleGroupSmallDemo.vue",
  "ToggleItalicDemo.vue",
  "ToggleItalicWithTextDemo.vue",
  "ToggleLargeDemo.vue",
  "ToggleSmallDemo.vue",
  "TooltipDemo.vue",
  "TypographyBlockquote.vue",
  "TypographyDemo.vue",
  "TypographyH1.vue",
  "TypographyH2.vue",
  "TypographyH3.vue",
  "TypographyH4.vue",
  "TypographyInlineCode.vue",
  "TypographyLarge.vue",
  "TypographyLead.vue",
  "TypographyList.vue",
  "TypographyMuted.vue",
  "TypographyP.vue",
  "TypographySmall.vue",
  "TypographyTable.vue",
] as const;

export class ComponentServices {
  private static readonly BASE_URL = `https://cdn.jsdelivr.net/gh/unovue/shadcn-vue@dev/apps/www`;
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
      `${ComponentServices.BASE_URL}/src/content/docs/${type}/${name}.md`
    );
    const content = await res.text();
    // 检查内容是否包含 404 错误信息
    if (content.includes('<div class="error-code">404</div>')) {
      return "No documentation found for this component";
    }
    return content;
  }
  static async fetchUsageDemo(name: typeof SHADCN_VUE_COMPONENTS[number]) {
    // 获取组件的 demo 文件名
    // name的名称alert","aspect-ratio","auto-form","avatar",将其改为Alert, AspectRatio, AutoForm, Avatar
    const demoName = ComponentServices.convertKebabToPascalCase(name);
    const demoList = SHADCN_VUE_DEMO_LISTS.filter((demo) => demo.startsWith(demoName));
    
    if (demoList.length === 0) {
      return "No demo found for this component";
    }
    // 使用Promise.all 并发请求, 返回格式为 {name: demoName, code: content}
    const demos = await Promise.all(
      demoList.map(async (demo) => {
        return {
          // 去掉.vue
          name: demo.replace(".vue", ""),
          code: await fetch(
            `${ComponentServices.BASE_URL}/src/registry/default/examples/${demo}`
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
  static replaceComponentPreviewsWithCode(doc: string, demos: Array<{name: string, code: string}>): string {
    if (!Array.isArray(demos) || demos.length === 0) {
      return doc;
    }
    // 正则匹配 <ComponentPreview name="demoName" /> 格式：
    // <ComponentPreview name="ComboboxPopover" />
    const componentPreviewRegex = /<ComponentPreview\s+name="([^"]+)"\s*\/>/g;
    
    return doc.replace(componentPreviewRegex, (match, demoName) => {
      // 在demos数组中查找匹配的demo
      const demo = demos.find(d => d.name === demoName);
      if (demo && demo.code) {
        // 将demo代码包装在代码块中
        return `\`\`\`vue\n${demo.code}\n\`\`\``;
      }
      // 如果找不到对应的demo，保持原样
      return match;
    });
  }

  /**
   * 将 kebab-case 格式的组件名转换为 PascalCase 格式
   * 例如: "alert" -> "Alert", "aspect-ratio" -> "AspectRatio"
   */
  static convertKebabToPascalCase(name: string): string {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
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
