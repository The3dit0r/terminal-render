const { Terminal } = require("./dist");
const Snake = require("./terminal_modules/snake")

// process.stdin.setEncoding('utf8'); //Patch fix
const terminal = new Terminal("Terminal v1.0.0");
terminal.start();

// terminal.defaultTag = "Untagged";

// terminal.tagColorMap.set("Console", "#2e85d6");
// terminal.tagColorMap.set("Number", "#1dea79");
// terminal.tagColorMap.set("Input", "#ea7d1dff");

// terminal.write("This is very cool", 12, "Hamburger", true);
// terminal.writeln("This is a new line");

// const testObject = {
//   name: "Hamburger",
//   exploit: function () {},

//   timeOccured: new Date(),
//   isTrue: false,
// };

// terminal.log(testObject);

terminal.log("This is from un untagged log, but this line is very long long");

// let counter = 0;

// setInterval(() => {
//   terminal.log("Counter is at:", counter++ + "");
// }, 1000);
terminal.registerModule("Snake", Snake.default)

terminal.event.addListener("input", (a) => {
  a = a.trim();

  const [cmd, ...args] = a.split(" ");

  switch (cmd) {
    case "q":
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

    case "snake": {
      terminal.branchToModule("Snake")
      //IDK HOW TO QUIT SNAKE
      break;
    }

    default: {
      terminal.log("Unknown command:", cmd);
    }
  }
});

// terminal.event.addListener("keyboard", (data) => {
//   const d = data.toString("hex");
//   const codes = d.split("").map(c => c.charCodeAt(0))
//   const guessNumber = Number.parseInt(d, 16)
//   const guessCharacter = String.fromCharCode(guessNumber)
//   terminal.log(`Debug: l = ${d.length}, d = ${d}, codes = [${codes}], guess = ${guessCharacter}`);
// });


// for (const c of ) {
// terminal.log([1, 2, 3, 34, 4, 5, 4, 65, 6, 6, 6, 6, 7, 7]);
// }
