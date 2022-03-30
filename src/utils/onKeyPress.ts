export const onKeyPress = (code: string | number, callback: (e: KeyboardEvent) => unknown, once?: true) => {
  const clear = () => window.document.removeEventListener("keyup", handler);
  const handler = (e: KeyboardEvent) => {
    if (e.key === code) {
      callback(e);
      once && clear();
    }
  };
  window.document.addEventListener("keyup", handler);
  return clear;
};