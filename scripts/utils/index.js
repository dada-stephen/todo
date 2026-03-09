export const WindowExists = () => typeof window !== "undefined";

export const saveStorage = (key, value) => {
  if (WindowExists()) {
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  }
};

export const loadStorage = (key) => {
  if (WindowExists()) {
    const stringValue = localStorage.getItem(key);
    if (stringValue === null) {
      return null;
    }
    try {
      return JSON.parse(stringValue);
    } catch (e) {
      return stringValue;
    }
  }
  return null;
};

export const removeStorage = (key, clearAll = false) => {
  if (WindowExists()) {
    if (clearAll) {
      localStorage.clear();
    } else {
      localStorage.removeItem(key);
    }
  }
};

export const onSwitchChange = (checkbox, callback) => {
  let switchElement = null;

  if (typeof checkbox === "string") {
    switchElement = document.querySelector(checkbox);
  } else {
    switchElement = checkbox;
  }

  if (
    !(switchElement instanceof HTMLInputElement) ||
    switchElement.type !== "checkbox"
  )
    return;
  if (typeof callback !== "function") return;

  switchElement.addEventListener("change", () =>
    callback(switchElement.checked)
  );
};

export const onDropdownToggle = (button, onAction) => {
  const toggle =
    typeof button === "string"
      ? document.querySelector(button)
      : button;

  if (!toggle || !(toggle instanceof HTMLElement)) return;

  const menu = toggle.nextElementSibling;
  if (!menu || !(menu instanceof HTMLElement)) return;

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (action && typeof onAction === "function") {
      onAction(action, target);
    }
    closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!menu.classList.contains("is-open")) return;
    if (event.target === toggle || menu.contains(event.target)) return;
    closeMenu();
  });
};
