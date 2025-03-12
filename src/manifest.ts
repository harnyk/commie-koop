export type ManifestPrompt = {
  selfInvoke?: boolean;
  command?: string;
  args?: string[];
};

export type ManifestTool = {
  selfInvoke?: boolean;
  command?: string;
  args?: string[];
  name?: string;
  description?: string;
  parameters?: Record<string, unknown>;
  raw?: boolean;
};

export type Manifest = {
  version: string;
  name: string;
  description?: string;
  tools: ManifestTool[];
  prompts: Record<string, ManifestPrompt>;
};
