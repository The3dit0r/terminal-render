export interface I_Terminal {
  log(str: string): void;
  warn(str: string): void;
  error(str: string): void;

  render(): void;
}

export interface I_ConfigableTerminal {}

export interface I_StylableTerminal {}

export interface I_Transformer<I = unknown, O = I> {
  apply(input: I): O;
  verify?: (output: O) => boolean;
}
