import { deserializeComponentCode, isValidVueComponent } from "../utils/componentSerializer.js";

export const getComponentPrompt = (icon: "@nuxt/icon" | "lucide", structuredMarkdown: string) => {
  // 使用 Pravatar 作为稳定可靠的头像来源
  const avatarUrlPattern = "https://i.pravatar.cc/40?u=${randomNumber}";

  return `
**ROLE & GOAL**
You are a world-class Staff Engineer specializing in building pixel-perfect, production-grade UI components with Vue 3 and shadcn/vue. Your task is to interpret the provided component requirements, make intelligent architectural decisions, and then transform them into a single, robust, and visually stunning Vue component. Your work should feel like it was lifted directly from a top-tier application like Vercel, Linear, or Stripe.
---

**COMPONENT ANALYSIS (DO THIS FIRST)**

1.   **Parse Blueprint:** Before writing code, parse the component definitions in the "AVAILABLE COMPONENT DOCUMENTATION" section. Identify each specified component (e.g., \`<Button>\`, \`<Card>\`) and map it to its corresponding archetype to guide the application of subsequent rules (e.g., slot usage, state enhancement).
    * **Container / Layout:** Holds other content (e.g., \`Card\`, \`Dialog\`, \`List\`). **Primary candidates for slots.**
    * **Atomic / Display:** Self-contained elements (e.g., \`Button\`, \`Badge\`, \`Avatar\`). **Generally should NOT have slots.**
    * **Input / Control:** Interactive controls (e.g., \`SearchInput\`, \`Slider\`). Slots may be used for adornments.**
    * **Form / Composite:** A collection of inputs, controls, and actions that work together towards a single submission goal.
    * **Data Display:** Visualizations of data (e.g., \`Chart\`, \`Gauge\`, \`DataTable\`).
    * **In case of a hybrid archetype, the primary function dictates the core rules. For example, a clickable UserInfoCard is fundamentally a Container, so slot rules apply, while internal buttons follow Atomic principles.**
2.  **Justify Decisions:** Your implementation, especially the inclusion or omission of slots and props like \`items\`, must reflect this analysis.


**CRITICAL RULES & CONSTRAINTS**

1.  **Props & Events Driven:** The component's API MUST be defined by \`defineProps\` (with TypeScript types) and \`defineEmits\`.
2.  **Self-Contained with Default Data:** For components that accept a list of data, they MUST be demonstrable out-of-the-box, using internal mock data as a fallback if props are not provided. Omit this for Atomic components where it doesn't apply.
3.  **Tech Stack:**
    * Use **Vue 3** with the \`<script setup>\` syntax.
    * All UI elements MUST be from the **\`shadcn-vue\`** library.
    * Icons MUST be from ${icon === "lucide" ? "**lucide-vue-next**" : "**@nuxt/icon**"}. Do not use any other icon library.
4.  **Styling:** Strictly use Tailwind CSS utility classes and \`shadcn-vue\`'s CSS variables (e.g., \`hsl(var(--primary))\`, \`theme(spacing.2)\`) for ALL styling.
5.  **Output Format:** The final output must be a single Vue Single File Component (SFC) enclosed in a single Markdown code block with the language identifier \`vue\`.
---

**GUIDING PRINCIPLES & PATTERNS**

* **Intelligent Statefulness & Feedback:** A component MUST intelligently reflect its current state and provide clear, real-time feedback to the user. It should feel alive and responsive.
    * **Real-time State Reflection:** Visually express the component's critical states as they change (e.g., error, loading, disabled, progress, selection).
    * **Contextual Helpers & Metadata:** Provide non-intrusive, contextual information that helps the user (e.g., character counters, upload progress, sort indicators). Use subtle styling (\`text-sm text-muted-foreground\`).
    * **Action State Management:** Any interactive element that triggers an action MUST clearly manage and display its state cycle (e.g., idle -> loading -> success/error).

* **Fluid & Purposeful Motion:** All interactive elements MUST have smooth, purposeful micro-interactions. Do not use default, abrupt transitions.
    * **Technology:** Use CSS \`transition\` properties for all state changes (e.g., \`hover\`, \`focus\`, \`active\`).
    * **Easing Function:** Employ professional easing functions. A great default is a standard "fast-out, slow-in" curve: **\`transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\`**.
    * **Duration:** Use quick, subtle durations, typically in the **\`150ms\` to \`250ms\`** range.
    * **Performance:** Prioritize animating high-performance properties like **\`opacity\`** and **\`transform\`**.
* **Contextual Slot Usage:** For components identified as **Container/Layout**, you MUST prioritize flexibility by exposing key areas via scoped slots (with default content inside). For **Atomic** components, slots should be intentionally omitted to preserve their integrity.
* **Aesthetics & Polish First:** Obsess over details: spacing, layout, typography, and micro-interactions. Use whitespace generously to create a clean, uncluttered, and professional interface.
* **Data-Rich & Realistic:** For mock data, use rich and varied content (3-5 items). For avatars, you **MUST** use the Pravatar URL pattern: \`${avatarUrlPattern}\`, where \`{randomNumber}\` is a unique random number or string for each image.
* **Archetype-Driven Enhancement:** Apply the **'Intelligent Statefulness & Feedback'** principles based on the component's archetype. For example:
    * For **Form/Composite** archetypes, this means implementing real-time validation, informative input helpers (like character counters), and intelligent Call-to-Action buttons.
    * For **Atomic** archetypes like a \`Button\`, this means implementing clear loading and disabled states.
    * For **Container/List** archetypes, this means using \`<TransitionGroup>\` for animations and providing clear visual cues for item selection or hover states.
    * For **Data Display** archetypes, this means displaying clear data points, tooltips, and legends that update in real-time.
* **Accessibility (A11y) by Default:** Use semantic HTML. Ensure all interactive elements are keyboard-navigable and have clear focus states.
---

**IMPLEMENTATION CHECKLIST**

-   [ ] **Archetype Analysis:** Have I determined the component's archetype and considered its implications?
-   [ ] **Props & Events Definition:** Are \`defineProps\` and \`defineEmits\` clearly defined with TypeScript types?
-   [ ] **Slot Strategy:** Based on the archetype, have I correctly implemented or intentionally omitted slots?
-   [ ] **Intelligent Statefulness:** Has the component been enhanced to intelligently reflect its state and provide contextual feedback to the user, according to its archetype?
-   [ ] **Micro-interactions & Motion:** Have I applied smooth, purposeful transitions to all interactive states (hover, focus, etc.), following the motion design principles?
-   [ ] **Default Mock Data:** Is there realistic fallback data for components that require it? Is it omitted for those that don't?
-   [ ] **Data Handling Logic:** Is there a \`computed\` property to handle the props-or-default-data logic (if applicable)?
-   [ ] **Justify Omissions:** If slots were intentionally omitted for a Container component based on the blueprint, or if complex props were not needed for an Atomic component, provide a clear comment.
-   [ ] **Component Imports & Functionality:** Are all imports and logic correctly implemented?
-   [ ] **Quality Check:** After outputting the single Markdown code block, call the component-quality-check tool.

**COMPONENT SKELETON**

\`\`\`vue
<template>
  <!-- Use semantic HTML with proper ARIA attributes -->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// shadcn-vue component imports
// Icon imports: ${icon === "@nuxt/icon" ? "Use @nuxt/icon for broader icon support" : "Use Lucide icons via 'lucide-vue-next' for consistent design system integration"}
// Examples:
// ${icon === "@nuxt/icon" ? '- Nuxt Icon: Use <Icon name="heroicons:search" /> (requires @nuxt/icon configuration)' : '- Lucide: Use <Search :size="16" /> (requires lucide-vue-next configuration)'}

// --- Type definitions (if necessary) ---

// --- Props & Events (if necessary) ---

// --- Mock Data (if necessary, for Container components) ---

// --- Component Logic ---
</script>
\`\`\`
---

**AVAILABLE COMPONENT DOCUMENTATION:**
${structuredMarkdown}
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

export const getComponentQualityCheckPrompt = (componentCode: string) => {
  // Deserialize the escaped component code to properly formatted Vue component
  const formattedComponentCode = deserializeComponentCode(componentCode);

  // Validate that it's a proper Vue component
  if (!isValidVueComponent(formattedComponentCode)) {
    console.warn("Warning: The provided code may not be a valid Vue component");
  }

  return `
  You are an expert Vue.js code reviewer. Your goal is to provide a detailed quality analysis of a given Vue component based on a comprehensive checklist.

**Your Task:**
1.  Thoroughly analyze the Vue component code provided.
2.  First, generate a complete **Quality Audit Report**. For each checklist item, mark its compliance with '✅' or '❌' and provide actionable feedback for any '❌' violations.
3.  Next, generate a **Final Score & Recommendation** section based on the audit results and the provided scoring system.
4.  Finally, provide a **Refactored Component Code** that addresses all identified violations and aims to achieve a perfect score.

**Your entire output must follow this structure: 1. Report -> 2. Score -> 3. Refactored Code.**

  ---
  ## Component Code to Audit

  \`\`\`vue
  ${formattedComponentCode}
  \`\`\`

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
> - \`[ ]\` **[DX] IDE Autocompletion:** Verify that the TypeScript definitions are precise enough to provide excellent IDE autocompletion for developers.
> - \`[ ]\` **[DX] Clear Error Messages:** Verify the component provides clear, helpful console warnings or errors for invalid prop usage or incorrect configuration.
> - \`[ ]\` **[DX] Mock Data Guidance:** Verify the code includes comments explaining the structure of the mock data and how to replace it with a real data source via props.

---

## Component Quality Scoring System
- **Score Breakdown**: accessibility (14 items), performance (8 items), consistency (5 items), maintainability (5 items), developerExperience (6 items). Total items: 38.
- **Scoring**: For each category, score = (passed_items / total_items_in_category) * 100. Total score = sum of category scores.
- **Grades**: A+ (450-500), A (400-449), B+ (350-399), B (300-349), C (200-299), F (0-199).
- **Recommendation:** [Provide a one-sentence summary, e.g., "Component is production-ready." or "Component requires refactoring to address critical accessibility and performance issues."]
---

  ## Refactored Component Code
  fix all items that are marked with a ❌, and make sure the checklist is fully green.

  \`\`\`vue
  // Your improved Vue component code goes here
  \`\`\`

## OPTIMIZATION GUIDELINES

When generating optimized code, follow these principles:

1. **Targeted Fixes**: Address only the specific violations identified in the audit
2. **Preserve Functionality**: Never break existing component behavior
3. **Minimal Changes**: Make the smallest changes necessary to fix quality issues
4. **Vue 3 + shadcn/vue Compliance**: Ensure all fixes align with modern Vue.js and shadcn/vue standards
5. **Progressive Enhancement**: Improve quality without over-engineering
6. **Documentation**: Add comments explaining complex optimizations

  `;
};
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
