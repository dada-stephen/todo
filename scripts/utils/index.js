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
