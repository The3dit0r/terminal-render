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

// @WARN below code no longer works
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

// terminal.log("This is from un untagged log, but this line is very long long");
