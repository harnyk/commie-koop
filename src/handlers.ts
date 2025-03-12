export type PromptHandler = () => string | Promise<string>;
export type ToolHandler = (parameters: any) => any | Promise<any>;
