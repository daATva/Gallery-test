export const toggleClass = (
  selector: string,
  className: string,
  isActive: boolean,
): void => {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) return;

  if (isActive) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
};
