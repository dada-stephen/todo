import { ConfirmModal } from "../utils/confirmModal.js";

/** No-data empty state SVG */
const NO_DATA_SVG = `<svg class="no-data-icon" viewBox="0 0 64 41" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
    <ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7" />
    <g fill-rule="nonzero" stroke="#d9d9d9">
      <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
      <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#fafafa" />
    </g>
  </g>
</svg>`;

const createEmptyState = () => {
  const wrap = document.createElement("div");
  wrap.className = "todo-list-empty";
  wrap.innerHTML = `${NO_DATA_SVG}<p class="todo-list-empty__text">No todos yet</p><p class="todo-list-empty__hint">Add one with the button below</p>`;
  return wrap;
};

const createTodoCard = (todo, index, actions) => {
  const card = document.createElement("div");
  card.className = "item-card";

  const listIconSvg = `<svg class="item-card__type-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 4h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 8h6M7 11h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;

  card.innerHTML = `
    <div class="item-card__inner">
    <label class="item-card__toggle">
    <input
    type="checkbox"
    class="item-card__toggle-input"
    ${todo.completed ? "checked" : ""}
    aria-label="Mark todo as completed"
        />
        <span class="item-card__toggle-slider"></span>
        </label>
        <span class="item-card__type-icon">${listIconSvg}</span>

      <div class="item-card__body">
        <div class="item-card__text">
          <!-- <p class="item-card__index">#${index + 1}</p> -->
          <p class="item-card__title${todo.completed ? " item-card__title--completed" : ""}">
            ${todo.text}
          </p>
        </div>

        <div class="item-card__actions">
          <button type="button" class="item-card__icon-btn item-card__icon-btn--edit" aria-label="Edit todo">
            <svg class="item-card__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 13.5 13.06 4.44a1.5 1.5 0 0 1 2.12 0l.38.38a1.5 1.5 0 0 1 0 2.12L6.5 16H4v-2.5Z"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.5 5.5 14.5 8.5"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <button type="button" class="item-card__icon-btn item-card__icon-btn--delete" aria-label="Delete todo">
            <svg class="item-card__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
              <path
                d="M4.5 6.5h11"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
              />
              <path
                d="M8.5 3.5h3a1 1 0 0 1 1 1V5h-5v-.5a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 6.5v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  const toggleInput = card.querySelector(".item-card__toggle-input");
  const editBtn = card.querySelector(".item-card__icon-btn--edit");
  const deleteBtn = card.querySelector(".item-card__icon-btn--delete");
  const titleEl = card.querySelector(".item-card__title");

  if (toggleInput) {
    toggleInput.addEventListener("change", (event) => {
      const checked = event.target.checked;

      // If unchecking, just mark as incomplete directly
      if (!checked) {
        actions.onIncomplete(todo.id);
        return;
      }

      // If checking, confirm marking as completed
      event.target.checked = false;
      ConfirmModal.open({
        variant: "complete",
        title: "Mark this task as completed?",
        description: `"${todo.text}" will move to your completed list.`,
        onConfirm: () => {
          actions.onComplete(todo.id);
        }
      });
    });
  }

  if (editBtn && titleEl) {
    editBtn.addEventListener("click", () => {
      const current = todo.text;
      const input = document.createElement("input");
      input.type = "text";
      input.value = current;
      input.className = "todo-inline-edit";

      titleEl.replaceWith(input);
      input.focus();
      input.select();

      const commit = () => {
        const next = input.value.trim();
        if (next && next !== current) {
          actions.onEdit(todo.id, next);
        }
      };

      input.addEventListener("blur", commit, { once: true });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
        if (e.key === "Escape") {
          input.removeEventListener("blur", commit);
          input.replaceWith(titleEl);
        }
      });
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      ConfirmModal.open({
        variant: "delete",
        title: "Delete this task?",
        description: `"${todo.text}" will be permanently removed.`,
        onConfirm: () => {
          actions.onDelete(todo.id);
        }
      });
    });
  }

  return card;
};

export const createTodoListCards = (containerSelector, actions) => {
  const container = document.querySelector(containerSelector);

  const render = (todos) => {
    if (!container) return;
    container.innerHTML = "";
    if (todos.length === 0) {
      container.appendChild(createEmptyState());
      return;
    }
    todos.forEach((todo, index) => {
      container.appendChild(createTodoCard(todo, index, actions));
    });
  };

  return { render };
};
