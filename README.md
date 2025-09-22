# Terminal (Render)

A terminal that renders text! Very cool!

<img width="1498" height="838" alt="image" src="https://github.com/user-attachments/assets/26530b95-8d64-48da-a309-48829f318223" />

### 1. Features

1. It prints stuff you want
2. It recieves stuff from keyboard.
3. It responses to keystroke!
4. It looks nice.

> One of a kind if I say so myself /s

### 2. How to run the dang thing?



``` bash
# Node version required: Node v18.0.0 or newer (I think so . . .) 
npm run dev
```

### 3. Events Handlers

The current version supports 2 custom events, technically just 1, but cut the slack alright?

#### Raw input from keyboard
```ts
// Fires when recieved a keySTROKE. 
on("keyboard", (data: Buffer<ArrayBufferLike>) => void);
```

#### String input (command submission)
```ts
// Fires when recieved the enter, gives what ever is in the buffer in string.
on("input", (data: string => void);
```

> More events Coming Soon™


### 4. Testing

Testing is done via [Jest](https://jestjs.io/) 

``` bash
# Comes with 1 test, which doesn't even 'add' anything to do the package.
npm run jest
```

### Example

```ts
// Importing and initialize the terminal!
const { Terminal } = require("./dist");

const terminal = new Terminal("Terminal Name - v1.0.0");
terminal.start();

// const testObject = {
//   name: "Hamburger",
//   exploit: function () {},
// 
//   timeOccured: new Date(),
//   isTrue: false,
// };

// terminal.log(testObject); // Object logging is temporary disabled.

terminal.log("This is from un untagged log, but this line is very long long");

terminal.event.addListener("input", (a) => {
  a = a.trim();

  const [cmd, ...args] = a.split(" ");

  switch (cmd) {
    case "quit": {
      process.exit(0);
    }

    case "cls":
    case "clear": {
      terminal.clear();
      break;
    }

    case "echo": {
      const text = args.join(" ");
      terminal.log(text);

      break;
    }

    default: {
      terminal.log("Unknown command:", cmd);
    }
  }
});

terminal.event.addListener("keyboard", (data) => {
  const d = data.toString("hex");
});
```


### 6. Contribution

Please send help! I don't know what the hell I am doing! Thank you in advance!



---
Thanks!

