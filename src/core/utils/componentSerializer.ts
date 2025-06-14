/**
 * Component serialization utilities for handling Vue component code strings
 */

/**
 * Deserializes an escaped Vue component string into properly formatted code
 * @param escapedComponentCode - The escaped component code string with \n, \", etc.
 * @returns The properly formatted Vue component code
 */
export function deserializeComponentCode(escapedComponentCode: string): string {
  try {
    // Handle escaped newlines
    let formattedCode = escapedComponentCode.replace(/\\n/g, '\n');
    
    // Handle escaped quotes
    formattedCode = formattedCode.replace(/\\"/g, '"');
    formattedCode = formattedCode.replace(/\\'/g, "'");
    
    // Handle escaped backslashes
    formattedCode = formattedCode.replace(/\\\\/g, '\\');
    
    // Handle escaped tabs
    formattedCode = formattedCode.replace(/\\t/g, '\t');
    
    // Handle escaped carriage returns
    formattedCode = formattedCode.replace(/\\r/g, '\r');
    
    return formattedCode;
  } catch (error) {
    console.error('Error deserializing component code:', error);
    return escapedComponentCode; // Return original if deserialization fails
  }
}

/**
 * Alternative approach using JSON.parse for more robust deserialization
 * @param escapedComponentCode - The escaped component code string
 * @returns The properly formatted Vue component code
 */
export function deserializeComponentCodeWithJSON(escapedComponentCode: string): string {
  try {
    // Wrap in quotes and use JSON.parse to handle all escape sequences
    const jsonString = `"${escapedComponentCode.replace(/"/g, '\\"')}"`;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error deserializing component code with JSON:', error);
    // Fallback to manual replacement
    return deserializeComponentCode(escapedComponentCode);
  }
}

/**
 * Serializes Vue component code into an escaped string (reverse operation)
 * @param componentCode - The properly formatted Vue component code
 * @returns The escaped component code string
 */
export function serializeComponentCode(componentCode: string): string {
  return componentCode
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/"/g, '\\"')    // Escape quotes
    .replace(/'/g, "\\'")    // Escape single quotes
    .replace(/\n/g, '\\n')   // Escape newlines
    .replace(/\t/g, '\\t')   // Escape tabs
    .replace(/\r/g, '\\r');  // Escape carriage returns
}


/**
 * Validates if a string contains valid Vue component structure
 * @param componentCode - The component code to validate
 * @returns Boolean indicating if the code appears to be a valid Vue component
 */
export function isValidVueComponent(componentCode: string): boolean {
  const hasTemplate = /<template[\s\S]*?<\/template>/i.test(componentCode);
  const hasScript = /<script[\s\S]*?<\/script>/i.test(componentCode);
  
  return hasTemplate && hasScript;
}

/**
 * Extracts template, script, and style sections from a Vue component
 * @param componentCode - The Vue component code
 * @returns Object containing template, script, and style sections
 */
export function parseVueComponent(componentCode: string) {
  const templateMatch = componentCode.match(/<template[\s\S]*?>([\s\S]*?)<\/template>/i);
  const scriptMatch = componentCode.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i);
  const styleMatch = componentCode.match(/<style[\s\S]*?>([\s\S]*?)<\/style>/i);
  
  return {
    template: templateMatch ? templateMatch[1].trim() : '',
    script: scriptMatch ? scriptMatch[1].trim() : '',
    style: styleMatch ? styleMatch[1].trim() : '',
    hasTemplate: !!templateMatch,
    hasScript: !!scriptMatch,
    hasStyle: !!styleMatch
  };
} 