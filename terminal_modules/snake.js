import chalk from "chalk"
import { rng } from "../dist/index.js"

export default Snake

function Snake(terminal){

const SnakeState = {
  empty : 0,
  snake_body : 1,
  snake_head : 2,
  food : 3,
  collision : 4,
}

Object.entries(SnakeState).forEach((val) => SnakeState[val[1]] = val[0])
terminal.log(SnakeState[0], SnakeState[1])

const SnakeStateStr = {
  empty : " ",
  snake_body : chalk.yellow("o"),
  snake_head : ["^", "<", "v", ">"].map(c => chalk.blue(c)),
  food : chalk.green("*"),
  collision : chalk.red("x"),
}

let w = 50;
let h = 20;

let k = new Array(h).fill(0);
k = k.map(() => new Array(w).fill(SnakeState.empty))

let x = Math.floor(w / 2);
let y = Math.floor(h / 2);
let l = 5;

const xyHistory = []

let lock = false
let cInput = []
let foodTimer = rng(20, 5, true)

function Wrap(n, limit){
  if(n === limit) return 0;
  while(n >= limit) n %= limit;
  while(n < 0) n = limit + n;
  return n;
}

function PrepareInput(){
  foodTimer--;
  if(foodTimer === 0){
    foodTimer = rng(20, 5, true)
    for(let i = 0; i < (w * h) / 2; i++){
      const xRand = rng(w - 1, 0, true);
      const yRand = rng(h - 1, 0, true);
      if(k[yRand][xRand] === SnakeState.empty){
        k[yRand][xRand] = SnakeState.food
        break
      }
    }
  }

  if(cInput.length === 0) return
  let lastInput
  cInput.forEach(input => {
    if(input) lastInput = input
    if(k[y][x] === SnakeState.snake_head) k[y][x] = SnakeState.snake_body

    if(input[0]) y = Wrap(y - 1, h);
    if(input[1]) x = Wrap(x - 1, w);
    if(input[2]) y = Wrap(y + 1, h);
    if(input[3]) x = Wrap(x + 1, w);
    xyHistory.push([x, y])

    if(xyHistory.length >= l){
      const head = xyHistory.splice(0, 1)[0];
      k[head[1]][head[0]] = SnakeState.empty //deleteing snake tail
    }
    if(k[y][x] === SnakeState.snake_body){
      k[y][x] = SnakeState.collision
    } else {
      if(k[y][x] === SnakeState.food) l++;
      k[y][x] = SnakeState.snake_head
    }
  })
  cInput = [cInput.at(-1)]
  return k.map(l => l.map(z => z === SnakeState.snake_head ? SnakeStateStr[SnakeState[z]][lastInput.indexOf(true)] : SnakeStateStr[SnakeState[z]]))  
}

function advance(){
  lock = true;
  const k = PrepareInput()
  if(!k) {
    lock = false;
    return;
  }
  terminal.clear()
  terminal.log(`----${x}, ${y}-----`)
  k.forEach(l => terminal.log(l.join("")))
  lock = false;
}

const intervalID = setInterval(advance, 300)

terminal.event.addListener("wasd", (input) => {
  if(!lock) {
    cInput.push(input)
  }
})

terminal.event.addListener("arrows", (input) => {
  if(!lock) {
    cInput.push(input)
  }
})

cInput.push([true, false, false, false])
advance()

}