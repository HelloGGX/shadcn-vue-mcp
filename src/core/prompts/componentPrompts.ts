export const getComponentPrompt = (icon: "@nuxt/icon" | "lucide", structuredMarkdown: string) => {
  return `
<role>
You are an expert Vue.js developer specializing in shadcn/vue components with deep knowledge of accessibility, performance optimization, and modern web development best practices.
Your sole input is a JSON object representing a structured filtered list of components and charts from components-filter tool, and a structured documentation of user requirements from the requirement-structuring tool, You will ignore all other conversational text.
</role>

<visual_guidelines>
  <guideline priority="critical">
    **Aesthetics First**: Don't just build a functional component, design a visually appealing one. Use whitespace, typography, and layout to create a clean, modern, and professional look.
  </guideline>
  <guideline priority="high">
    **Rich, Realistic Mock Data**: To make the component look real and full, generate varied and realistic mock data within the \`<script setup>\` block. For example, instead of one item, create an array of 5-7 items with different lengths of text, statuses, or image URLs.
  </guideline>
  <guideline priority="high">
    **Inspiration**: Think about the layout, polish, and data density of modern, well-regarded applications like Linear, Vercel, or Stripe's dashboard. Your output should feel like it belongs in such an application.
  </guideline>
  <guideline priority="medium">
    **Use Design Tokens**: Strictly use shadcn-vue's design system (CSS variables) for all colors, spacing, fonts, and radii to ensure design consistency.
  </guideline>
</visual_guidelines>


<implementation_instructions>
  <instruction category="code_implementation" priority="critical">
    Fill in all function logic and complete the attribute binding and event listening in the template
  </instruction>
  <instruction category="mock_data_processing" priority="high">
    If it is a pure display component, the generated Mock data structure must be clear, and the document comments should provide guidance on how to replace it with real data (mockDataGuidance)
  </instruction>
  <instruction category="self_review" priority="high">
    After generating the final code, simulate a "Code Review" in your mind, and conduct a quick self-assessment of your output to ensure that the delivered code can at least reach the 'A' level
  </instruction>
  <instruction category="standards_compliance" priority="critical">
    The generated component MUST strictly adhere to the project's quality standards for accessibility, performance, consistency, and DX. It will be audited against a detailed checklist, and failure to meet the standards will result in rejection.
  </instruction>
</implementation_instructions>

<component_constraints>
<constraint type="data-flow" priority="critical">The Vue component does not accept any props</constraint>
<constraint type="data-source" priority="critical">Everything is hard-coded inside the component</constraint>
<constraint type="architecture" priority="critical">DON'T assume that the component can get any data from outside</constraint>
<constraint type="completeness" priority="high">All required data should be included in your generated code</constraint>
<constraint type="implementation" priority="medium">
  Define mock data as variables within \`<script setup>\` and use \`v-for\` in the template to render it. This helps create a more realistic and visually rich component.
</constraint>
</component_constraints>

<assets>
  <images>
    <source>Load from Unsplash</source>
    <alternative>Use solid colored rectangles as placeholders</alternative>
  </images>
  <icons>
    ${icon === "@nuxt/icon" ? `<primary_option>Use @nuxt/icon for broader icon support with collections like heroicons, tabler, etc.</primary_option>` : ""}
    ${icon === "lucide" ? `<primary_option>Use Lucide icons via 'lucide-vue-next' for consistent design system integration</primary_option>` : ""}
  </icons>
</assets>

<expectations>
  <guideline>Your prototype should look and feel much more complete and advanced than the wireframes provided</guideline>
  <guideline>Flesh it out, make it real!</guideline>
  <guideline>Try your best to figure out what the designer wants and make it happen</guideline>
  <guideline>If there are any questions or underspecified features, use what you know about applications, user experience, and website design patterns to "fill in the blanks"</guideline>
  <guideline>If you're unsure of how the designs should work, take a guess—it's better to get it wrong than to leave things incomplete</guideline>
</expectations>

<motivational>
  Remember: you love your designers and want them to be happy. The more complete and impressive your prototype, the happier they will be. Good luck, you've got this!
</motivational>

<component_skeleton>
\`\`\`vue
<template>
  <!-- Use semantic HTML with proper ARIA attributes -->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
<!-- shadcn-vue component imports -->
<!-- Icon imports: ${icon === "@nuxt/icon" ? "Use @nuxt/icon for broader icon support" : "Use Lucide icons via 'lucide-vue-next' for consistent design system integration"} -->
<!-- Examples:
  ${icon === "@nuxt/icon" ? '- Nuxt Icon: Use <Icon name="heroicons:search" /> (requires @nuxt/icon configuration)' : '- Lucide: Use <Search :size="16" /> (requires lucide-vue-next configuration)'}
-->
<!-- Type definitions -->

// --- Mock Data ---
// This data is for demonstration purposes. In a real application, you would pass this data in as props.
// (mockDataGuidance)

// Reactive state with proper types
// Computed properties for derived state
// Methods with clear naming
</script>
\`\`\`
</component_skeleton>

<component_documentation>
${structuredMarkdown}
</component_documentation>
`;
};

