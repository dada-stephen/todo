const ICONS = {
  success: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="8" r="7"/><polyline points="5,8.5 7,10.5 11,6"/>
  </svg>`,
  error: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="8" cy="8" r="7"/><line x1="5.5" y1="5.5" x2="10.5" y2="10.5"/><line x1="10.5" y1="5.5" x2="5.5" y2="10.5"/>
  </svg>`,
  warning: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 2L14.5 13.5H1.5Z"/><line x1="8" y1="6.5" x2="8" y2="9.5"/><circle cx="8" cy="11.5" r="0.5" fill="currentColor"/>
  </svg>`,
  info: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="8" cy="8" r="7"/><line x1="8" y1="7" x2="8" y2="11"/><circle cx="8" cy="5" r="0.5" fill="currentColor"/>
  </svg>`,
  default: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="8" cy="8" r="7"/>
  </svg>`,
  loading: `<div class="toast-spinner"></div>`,
  close: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/>
  </svg>`
};

const getContainer = (() => {
  let container = null;
  return () => {
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    return container;
  };
})();

const removeToast = (element, immediate = false) => {
  if (!element || element.classList.contains("is-exiting")) return;
  if (immediate) {
    element.remove();
    return;
  }
  element.classList.add("is-exiting");
  element.addEventListener("animationend", () => element.remove(), {
    once: true
  });
};

const createToast = (message, options = {}) => {
  const {
    type = "default",
    description = null,
    duration = 3000,
    action = null,
    id = Date.now()
  } = options;

  const container = getContainer();

  const existing = container.querySelector(`[data-toast-id="${id}"]`);
  if (existing) removeToast(existing, true);

  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.setAttribute("data-toast-id", id);

  const descHTML = description
    ? `<p class="toast-description">${description}</p>`
    : "";

  const actionHTML = action
    ? `<div class="toast-action"><button class="toast-action-btn">${action.label}</button></div>`
    : "";

  el.innerHTML = `
    <span class="toast-icon">${
      type === "loading" ? ICONS.loading : ICONS[type] || ICONS.default
    }</span>
    <div class="toast-body">
      <p class="toast-title">${message}</p>
      ${descHTML}
      ${actionHTML}
    </div>
    <button class="toast-close" aria-label="Dismiss">${ICONS.close}</button>
    ${
      type !== "loading"
        ? `<div class="toast-progress" style="animation-duration:${duration}ms"></div>`
        : ""
    }
  `;

  if (action) {
    el.querySelector(".toast-action-btn").addEventListener("click", () => {
      action.onClick?.();
      removeToast(el);
    });
  }

  el.querySelector(".toast-close").addEventListener("click", () =>
    removeToast(el)
  );

  let timer = null;

  const scheduleRemoval = () => {
    if (type === "loading" || duration === Infinity) return;
    timer = setTimeout(() => removeToast(el), duration);
  };

  el.addEventListener("mouseenter", () => {
    const bar = el.querySelector(".toast-progress");
    if (bar) bar.style.animationPlayState = "paused";
    if (timer) clearTimeout(timer);
  });

  el.addEventListener("mouseleave", () => {
    const bar = el.querySelector(".toast-progress");
    if (bar) bar.style.animationPlayState = "running";
    if (type !== "loading") scheduleRemoval();
  });

  container.appendChild(el);
  scheduleRemoval();

  return id;
};

const dismissById = (id) => {
  const element = document.querySelector(`[data-toast-id="${id}"]`);
  if (element) removeToast(element);
};

const dismissAll = () => {
  document.querySelectorAll(".toast").forEach((el) => removeToast(el));
};

const toast = (message, options = {}) =>
  createToast(message, { ...options, type: "default" });

toast.success = (message, options = {}) =>
  createToast(message, { ...options, type: "success" });

toast.error = (message, options = {}) =>
  createToast(message, { ...options, type: "error" });

toast.warning = (message, options = {}) =>
  createToast(message, { ...options, type: "warning" });

toast.info = (message, options = {}) =>
  createToast(message, { ...options, type: "info" });

toast.loading = (message, options = {}) =>
  createToast(message, {
    ...options,
    type: "loading",
    duration: Infinity
  });

toast.promise = (promise, { loading, success, error }) => {
  const id = toast.loading(loading);
  promise
    .then((data) => {
      const message = typeof success === "function" ? success(data) : success;
      createToast(message, { type: "success", id });
    })
    .catch((err) => {
      const message = typeof error === "function" ? error(err) : error;
      createToast(message, { type: "error", id });
    });
  return id;
};

toast.dismiss = dismissById;
toast.dismissAll = dismissAll;

export { toast };
