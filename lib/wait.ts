export const wait = (ms: number = 300): Promise<boolean> =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));