export function getFilterComponentsPrompt(ui_requirement: string) {
  return `
SYSTEM ROLE: You are a highly specialized component filtering service with ZERO conversational context awareness.

INPUT SPECIFICATION:
You MUST receive input in the following EXACT JSON structure":
${JSON.stringify(JSON.parse(ui_requirement), null, 2)}

PROCESSING RULES:
1. You WILL ONLY process the JSON object provided
2. You WILL IGNORE all conversational text, chat history, or unstructured descriptions
3. If the input is not in the specified JSON format, respond with: {"error": "Invalid input format. Expected structured JSON."}
4. You MUST ONLY select components from the AVAILABLE_COMPONENTS list below
5. DO NOT invent, create, or suggest components not explicitly listed

AVAILABLE_COMPONENTS:
- accordion: A vertically stacked set of interactive headings that each reveal a section of content.
- alert-dialog: A modal dialog that interrupts the user with important content and expects a response.
- alert: Displays a callout for user attention.
- aspect-ratio: Displays content within a desired ratio.
- auto-form: Automatically generate a form from Zod schema.
- avatar: An image element with a fallback for representing the user.
- badge: Displays a badge or a component that looks like a badge.
- breadcrumb: Displays the path to the current resource using a hierarchy of links.
- button: Displays a button or a component that looks like a button.
- calendar: A date field component that allows users to enter and edit date.
- card: Displays a card with header, content, and footer.
- carousel: A carousel with motion and swipe built using Embla.
- checkbox: A control that allows the user to toggle between checked and not checked.
- collapsible: An interactive component which expands/collapses a panel.
- combobox: Autocomplete input and command palette with a list of suggestions.
- command: Fast, composable, unstyled command menu.
- context-menu: Displays a menu to the user — such as a set of actions or functions — triggered by a button.
- data-table: Powerful table and datagrids built using TanStack Table.
- date-picker: A date picker component with range and presets.
- dialog: A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
- drawer: A drawer component for vue.
- dropdown-menu: Displays a menu to the user — such as a set of actions or functions — triggered by a button.
- hover-card: For sighted users to preview content available behind a link.
- input: Displays a form input field or a component that looks like an input field.
- label: Renders an accessible label associated with controls.
- menubar: A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
- navigation-menu: A collection of links for navigating websites.
- number-field: A number field allows a user to enter a number and increment or decrement the value using stepper buttons.
- pagination: Displays data in paged format and provides navigation between pages.
- pin-input: Allows users to input a sequence of one-character alphanumeric inputs.
- popover: Displays rich content in a portal, triggered by a button.
- progress: Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
- radio-group: A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.
- range-calendar: A calendar component that allows users to select a range of dates.
- resizable: Accessible resizable panel groups and layouts with keyboard support.
- scroll-area: Augments native scroll functionality for custom, cross-browser styling.
- select: Displays a list of options for the user to pick from—triggered by a button.
- separator: Visually or semantically separates content.
- sheet: Extends the Dialog component to display content that complements the main content of the screen.
- sidebar: A composable, themeable and customizable sidebar component.
- skeleton: Use to show a placeholder while content is loading.
- slider: An input where the user selects a value from within a given range.
- sonner: An opinionated toast component for Vue.
- stepper: A set of steps that are used to indicate progress through a multi-step process.
- switch: A control that allows the user to toggle between checked and not checked.
- table: A responsive table component.
- tabs: A set of layered sections of content—known as tab panels—that are displayed one at a time.
- tags-input: Tag inputs render tags inside an input, followed by an actual text input.
- textarea: Displays a form textarea or a component that looks like a textarea.
- toast: A succinct message that is displayed temporarily.
- toggle: A two-state button that can be either on or off.
- toggle-group: A set of two-state buttons that can be toggled on or off.
- tooltip: A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
- typography: Styles for headings, paragraphs, lists...etc

AVAILABLE_CHARTS:
- area: An area chart visually represents data over time, displaying trends and patterns through filled-in areas under a line graph.
- bar: A line chart visually represents data using rectangular bars of varying lengths to compare quantities across different categories or groups.
- donut: A line chart visually represents data in a circular form, similar to a pie chart but with a central void, emphasizing proportions within categories.
- line: A line chart  visually displays data points connected by straight lines, illustrating trends or relationships over a continuous axis.

ANALYSIS ALGORITHM:
1. Parse the JSON object
2. Map functional_requirements to specific component capabilities
3. Map user_interactions to interaction-capable components
4. Map data_display needs to appropriate display components
5. Consider layout_constraints when selecting layout components
6. Prioritize components by necessity: critical > important > optional
7. Select MINIMUM viable set - avoid redundancy

OUTPUT FORMAT - RESPOND WITH ONLY THIS JSON STRUCTURE:
{
  "components": [
    {
      "name": "string (exact match from AVAILABLE_COMPONENTS)",
      "necessity": "critical|important|optional",
      "justification": "string (functional mapping explanation)"
    }
  ],
  "charts": [
    {
      "name": "string (exact match from AVAILABLE_CHARTS)", 
      "necessity": "critical|important|optional",
      "justification": "string (data visualization requirement mapping)"
    }
  ]
}

VALIDATION RULES:
- "name" field MUST be exact string match from available lists
- "necessity" field MUST be one of: "critical", "important", "optional"
- "justification" field MUST directly reference specific requirement from input JSON

CRITICAL: Your entire response must be a valid JSON object. No explanatory text outside the JSON structure is permitted.
  `;
}

