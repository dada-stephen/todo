/* ============================================================
   CONFIRM MODAL
   Uses CSS custom properties from variables.css for all colors.
   ============================================================ */

// Helper: read a CSS variable value from :root
const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const VARIANTS = {
  delete: {
    icon: "🗑️",
    iconBg: () => cssVar("--color-error-subtle"),
    iconColor: () => cssVar("--color-error"),
    accentColor: () => cssVar("--color-error"),
    confirmLabel: "Yes, delete",
    confirmBg: () => cssVar("--color-error"),
    confirmHover: () => cssVar("--color-error-dark")
  },
  complete: {
    icon: "✓",
    iconBg: () => cssVar("--color-success-subtle"),
    iconColor: () => cssVar("--color-success-dark"),
    accentColor: () => cssVar("--color-success"),
    confirmLabel: "Mark as complete",
    confirmBg: () => cssVar("--color-success"),
    confirmHover: () => cssVar("--color-success-dark")
  },
  warning: {
    icon: "⚠️",
    iconBg: () => cssVar("--color-warning-subtle"),
    iconColor: () => cssVar("--color-warning-dark"),
    accentColor: () => cssVar("--color-warning"),
    confirmLabel: "Yes, proceed",
    confirmBg: () => cssVar("--color-warning"),
    confirmHover: () => cssVar("--color-warning-dark")
  },
  info: {
    icon: "ℹ️",
    iconBg: () => cssVar("--color-info-subtle"),
    iconColor: () => cssVar("--color-info-dark"),
    accentColor: () => cssVar("--color-info"),
    confirmLabel: "Got it",
    confirmBg: () => cssVar("--color-info"),
    confirmHover: () => cssVar("--color-info-dark")
  }
};

let modalElements = null;
let currentOptions = {};

/* ── DOM bootstrap (lazy, runs once) ── */
const ensureModalDom = () => {
  if (modalElements) return modalElements;

  const overlay = document.createElement("div");
  overlay.className = "cm-overlay";
  overlay.id = "cm-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "cm-title");

  overlay.innerHTML = `
    <div class="cm-backdrop" id="cm-backdrop"></div>
    <div class="cm-card">
      <div class="cm-stripe" id="cm-stripe"></div>
      <div class="cm-body">
        <div class="cm-icon" id="cm-icon"></div>
        <h2 class="cm-title" id="cm-title"></h2>
        <p  class="cm-desc"  id="cm-desc"></p>
        <div class="cm-actions">
          <button class="cm-btn-cancel"  id="cm-cancel">Cancel</button>
          <button class="cm-btn-confirm" id="cm-confirm"></button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const els = {
    overlay,
    backdrop: overlay.querySelector("#cm-backdrop"),
    stripe: overlay.querySelector("#cm-stripe"),
    iconElement: overlay.querySelector("#cm-icon"),
    titleElement: overlay.querySelector("#cm-title"),
    descElement: overlay.querySelector("#cm-desc"),
    cancelElement: overlay.querySelector("#cm-cancel"),
    confirmElement: overlay.querySelector("#cm-confirm")
  };

  modalElements = els;

  /* ── Confirm button hover: swap bg to the variant's hover color ── */
  els.confirmElement.addEventListener("mouseenter", () => {
    const cfg = VARIANTS[currentOptions.variant] ?? VARIANTS.delete;
    els.confirmElement.style.background = cfg.confirmHover();
  });
  els.confirmElement.addEventListener("mouseleave", () => {
    const cfg = VARIANTS[currentOptions.variant] ?? VARIANTS.delete;
    els.confirmElement.style.background = cfg.confirmBg();
  });

  /* ── Dismiss triggers ── */
  els.backdrop.addEventListener("click", () => ConfirmModal.close());
  els.cancelElement.addEventListener("click", () => ConfirmModal.close());

  /* ── Confirm trigger ── */
  els.confirmElement.addEventListener("click", async () => {
    const { onConfirm } = currentOptions;
    if (typeof onConfirm !== "function") {
      ConfirmModal.close();
      return;
    }
    setLoading(true);
    try {
      await Promise.resolve(onConfirm());
    } finally {
      setLoading(false);
      ConfirmModal.close(true);
    }
  });

  /* ── Keyboard: Escape closes, Enter confirms ── */
  document.addEventListener("keydown", (e) => {
    if (!modalElements?.overlay.classList.contains("open")) return;
    if (e.key === "Escape") ConfirmModal.close();
    if (e.key === "Enter" && !els.confirmElement.disabled) {
      els.confirmElement.click();
    }
  });

  return modalElements;
};

/* ── Loading state ── */
const setLoading = (loading) => {
  if (!modalElements) return;
  const { confirmElement, cancelElement } = modalElements;
  const cfg = VARIANTS[currentOptions.variant] ?? VARIANTS.delete;

  confirmElement.disabled = loading;
  cancelElement.disabled = loading;

  if (loading) {
    confirmElement.innerHTML = `<span class="cm-spinner"></span> Working…`;
  } else {
    confirmElement.textContent =
      currentOptions.confirmLabel ?? cfg.confirmLabel;
  }
};

/* ── Apply variant styles ── */
const applyVariant = (cfg) => {
  const { stripe, iconElement, confirmElement } = modalElements;

  stripe.style.background = cfg.accentColor();
  iconElement.style.background = cfg.iconBg();
  iconElement.style.color = cfg.iconColor();
  iconElement.textContent = cfg.icon;
  confirmElement.style.background = cfg.confirmBg();
  confirmElement.style.color = cssVar("--color-neutral-0");
};

/* ── Public API ── */
export const ConfirmModal = {
  open(options = {}) {
    const els = ensureModalDom();
    const cfg = VARIANTS[options.variant] ?? VARIANTS.delete;
    currentOptions = options;

    applyVariant(cfg);

    els.titleElement.textContent = options.title ?? "Are you sure?";
    els.descElement.textContent =
      options.description ?? "This action cannot be undone.";
    els.cancelElement.textContent = options.cancelLabel ?? "Cancel";
    els.confirmElement.textContent = options.confirmLabel ?? cfg.confirmLabel;

    setLoading(false);

    // Slight delay so CSS transition has an initial state to animate from
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        els.overlay.classList.add("open");
        els.confirmElement.focus();
      });
    });
  },

  close(skipOnCancel = false) {
    if (!modalElements) return;
    modalElements.overlay.classList.remove("open");
    if (!skipOnCancel && typeof currentOptions.onCancel === "function") {
      currentOptions.onCancel();
    }
    currentOptions = {};
  }
};
