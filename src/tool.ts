import {type ToolHandler} from './handlers.js';

export class Tool {
  private _name?: string;
  private _raw?: boolean;
  private readonly _command?: string;
  private _description?: string;
  private _parameters?: Record<string, unknown>;
  private _handler?: ToolHandler;

  public name(name: string): this {
    this._name = name;
    return this;
  }

  public raw(raw: boolean): this {
    this._raw = raw;
    return this;
  }

  public description(description: string): this {
    this._description = description;
    return this;
  }

  public parameters(parameters: Record<string, unknown>): this {
    this._parameters = parameters;
    return this;
  }

  public handler(handler: ToolHandler): this {
    this._handler = handler;
    return this;
  }

  public getData() {
    return {
      name: this._name,
      raw: this._raw,
      command: this._command,
      description: this._description,
      parameters: this._parameters,
      handler: this._handler,
    } as const;
  }
}
