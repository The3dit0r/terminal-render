import { I_Transformer } from "./types";

export class TransformerSet<T = unknown> extends Array<I_Transformer<T, T>> {
  constructor(...tfs: I_Transformer<T, T>[]) {
    super();
    this.push(...tfs);
  }

  add(...tfs: I_Transformer<T, T>[]) {
    this.push(...tfs);
  }

  applyTo(input: T): T {
    let inp = input;

    for (const tf of this) {
      inp = tf.apply(inp);
    }

    return inp;
  }
}
