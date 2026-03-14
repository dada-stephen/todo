import { createTodoService } from "./services/TodoService.js";
import { createTodoInput } from "./components/TodoInput.js";
import { createTodoListCards } from "./components/TodoListCards.js";
import { toast } from "./utils/toast.js";

const service = createTodoService();
let filterStatus = "all"; // 'all' | 'active' | 'completed'
let searchQuery = "";
let viewAll = false;

const sharedActions = {
  onEdit: (id, text) => {
    service.update(id, text);
    refresh();
    toast.success("Todo updated");
  },
  onComplete: (id) => {
    service.setCompleted(id, true);
    refresh();
    toast.success("Marked as completed");
  },
  onIncomplete: (id) => {
    service.setCompleted(id, false);
    refresh();
    toast.info("Marked as active");
  },
  onDelete: (id) => {
    service.delete(id);
    refresh();
    toast.success("Todo deleted");
  }
};

const cardsRecent = createTodoListCards("#todo-recent-cards", sharedActions);
const cards = createTodoListCards("#todo-list-cards", sharedActions);

const handleAddTodo = (text) => {
  const trimmed = text.trim();
  if (!trimmed) {
    // toast.error("Please enter a todo");
    return;
  }
  service.add(trimmed);
  refresh();
  toast.success("Todo added");
};

createTodoInput(".todo-input-field", ".todo-input-button", handleAddTodo);

const searchElement = document.getElementById("todo-search");
const filterButtons = document.querySelectorAll(".todo-filter__btn");

if (searchElement) {
  searchElement.addEventListener("input", () => {
    searchQuery = searchElement.value.trim().toLowerCase();
    refresh();
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");
    if (!filter) return;
    filterStatus = filter;
    filterButtons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.getAttribute("data-filter") === filter
      );
      button.setAttribute(
        "aria-selected",
        button.getAttribute("data-filter") === filter ? "true" : "false"
      );
    });
    refresh();
  });
});

const recentSection = document.getElementById("todo-recent");
const fullListSection = document.getElementById("todo-full-list");
const viewAllBtn = document.getElementById("todo-view-all");
const backRecentBtn = document.getElementById("todo-back-recent");

function setViewAll(showFull) {
  viewAll = showFull;
  if (recentSection) recentSection.hidden = viewAll;
  if (fullListSection) fullListSection.hidden = !viewAll;
}

if (viewAllBtn) {
  viewAllBtn.addEventListener("click", () => setViewAll(true));
}
if (backRecentBtn) {
  backRecentBtn.addEventListener("click", () => setViewAll(false));
}

const refresh = () => {
  const allTodos = service.getAll();
  const completedTodos = service.getCompleted();
  const activeTodos = allTodos.filter((todo) => !todo.completed);

  // Recent: first 5 active (newest first — service already prepends new items)
  const recentActive = activeTodos.slice(0, 5);
  cardsRecent.render(recentActive);

  // Full list: filter + search (only when viewing all)
  let visibleTodos =
    filterStatus === "completed"
      ? completedTodos
      : filterStatus === "active"
        ? activeTodos
        : allTodos;

  if (searchQuery) {
    visibleTodos = visibleTodos.filter((t) =>
      t.text.toLowerCase().includes(searchQuery)
    );
  }

  cards.render(visibleTodos);

  // dashboard counts
  const totalCountElement = document.getElementById("total-count");
  const activeCountElement = document.getElementById("active-count");
  const completedCountElement = document.getElementById("completed-count");

  const total = allTodos.length;
  const completed = completedTodos.length;
  const active = total - completed;

  if (totalCountElement) totalCountElement.textContent = String(total);
  if (activeCountElement) activeCountElement.textContent = String(active);
  if (completedCountElement)
    completedCountElement.textContent = String(completed);
};

refresh();

const fab = document.getElementById("fab");
const overlay = document.getElementById("overlay");

if (fab && overlay) {
  const updateFabOrigin = () => {
    const rect = fab.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    overlay.style.setProperty("--ox", `${cx}px`);
    overlay.style.setProperty("--oy", `${cy}px`);
  };

  // Set initial origin so the first click doesn't start from center
  updateFabOrigin();
  window.addEventListener("resize", updateFabOrigin);

  const toggleOverlay = (open) => {
    // Always recalc origin so close animation collapses back to the FAB
    updateFabOrigin();

    const isOpen =
      typeof open === "boolean" ? open : !overlay.classList.contains("is-open");

    overlay.classList.toggle("is-open", isOpen);
    fab.classList.toggle("is-open", isOpen);
    overlay.setAttribute("aria-hidden", String(!isOpen));
    fab.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  fab.addEventListener("click", () => {
    toggleOverlay();
  });

  document.querySelectorAll(".todo-add-new").forEach((btn) => {
    btn.addEventListener("click", () => toggleOverlay(true));
  });

  // Wire overlay input to add + close
  const overlayInput = overlay.querySelector(".todo-input-field");
  const overlayButton = overlay.querySelector(".todo-input-button");

  if (overlayInput && overlayButton) {
    const submitFromOverlay = () => {
      const value = overlayInput.value;
      handleAddTodo(value);
      overlayInput.value = "";
      toggleOverlay(false);
    };

    overlayButton.addEventListener("click", submitFromOverlay);
    overlayInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitFromOverlay();
      }
    });
  }
}
