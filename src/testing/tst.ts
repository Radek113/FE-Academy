/** Helpers for the `data-tst` attribute convention used to locate elements in tests. */
export const tst = (id: string): string => `[data-tst="${id}"]`;

export const queryTst = <T extends HTMLElement = HTMLElement>(
  root: ParentNode,
  id: string,
): T | null => root.querySelector<T>(tst(id));

export const queryAllTst = <T extends HTMLElement = HTMLElement>(
  root: ParentNode,
  id: string,
): T[] => Array.from(root.querySelectorAll<T>(tst(id)));

export const getTst = <T extends HTMLElement = HTMLElement>(root: ParentNode, id: string): T => {
  const element: T | null = queryTst<T>(root, id);
  if (!element) {
    throw new Error(`No element with data-tst="${id}"`);
  }
  return element;
};
