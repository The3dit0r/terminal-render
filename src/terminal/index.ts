import chalk from "chalk";

import { format } from "date-fns";

import {
  realLen,
  TerminalEventEmitter,
  TerminalSettings,
  type I_Terminal,
} from "./utils";

import { ANSI_CODES, isANSI } from "./ansi";

export class Terminal implements I_Terminal {
  name: string;

  inputBuffer: string[] = [];
  outputBuffer: string[] = [];

  settings = new TerminalSettings();

  readonly event = new TerminalEventEmitter();

  constructor(name = "Unnamed Terminal") {
    this.name = name;
  }

  //* Public property

  static get width() {
    return process.stdout.columns;
  }

  static get height() {
    return process.stdout.rows;
  }

  get inputBufferStr() {
    return this.inputBuffer.join("");
  }

  //TODO: Not sure "so-so" access, seperate them if possible - will be public for now!

  clearInputBuffer() {
    this.inputBuffer = [];
  }

  //* Private methods / handlers

  private println(...content: string[]) {
    process.stdout.write(content.join(" ") + "\n");
  }

  private print(...content: string[]) {
    process.stdout.write(content.join(" "));
  }

  private addToOutputBuffer(...c: string[]) {
    this.outputBuffer.unshift(c.join(" ").trim());

    //? Re-render logs/output
    // this.drawLog();
  }

  private addToInputBuffer(c: string) {
    switch (c) {
      case "\r": {
        // case "\n":
        // this.log("New input:", this.inputBufferStr);
        this.event.emit("input", this.inputBufferStr);
        this.clearInputBuffer();
        break;
      }

      case "\b": {
        this.inputBuffer.pop();
        break;
      }

      default: {
        if (isANSI(c)) return;
        this.inputBuffer.push(c);
        break;
      }
    }

    //? Re-render input
    // this.drawInput();
  }

  private renderFrame() {
    this.drawLog();
    this.drawInput();
  }

  private handleInput(d: Buffer<ArrayBufferLike>) {
    const char = d.toString();

    this.event.emit("keyboard", d);
    let index = "wasd".indexOf(char)

    if(index >= 0){
      const res : boolean[] = new Array(4).fill(false)
      res[index] = true
      this.event.emit("wasd", res as any)
    }

    index = [
      '1b5b41',
      '1b5b44',
      '1b5b42',
      '1b5b43'
    ].indexOf(d.toString("hex"))

    if(index >= 0){
      const res : boolean[] = new Array(4).fill(false)
      res[index] = true
      this.event.emit("arrows", res as any)
    }

    this.addToInputBuffer(char);
  }

  private drawLog() {
    const H = Terminal.height;

    for (let i = 0; i < H - 2; i++) {
      const line = (this.outputBuffer[i] ?? "").slice(0, Terminal.width);

      this.println(
        ANSI_CODES.CURSOR_TO(H - 2 - i, 0),
        ANSI_CODES.CLEAR_LINE,
        line
      );
    }

    // this.print(ANSI_CODES.RESTORE_CURSOR);
  }

  private drawInput() {
    const H = Terminal.height;
    const W = Terminal.width;

    this.println(ANSI_CODES.CURSOR_TO(H - 2, 0));
    this.println("─".repeat(W));

    const HSS = chalk.hex("#0a7424")("\ue0b6");
    const STATUS = chalk.bgHex("#0a7424").bold("\uebb1 READY ");
    const MODE = chalk.bgHex("#055adb")(" \udb81\udfb7 Mode: INPUT  ");
    const AUTH = chalk.bgHex("#000000ff")(" \uf2bd USER ");
    const TIME = chalk.bgHex("#ed7b24").hex("#000")(
      format(new Date(), " EEE, MMM dd, yyyy ")
    );

    const P = `${HSS}${STATUS}${TIME}${MODE}${AUTH} \ueb70 `;
    const PLC = chalk.gray("Enter a command line . . .");
    const I = this.inputBuffer.join("");

    const CARAT = this.settings.get("caretChar");
    const C = P + (I ? I + "|" : "|" + PLC);

    this.print(C.padEnd(W + C.length - realLen(C), " "));

    // this.print(ANSI_CODES.SAVE_CURSOR);
  }

  //* Public method

  private int: any;

  clear() {
    // process.stdout.write(ANSI_CODES.CLEAR_SCREEN);
    this.outputBuffer = [];
  }

  start() {
    this.print(ANSI_CODES.HIDE_CURSOR);

    process.stdin.setRawMode(true);
    process.stdin.on("data", this.handleInput.bind(this));
    process.stdout.on("resize", this.renderFrame.bind(this));

    process.on("SIGKILL", () => this.stop());
    process.on("exit", () => this.stop());

    this.println(ANSI_CODES.CLEAR_SCREEN);
    this.renderFrame();

    this.int = setInterval(this.renderFrame.bind(this), 30);
  }

  stop() {
    process.stdin.setRawMode(false);
    process.stdout.off("resize", this.renderFrame.bind(this));
    process.stdin.off("data", this.handleInput.bind(this));

    this.println(ANSI_CODES.CLEAR_SCREEN);
    this.print(ANSI_CODES.SHOW_CURSOR);
    console.log("HALTED! Process killed");

    clearInterval(this.int);
  }

  log(...arg: string[]): void {
    const stamp = format(new Date(), "[kk:mm:ss]");
    this.addToOutputBuffer(chalk.cyan(stamp), ...arg);
  }

  private storedModules = new Map<string, ((t : I_Terminal) => any)>()

  registerModule(k : string, m : (t : I_Terminal) => any){
    this.storedModules.set(k, m)
    this.log(`Loaded module ${k}`)
  }

  branchToModule(k : string){
    const f = this.storedModules.get(k)
    if(typeof f !== "function") {
      this.log(`No module named ${k} registered`);
      return;
    }
    f(this)
  }
}
