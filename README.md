# Terminal (Render)

***Update October 1st 2023 : Terminal is now modular***

A terminal that renders text! Very cool!

<img width="1498" height="838" alt="image" src="https://github.com/user-attachments/assets/26530b95-8d64-48da-a309-48829f318223" />

## 1. Features

1. It prints stuff you want.
2. It recieves stuff from keyboard.
3. It responses to keystroke!
4. It looks nice.
5. Modular + branch based operations

> One of a kind if I say so myself /s

## 2. How to run the dang thing?



``` bash
# Node version required: Node v18.0.0 or newer (I think so . . .) 
npm run dev
```

## 3. Basic commands

The base terminal in the given test sets up the following commands:
+ ***q or quit*** : exit
+ ***b or back*** : go back a menu (a module internally)
+ ***cls or clear*** : clear the screen


## 3. Events Handlers

The current version supports 2 custom events, technically just 1, but cut the slack alright?

### Raw input from keyboard
```ts
// Fires when recieved a keySTROKE. 
on("keyboard", (data: Buffer<ArrayBufferLike>) => void);
```

### String input (command submission)
```ts
// Fires when recieved the [Enter]/[Return] key, gives whatever is in the buffer as string.
on("input", (data: string => void);
```

### Arrows and WASD detection 
```ts
on("wasd", (data : 0 | 1 | 2 | 3) => void);
on("arrows", (data : 0 | 1 | 2 | 3) => void);
```
A boolean array representing up = 0, left = 1, down = 2, right = 3 firing
> Nemonics is the index of the keys in ***"wasd"***

### Enter key
```ts
on("Enter", () => void);
```
This detects specifically the enter key, cause why not

> More events Coming Soon™


## 4. Testing

Testing is done via [Jest](https://jestjs.io/) 

``` bash
# Comes with 1 test, which doesn't even 'add' anything to do the package.
npm run jest
```

### Example

```ts
// Update October 1st 2023 : This is the new nicer opening menu + debugger test 
const { Terminal, TerminalModule, delay } = require("./dist");

async function main(){
  const terminal = new Terminal("Terminal v1.0.0");
  terminal.start();
  terminal.addCommonCommands();

  const k = new Array(5).fill(undefined)
  k[3] = "debug"
  k[4] = "exit"

  terminal.registeerModule("Test_menu", new TerminalModule.menu([
    "choice 1",
    "choice 2",
    "choice 3",
    "Enter debug mode",
    "quit"
  ], k, "===>", ["green", "bgWhite", "bold"], "Welcome to a test menu!", "~".repeat(10)));

  terminal.registerModule("debug", new TerminalModule.debug(["yellow", "italic", "bold"], "String received:"))
  terminal.registerModule("exit", new TerminalModule.exit())
  await delay(500)

  terminal.branchToModule("Test_mnu");
}
main()
```

## 5. Contributions

### Adding more modules

The base class for a terminal module looks like this:
```ts
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
```

Only way to switch module is a method in the base terminal class, called ```branchToModule(k : string)```, invoking this calls ```start()``` automatically, while ```stop()``` is called for the current module (if any).

If a module wishes to add an event listener to the terminal, do so ```super.listen()``` so that the function may be automatically cleared (if ```stopp()``` is not overridden) when exiting the module.

Simply extending from this class if you wish to add more modules

Think of modules like menus, which prints a given stuff to the screen and may switch to other menus

### Original author note about contributions
I don't know what the hell I am doing! 

***Please send help!***

Thank you in advance!


---
Thank you for spending your precious time checking this package out!

