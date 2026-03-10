import { onDropdownToggle } from "../utils/index.js";

const activateInlineEdit = (todo, taskCell, onEdit) => {
  const original = todo.text;
  taskCell.innerHTML = "";

  const input = document.createElement("input");
  input.type = "text";
  input.value = original;
  input.className = "todo-inline-edit";
  taskCell.appendChild(input);
  input.focus();
  input.select();

  const commit = () => {
    const newText = input.value.trim();
    if (newText && newText !== original) {
      onEdit(todo.id, newText);
    } else {
      taskCell.textContent = original;
    }
  };

  input.addEventListener("blur", commit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
    if (e.key === "Escape") {
      input.removeEventListener("blur", commit);
      taskCell.textContent = original;
    }
  });
};

const createRow = (todo, serial, actions) => {
  const row = document.createElement("tr");

  const snCell = document.createElement("td");
  snCell.textContent = serial;

  const taskCell = document.createElement("td");
  taskCell.textContent = todo.text;

  const actionsCell = document.createElement("td");
  actionsCell.innerHTML = `
    <div class="todo-actions">
      <button type="button" class="todo-actions-toggle"
        aria-haspopup="true" aria-expanded="false">&#x22EE;</button>
      <div class="todo-actions-menu" role="menu">
        <button type="button" class="todo-actions-item" data-action="edit">Edit</button>
        <button type="button" class="todo-actions-item"
          data-action="${todo.completed ? "mark-incomplete" : "mark-completed"}">
          ${todo.completed ? "Mark as Incomplete" : "Mark as Completed"}
        </button>
        <button type="button" class="todo-actions-item" data-action="delete">Delete</button>
      </div>
    </div>`;

  const toggle = actionsCell.querySelector(".todo-actions-toggle");
  onDropdownToggle(toggle, (action) => {
    if (action === "edit") activateInlineEdit(todo, taskCell, actions.onEdit);
    else if (action === "mark-completed") actions.onComplete(todo.id);
    else if (action === "mark-incomplete") actions.onIncomplete(todo.id);
    else if (action === "delete") actions.onDelete(todo.id);
  });

  row.appendChild(snCell);
  row.appendChild(taskCell);
  row.appendChild(actionsCell);
  return row;
};

export const createTodoTable = (tbodySelector, actions) => {
  const tbody = document.querySelector(tbodySelector);

  const render = (todos) => {
    if (!tbody) return;
    tbody.innerHTML = "";
    todos.forEach((todo, index) => {
      tbody.appendChild(createRow(todo, index + 1, actions));
    });
  };

  return { render };
};
