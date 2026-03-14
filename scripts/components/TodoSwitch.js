import { onSwitchChange } from "../utils/index.js";

export const createTodoSwitch = (checkboxSelector, onChange) => {
  const checkbox = document.querySelector(checkboxSelector);
  onSwitchChange(checkbox, onChange);
};
