import {fail} from 'node:assert';
import process from 'node:process';
import {type PromptHandler, type ToolHandler} from './handlers.js';
import {type Manifest, type ManifestPrompt, type ManifestTool} from './manifest.js';
import {type Tool} from './tool.js';

export class Koop {
  private readonly manifest: Partial<Manifest> = {};
  private readonly promptHandlers = new Map<string, PromptHandler>();
  private readonly toolHandlers = new Map<string, ToolHandler>();

  public name(name: string): this {
    this.manifest.name = name;
    return this;
  }

  public version(version: string): this {
    this.manifest.version = version;
    return this;
  }

  public description(description: string): this {
    this.manifest.description = description;
    return this;
  }

  public prompt(name: string, handler: PromptHandler): this {
    const p: ManifestPrompt = {
      selfInvoke: true,
      args: ['-p', name],
    };

    this.manifest.prompts ||= {};

    this.manifest.prompts[name] = p;
    this.promptHandlers.set(name, handler);
    return this;
  }

  public tool(tool: Tool): this {
    const toolData = tool.getData();

    const t: ManifestTool = {
      name: toolData.name,
      description: toolData.description,
      parameters: toolData.parameters,
      args: ['-t', toolData.name ?? fail('no tool name')],
      raw: toolData.raw,
      selfInvoke: true,
    };

    this.manifest.tools ||= [];

    this.manifest.tools.push(t);

    this.toolHandlers.set(
      toolData.name ?? fail('no tool name'),
      toolData.handler ?? fail('no tool handler'),
    );
    return this;
  }

  public async run() {
    const arguments_ = process.argv.slice(2);

    if (arguments_.length === 0) {
      this.respond(this.manifest);
      return;
    }

    const [flag, name] = arguments_;

    if (flag === '-p') {
      const handler = this.promptHandlers.get(name);
      if (!handler) {
        throw new Error(`Prompt ${name} not found`);
      }

      this.respond(await handler());
    } else if (flag === '-t') {
      const handler = this.toolHandlers.get(name);
      if (!handler) {
        throw new Error(`Tool ${name} not found`);
      }

      this.respond(await handler(this.getToolParams()));
    }
  }

  private getToolParams(): any {
    const raw
            = process.env['commie.koop.tool.parameters']
            ?? process.env.commie_koop_tool_parameters
            ?? fail('no tool params');
    return JSON.parse(raw);
  }

  private respond(data: any, raw?: boolean) {
    if (raw) {
      process.stdout.write(`${data}\n`);
      return;
    }

    process.stdout.write(JSON.stringify(data));
  }
}
