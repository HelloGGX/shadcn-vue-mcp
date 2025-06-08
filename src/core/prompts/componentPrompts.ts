import { FastMCP } from "fastmcp";


export const CREATE_COMPONENT_PROMPT = `
<role>
You are an expert Vue.js developer specializing in shadcn/vue components with deep knowledge of accessibility, performance optimization, and modern web development best practices.
</role>

<context>
Component Documentation Analysis Complete - Ready for final implementation phase.
</context>

<critical_prerequisites>
<resource_requirement priority="mandatory">
  <resource_uri>standards://quality-profile</resource_uri>
  <description>Complete quality profile defining all requirements for component generation</description>
  <dimensions>
    <dimension name="accessibility" weight="20%">WCAG 2.1 AA compliance, semantic HTML, keyboard navigation</dimension>
    <dimension name="performance" weight="20%">Bundle optimization, render efficiency, memory management</dimension>
    <dimension name="consistency" weight="20%">Design tokens, API patterns, behavior standards</dimension>
    <dimension name="maintainability" weight="20%">Code clarity, documentation, modularity</dimension>
    <dimension name="developer_experience" weight="20%">TypeScript support, intuitive API, clear examples</dimension>
  </dimensions>
  <target_quality_level>A or higher (450+ points out of 500)</target_quality_level>
</resource_requirement>
</critical_prerequisites>

<implementation_instructions>
  <instruction category="code_implementation" priority="critical">
    Fill in all function logic and complete the attribute binding and event listening in the template
  </instruction>
  <instruction category="standards_compliance" priority="critical">
    Check and meet all relevant items in the quality standards resource one by one, especially performance optimization, DX, A11y and reverse constraints
  </instruction>
  <instruction category="mock_data_processing" priority="high">
    If it is a pure display component, the generated Mock data structure must be clear, and the document comments should provide guidance on how to replace it with real data (mockDataGuidance)
  </instruction>
  <instruction category="self_review" priority="high">
    After generating the final code, simulate a "Code Review" in your mind, and use the quality standards from the resource as a basis to conduct a quick self-assessment of your output to ensure that the delivered code can at least reach the 'A' level
  </instruction>
</implementation_instructions>

<component_constraints>
<constraint type="data-flow" priority="critical">The Vue component does not accept any props</constraint>
<constraint type="data-source" priority="critical">Everything is hard-coded inside the component</constraint>
<constraint type="architecture" priority="critical">DON'T assume that the component can get any data from outside</constraint>
<constraint type="completeness" priority="high">All required data should be included in your generated code</constraint>
<constraint type="implementation" priority="medium">Rather than defining data as separate variables, inline it directly in the template code</constraint>
</component_constraints>

<assets>
  <images>
    <source>Load from Unsplash</source>
    <alternative>Use solid colored rectangles as placeholders</alternative>
  </images>
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
<!-- Lucide icons imports   -->
<!-- Type definitions -->

<!-- Reactive state with proper types -->
<!-- Computed properties for derived state -->
<!-- Methods with clear naming -->
</script>
\`\`\`
</component_skeleton>
`;

export const FILTER_COMPONENTS_PROMPT = `
CRITICAL: You must respond with a valid JSON object in the exact format specified below. Do not include any other text or explanations outside the JSON.

As a web UI expert, analyze the provided UI description and identify ONLY the specific components and charts absolutely necessary to implement the described interface.

STRICT REQUIREMENTS:
- You MUST ONLY select components from the provided available-components list
- DO NOT create, invent, or suggest components that are not explicitly listed
- If a component you think you need doesn't exist, find alternative components from the list
- Your response MUST be a valid JSON object with the exact structure shown below

ANALYSIS PROCESS:
1. Consider the exact functional requirements in the description
2. Identify the minimum set of components needed FROM THE AVAILABLE LIST ONLY
3. Exclude components that might be nice-to-have but aren't essential
4. Justify each component's selection with a brief reason tied to the requirements
5. Consider performance and maintainability implications

AVAILABLE COMPONENTS:
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
- area: An area chart visually represents data over time, displaying trends and patterns through filled-in areas under a line graph.
- bar: A line chart visually represents data using rectangular bars of varying lengths to compare quantities across different categories or groups.
- donut: A line chart visually represents data in a circular form, similar to a pie chart but with a central void, emphasizing proportions within categories.
- line: A line chart  visually displays data points connected by straight lines, illustrating trends or relationships over a continuous axis.

REQUIRED OUTPUT FORMAT - RESPOND WITH ONLY THIS JSON STRUCTURE:
{
  "components": [
    {
      "name": "string (must be from available-components list)",
      "necessity": "critical|important|optional",
      "justification": "string (explain how this component achieves the desired functionality)"
    }
  ],
  "charts": [
    {
      "name": "string (must be from available-charts list)", 
      "necessity": "critical|important|optional",
      "justification": "string (explain how this chart achieves the desired functionality)"
    }
  ]
}

FIELD SPECIFICATIONS:
- "name": Must be exactly one of the component names from the available-components list above
- "necessity": Must be exactly one of: "critical", "important", "optional"
- "justification": Brief explanation (1-2 sentences) of why this component is needed

IMPORTANT: Your entire response must be a valid JSON object. Do not include any text before or after the JSON.
`;

export function registerComponentPrompts(server: FastMCP) {
  
}
export const getQualityStandard = () => {
  return {
    qualityProfile: {
      accessibility: {
        description:
          "Standards to ensure the component is accessible to all users",
        coreRequirements: [
          "WCAG 2.1 AA level compliance",
          "Semantic HTML",
          "Keyboard navigation",
        ],
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
        description:
          "Performance standards to ensure the component runs efficiently",
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
        description:
          "Standards to ensure consistency in design, behavior, and API",
        coreRequirements: [
          "Design consistency",
          "Behavior consistency",
          "API consistency",
        ],
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
        description:
          "Standards to ensure the component is easy to maintain and update",
        coreRequirements: [
          "Clear code",
          "Modular design",
          "Complete documentation",
        ],
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
