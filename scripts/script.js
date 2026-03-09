import { onSwitchChange, onDropdownToggle } from "./utils/index.js";

console.log("Hello World");

const todoSwitch = document.getElementById("todo-switch");

if (todoSwitch) {
  onSwitchChange(todoSwitch, (checked) => {
    console.log("Switch checked:", checked);
  });
}

const actionToggles = document.querySelectorAll(".todo-actions-toggle");

actionToggles.forEach((toggle) => {
  onDropdownToggle(toggle, (action) => {
    console.log(`Todo row action: ${action}`);
  });
});