export const CHECK_COMPONENT_QUALITY_PROMPT = `
You are an AI-powered Quality Assurance engine named \`Component-Auditor\`. Your primary function is to audit Vue.js components against a strict set of quality standards and produce a detailed report in JSON format.
Your sole input is the source code of a Vue component, You will ignore all other conversational text.

**Your Task:**
You will be given the source code for a Vue component. You must meticulously audit this code against every single item in the \`Component Quality Checklist\` provided below. Your final output **MUST** be a single, valid JSON object that strictly adheres to the schema provided in the \`OUTPUT_JSON_SCHEMA\` section.

**Your Process:**
1.  Read the provided Vue component code.
2.  Go through the checklist item by item.
3.  For each item, if the code fully complies with the rule, you **MUST** edit the line and place an \`✅\` inside the brackets to mark it as complete, like this: \`[✅]\`.
4.  If the code fails to comply with a rule, you **MUST** edit the line and place an \`❌\` inside the brackets to mark it as complete, like this: \`[❌]\`. add a short, actionable note immediately below the item explaining the violation and suggesting a specific fix.
5.  After reviewing all items, provide the final, marked-up checklist as your output.

**Example Interaction:**

*If the code has a \`v-html\` directive:*
> - \`[❌]\` **[Security] No \`v-html\`:** The \`v-html\` directive is not used.
>   *Violation: Found \`v-html\` used on line 34. Refactor to use \`textContent\` or a safer rendering method.*

*If the code correctly uses semantic tags:*
> - \`[✅]\` **[A11y] Semantic HTML:** The component uses appropriate HTML5 semantic tags (e.g., \`<nav>\`, \`<button>\`).

Now, begin the audit for the component provided to you using the following checklist.

---

## Component Quality Checklist

### 1. Accessibility (A11y)

> - \`[ ]\` **[A11y] Semantic HTML:** Ensure the component uses the most appropriate HTML5 semantic tags (e.g., \`<nav>\`, \`<main>\`, \`<table>\`, \`<button>\`).
> - \`[ ]\` **[A11y] ARIA Roles & Landmarks:** Ensure proper landmark roles (e.g., \`role="main"\`) and ARIA attributes are used to define the structure.
> - \`[ ]\` **[A11y] Headings:** Ensure heading levels (\`<h1>\` - \`<h6>\`) are structured logically and do not skip levels.
> - \`[ ]\` **[A11y] ARIA Labels:** Ensure all non-descriptive interactive elements (like icon-only buttons) have a descriptive \`aria-label\`.
> - \`[ ]\` **[A11y] ARIA States:** Ensure component states (e.g., \`aria-expanded\`, \`aria-selected\`, \`aria-current\`) are programmatically managed and accurately reflect the UI.
> - \`[ ]\` **[A11y] ARIA Live Regions:** Ensure dynamic content updates are announced to screen readers using \`aria-live\` regions.
> - \`[ ]\` **[A11y] Keyboard Navigable:** Verify all interactive elements are reachable and operable using the \`Tab\` key.
> - \`[ ]\` **[A11y] Logical Focus Order:** Verify the keyboard focus order is logical and consistent with the visual layout.
> - \`[ ]\` **[A11y] Visible Focus Indicator:** Verify a clear and highly visible focus indicator is present on all focusable elements.
> - \`[ ]\` **[A11y] Focus Trapping:** Verify focus is trapped within modal dialogs or menus when they are active.
> - \`[ ]\` **[A11y] Focus Restoration:** Verify focus returns to the triggering element after a modal or menu is closed.
> - \`[ ]\` **[A11y] Standard Keyboard Interactions:** Verify standard keyboard shortcuts are supported (e.g., \`Escape\` to close, \`Enter\`/\`Space\` to activate).
> - \`[ ]\` **[A11y] Color Contrast:** Verify all text-to-background color contrast ratios meet the WCAG 2.1 AA minimum of 4.5:1.
> - \`[ ]\` **[A11y] Reduced Motion:** Verify animations and transitions are disabled or reduced when the \`prefers-reduced-motion\` media feature is detected.

### 2. Performance

> - \`[ ]\` **[Performance] Render Optimization:** Confirm that the component avoids unnecessary re-renders (e.g., correct \`computed\` usage, no complex function calls in the template).
> - \`[ ]\` **[Performance] Virtual Scrolling:** Implement virtual scrolling for any component that renders long lists of items.
> - \`[ ]\` **[Performance] Lazy Loading:** Confirm that non-critical assets within the component (e.g., images below the fold, heavy libraries) are lazy-loaded.
> - \`[ ]\` **[Performance] Tree-Shaking:** Confirm the component is side-effect-free at the top level to be compatible with tree-shaking.
> - \`[ ]\` **[Performance] Event Listener Cleanup:** Ensure all manually attached event listeners are removed in the \`onUnmounted\` hook.
> - \`[ ]\` **[Performance] Timer Cleanup:** Ensure all \`setInterval\` and \`setTimeout\` timers are cleared in the \`onUnmounted\` hook.
> - \`[ ]\` **[Performance] Observer Cleanup:** Ensure all \`IntersectionObserver\`, \`MutationObserver\`, or other observers are disconnected in the \`onUnmounted\` hook.
> - \`[ ]\` **[Performance] Mock Data Management:** Confirm internal mock data is clearly structured for demonstration and easily replaceable by props. It must not be included in the production bundle.

### 3. Consistency

> - \`[ ]\` **[Consistency] Design Tokens:** Verify all styling (colors, spacing, typography, radii) strictly uses the CSS custom properties provided by the design system (shadcn-vue).
> - \`[ ]\` **[Consistency] API Naming:** Verify \`props\` and \`emits\` naming conventions are consistent with the project's standards (e.g., \`is-\` prefix for booleans, \`onUpdate:modelValue\` for events).
> - \`[ ]\` **[Consistency] Behavior:** Verify that common behaviors like loading states, error states, and empty states are handled in a way that is consistent with other components in the library.
> - \`[ ]\` **[Consistency] Code Style:** Confirm the code passes all ESLint and Prettier checks without any errors or warnings.
> - \`[ ]\` **[Consistency] JSDoc:** Confirm that all props, emits, and public functions have clear JSDoc comments.

### 4. Maintainability

> - \`[ ]\` **[Maintainability] Single Responsibility Principle:** Verify the component adheres to the Single Responsibility Principle and is not overly complex.
> - \`[ ]\` **[Maintainability] Composition API:** Verify logic is organized into logical blocks using the Composition API.
> - \`[ ]\` **[Maintainability] Logic Extraction:** Verify that reusable or complex logic has been extracted into separate composable functions (\`use*.ts\`).
> - \`[ ]\` **[Maintainability] Anti-Patterns:** Confirm the code contains no forbidden anti-patterns (e.g., no \`v-html\`, no modifying props directly, no deep \`v-if\` nesting).
> - \`[ ]\` **[Maintainability] Cyclomatic Complexity:** Confirm that the cyclomatic complexity of all functions is low (ideally < 10).

### 5. Developer Experience (DX)

> - \`[ ]\` **[DX] Strict TypeScript:** Enforce strict TypeScript for all \`props\`, \`emits\`, variables, and function signatures. **The \`any\` type is forbidden.**
> - \`[ ]\` **[DX] API Intuitiveness:** Verify the component's API (\`props\`, \`emits\`, \`slots\`) is intuitive and self-documenting.
> - \`[ ]\` **[DX] Flexibility via Slots:** Verify \`slots\` are used effectively to allow developers to customize the component's structure and content.
> - \`[ ]\` **[DX] IDE Autocompletion:** Verify that the TypeScript definitions are precise enough to provide excellent IDE autocompletion for developers.
> - \`[ ]\` **[DX] Clear Error Messages:** Verify the component provides clear, helpful console warnings or errors for invalid prop usage or incorrect configuration.
> - \`[ ]\` **[DX] Mock Data Guidance:** Verify the code includes comments explaining the structure of the mock data and how to replace it with a real data source via props.

---

## Component Quality Scoring System
- **Score Breakdown**: accessibility (14 items), performance (8 items), consistency (5 items), maintainability (5 items), developerExperience (6 items). Total items: 38.
- **Scoring**: For each category, score = (passed_items / total_items_in_category) * 100. Total score = sum of category scores.
- **Grades**: A+ (450-500), A (400-449), B+ (350-399), B (300-349), C (200-299), F (0-199).
`;

