import { EventEmitter } from "node:events";

import stringWidth from "string-width";
import stripAnsi from "strip-ansi";

export function convertEscapeToLiteral(str: string) {
  const escaped = JSON.stringify(str);
  const withoutQuotes = escaped.slice(1, -1);
  return Array.from(withoutQuotes).join("");
}

export const realLen = (s: string) => stringWidth(s);

export interface I_Terminal {
  log(...arg: string[]): void;
}

type T_SettingsOptions = {
  caretChar: string;
};

export class TerminalSettings {
  values: T_SettingsOptions = {
    caretChar: "│",
  };

  get<K extends keyof T_SettingsOptions>(c: K) {
    return this.values[c];
  }
}

interface I_TerminalEvent {
  input(inputBufferStr: string): void;
  keyboard(data: Buffer<ArrayBufferLike>): void;
  wasd(data : [boolean, boolean, boolean, boolean]) : void;
  arrows(data : [boolean, boolean, boolean, boolean]) : void;
}

export class TerminalEventEmitter extends EventEmitter {
  emit<K extends keyof I_TerminalEvent>(
    event: K,
    ...args: Parameters<I_TerminalEvent[K]>
  ) {
    return super.emit(event, ...args);
  }

  on<K extends keyof I_TerminalEvent>(
    event: K,
    listener: I_TerminalEvent[K]
  ): this {
    return super.on(event, listener);
  }

  once<K extends keyof I_TerminalEvent>(
    event: K,
    listener: I_TerminalEvent[K]
  ): this {
    return super.once(event, listener);
  }

  off<K extends keyof I_TerminalEvent>(
    event: K,
    listener: I_TerminalEvent[K]
  ): this {
    return super.off(event, listener);
  }

  removeListener<K extends keyof I_TerminalEvent>(
    event: K,
    listener: I_TerminalEvent[K]
  ): this {
    return super.removeListener(event, listener);
  }

  addListener<K extends keyof I_TerminalEvent>(
    event: K,
    listener: I_TerminalEvent[K]
  ): this {
    return super.addListener(event, listener);
  }
}
