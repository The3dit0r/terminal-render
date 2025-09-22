import chalk from "chalk";
import stringWidth from "string-width";

import { ANSI_CODES } from "./const";
import type { I_Terminal } from "./types";

type T_Stream = {
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
};

const S_DEBUG = chalk.bgHex("#fff").hex("#000");

export class Terminal implements I_Terminal {
  frame = 0;

  private streams: T_Stream;

  private renderContent: string[] = [];
  private outputCache: string[] = [];

  private inputBuffer: string[] = [];

  constructor(streams: T_Stream = {}) {
    this.streams = streams;

    this.stdout.write(ANSI_CODES.HIDE_CURSOR);
  }

  get stdout() {
    return this.streams.stdout ?? process.stdout;
  }

  get stdin() {
    return this.streams.stdin ?? process.stdin;
  }

  get width() {
    return this.stdout.columns;
  }

  get height() {
    return this.stdout.rows;
  }

  /**
   * * Clear screen
   */
  private clearScreen() {
    this.stdout.write(ANSI_CODES.CLEAR_SCREEN);
  }

  /**
   * * Clear current line
   */
  private clearLine() {
    this.stdout.write(ANSI_CODES.CLEAR_LINE);
  }

  /**
   * * Move cursor to pos(x, y)
   * @param x Dest column index
   * @param y Dest row index
   */
  private cursorTo(x: number, y: number = 0) {
    this.stdout.write(ANSI_CODES.CURSOR_TO(y, x));
  }

  /**
   * * Write content to render's temporary buffer?
   * @param rawContent Unfiltered content
   */
  private writeToOutBuffer(rawContent: string) {
    const c = rawContent.split("\n");
    this.renderContent.push(...c);
  }

  log(str: string): void {
    this.writeToOutBuffer(str);
  }

  warn(str: string): void {
    this.writeToOutBuffer(str);
  }

  error(str: string): void {
    this.writeToOutBuffer(str);
  }

  mtSpacePad(c: string) {
    const w = this.width;
    return c.padEnd(w + c.length - stringWidth(c), " ") + "\n";
  }

  init() {
    this.clearScreen();
  }

  /**
   * Render current values of `renderBuffer`
   */
  async render() {
    let same = 0;
    let h = this.height - 2;

    for (let i = 0; i < h; i++) {
      this.cursorTo(0, i + 1);

      const line = this.renderContent[i] ?? "";
      const c = this.mtSpacePad(line);

      //? Disable output caching
      // if (this.outputCache[i] === c) {
      //   same++;
      //   continue;
      // }

      // this.outputCache[i] = c;
      this.stdout.write(c);
    }

    this.cursorTo(0, h + 1);
    const str = `Frame: ${this.frame++} | This: ${same - h}:${same}:${h}`;
    const status = this.mtSpacePad(str);

    this.stdout.write(S_DEBUG(status));
  }
}
