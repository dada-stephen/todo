// scripts/script.js
import { createTodoService } from "./services/TodoService.js";
import { createTodoInput } from "./components/TodoInput.js";
import { createTodoSwitch } from "./components/TodoSwitch.js";
import { createTodoTable } from "./components/TodoTable.js";

const service = createTodoService();
let showCompletedOnly = false;

const table = createTodoTable("#todo-table-body", {
  onEdit: (id, text) => {
    service.update(id, text);
    refresh();
  },
  onComplete: (id) => {
    service.setCompleted(id, true);
    refresh();
  },
  onIncomplete: (id) => {
    service.setCompleted(id, false);
    refresh();
  },
  onDelete: (id) => {
    service.delete(id);
    refresh();
  }
});

createTodoInput(".todo-input-field", ".todo-input-button", (text) => {
  service.add(text);
  refresh();
});

createTodoSwitch("#todo-switch", (checked) => {
  showCompletedOnly = checked;
  refresh();
});

const refresh = () => {
  const todos = showCompletedOnly ? service.getCompleted() : service.getAll();
  table.render(todos);
};

refresh();

// FAB overlay: expand from button position to full screen
const fab = document.getElementById("fab");
const overlay = document.getElementById("fab-overlay");

fab?.addEventListener("click", () => {
  const rect = fab.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  overlay.style.setProperty("--fab-x", `${x}px`);
  overlay.style.setProperty("--fab-y", `${y}px`);
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
});

overlay?.addEventListener("click", () => {
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
});
