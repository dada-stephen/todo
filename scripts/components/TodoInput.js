export const createTodoInput = (inputSelector, buttonSelector, onAdd) => {
  const input = document.querySelector(inputSelector);
  const button = document.querySelector(buttonSelector);

  if (!input || !button) return;

  const submit = () => {
    const text = input.value;
    onAdd(text);
    input.value = "";
    input.focus();
  };

  button.addEventListener("click", submit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submit();
  });
};
