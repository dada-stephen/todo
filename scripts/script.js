import { onSwitchChange } from "./utils/index.js";

console.log("Hello World");

const todoSwitch = document.getElementById("todo-switch");

if (todoSwitch) {
  onSwitchChange(todoSwitch, (checked) => {
    console.log("Switch checked:", checked);
  });
}
