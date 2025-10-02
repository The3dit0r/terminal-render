import type { ChalkInstance } from "chalk";
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
  clear() : void;
  log(...arg: string[]): void;
  branchToModule?(moduleName : string) : void;
  event : TerminalEventEmitter;
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
  wasd(data : 0 | 1 | 2 | 3) : void;
  arrows(data : 0 | 1 | 2 | 3) : void;
  enter() : void;
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

export class TerminalModule {
  protected terminalPtr? : I_Terminal
  private listened : [keyof I_TerminalEvent, I_TerminalEvent[keyof I_TerminalEvent]][] = []

  listen<K extends keyof I_TerminalEvent>(event : K, listener : I_TerminalEvent[K]){
    if(!this.terminalPtr) return;
    this.listened.push( [event, listener] )
    this.terminalPtr.event.on(event, listener)
  }
  bind(terminal : I_Terminal){
    this.terminalPtr = terminal
  }
  start(){} 
  stop(){
    if(!this.terminalPtr) return
    this.listened.forEach(([k, f]) => this.terminalPtr!.event.off(k, f))
  }
}

export type ChalkFormatKeys = keyof {
  [k in keyof ChalkInstance as ChalkInstance[k] extends (s : string) => string ? k : never] : ChalkInstance[k]
}