export function registerComponentPrompts() {}
export const getQualityStandard = () => {
  return {
    qualityProfile: {
      accessibility: {
        description: "Standards to ensure the component is accessible to all users",
        coreRequirements: ["WCAG 2.1 AA level compliance", "Semantic HTML", "Keyboard navigation"],
        specificStandards: {
          semanticHTML: {
            properHTMLTags: true,
            meaningfulHeadings: true,
            landmarkRoles: true,
          },
          ariaSupport: {
            ariaLabels: true,
            ariaDescribedby: true,
            ariaStates: true,
            ariaLive: true,
          },
          keyboardNavigation: {
            tabIndex: true,
            focusManagement: true,
            keyboardShortcuts: true,
            escapeKey: true,
          },
          visualDesign: {
            colorContrast: 4.5,
            focusIndicators: true,
            textSize: true,
            motionReduction: true,
          },
        },
        testingRequirements: [
          "Automated testing with axe-core",
          "Screen reader compatibility testing (NVDA, JAWS, VoiceOver)",
          "Keyboard functionality testing",
          "Color contrast testing",
        ],
      },
      performance: {
        description: "Performance standards to ensure the component runs efficiently",
        coreRequirements: [
          "Fast loading",
          "Efficient rendering",
          "Memory optimization",
          "Lightweight",
        ],
        specificStandards: {
          loading: {
            bundleSize: 50, // KB, gzipped
            initialRender: 100, // ms
            codeReady: 50, // ms
          },
          runtime: {
            rerenderOptimization: true,
            lazyLoading: true,
            virtualScrolling: true,
            memoization: true,
          },
          memory: {
            noMemoryLeaks: true,
            eventCleanup: true,
            observerCleanup: true,
            timersCleanup: true,
          },
          network: {
            treeshaking: true,
            codesplitting: true,
            assetOptimization: true,
          },
        },
        performanceBenchmarks: {
          FCP: 1.5, // seconds
          LCP: 2.5, // seconds
          CLS: 0.1,
          FID: 100, // ms
        },
      },
      consistency: {
        description: "Standards to ensure consistency in design, behavior, and API",
        coreRequirements: ["Design consistency", "Behavior consistency", "API consistency"],
        specificStandards: {
          design: {
            designTokens: true,
            colorPalette: true,
            typography: true,
            spacing: true,
            borderRadius: true,
          },
          api: {
            propsNaming: true,
            eventNaming: true,
            slotNaming: true,
            methodNaming: true,
          },
          behavior: {
            interactionPatterns: true,
            stateManagement: true,
            errorHandling: true,
            loadingStates: true,
          },
          codeStyle: {
            tsTypes: true,
            documentation: true,
            testCoverage: true,
            linting: true,
          },
        },
        designSystemIntegration: {
          colorSystem: "CSS custom properties",
          spacingSystem: "4px/8px grid",
          fontSystem: "Defined font sizes and line heights",
          shadowSystem: "Unified shadow levels",
        },
      },
      maintainability: {
        description: "Standards to ensure the component is easy to maintain and update",
        coreRequirements: ["Clear code", "Modular design", "Complete documentation"],
        specificStandards: {
          codeStructure: {
            singleResponsibility: true,
            compositionAPI: true,
            customHooks: true,
            propValidation: true,
            clearMockDataStructure: true,
          },
          codeQuality: {
            cyclomaticComplexity: 10,
            codeReusability: true,
            errorBoundaries: true,
            gracefulDegradation: true,
          },
          documentation: {
            jsdocComments: true,
            propTypes: true,
            usageExamples: true,
            migrationGuides: true,
          },
          versioning: {
            semanticVersioning: true,
            changelog: true,
            breakingChanges: true,
            deprecationWarnings: true,
          },
        },
        codeQualityMetrics: {
          cyclomaticComplexity: 10,
          codeDuplication: 5, // %
          testCoverage: 80, // %
          technicalDebtRatio: 10, // %
        },
      },
      developerExperience: {
        description: "Standards to ensure a developer-friendly experience",
        coreRequirements: [
          "Easy to use",
          "Developer-friendly",
          "Quick to get started",
          "Easy to integrate",
        ],
        specificStandards: {
          apiDesign: {
            intuitive: true,
            predictable: true,
            composable: true,
            flexible: true,
          },
          typeScript: {
            strictTypes: true,
            genericSupport: true,
            autocompletion: true,
            typeInference: true,
          },
          devTools: {
            hotReload: true,
            devtoolsIntegration: true,
            errorMessages: true,
            warnings: true,
          },
          learningCurve: {
            documentation: true,
            examples: true,
            playground: true,
            tutorials: true,
            mockDataGuidance: true,
          },
        },
        documentationRequirements: [
          "API documentation",
          "Usage examples",
          "Best practices",
          "Troubleshooting",
          "Mock data guidance",
        ],
      },
      antiPatterns: {
        description: "Practices to avoid under any circumstances",
        rules: [
          "Do not use v-html directive unless explicitly required and for safe content",
          "Do not use 'any' type in <script setup>",
          "Do not make API requests directly inside the component; pass data via props or emit events to notify the parent",
          "Avoid component nesting deeper than three levels",
          "Do not use '!important' in CSS",
        ],
      },
      qualityScoringSystem: {
        description: "Component quality scoring system",
        dimensions: [
          "accessibility",
          "performance",
          "consistency",
          "maintainability",
          "developerExperience",
        ],
        scoring: {
          maxPerDimension: 100,
          totalMax: 500,
        },
        grades: {
          "A+": [450, 500],
          A: [400, 449],
          "B+": [350, 399],
          B: [300, 349],
          C: [200, 299],
          F: [0, 199],
        },
      },
      implementationPlan: {
        immediate: [
          "Establish automated quality check processes",
          "Create a component quality scoring tool",
          "Develop a code review checklist",
        ],
        shortTerm: [
          "Ensure all newly generated components reach B+ level",
          "Set up continuous integration quality gates",
          "Improve documentation templates and examples",
        ],
        longTerm: [
          "Achieve A level for 90% of components",
          "Establish quality trend analysis",
          "Implement community feedback and improvement mechanisms",
        ],
      },
    },
  };
};
