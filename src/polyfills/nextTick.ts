export function nextTick() {
  return new Promise<void>((resolve, reject) => {
    try {
      let subscription = context.subscribe("interval.tick", () => {
        try {
          subscription.dispose();
          resolve();
          // need to set to undefined to avoid memory leak
          // @ts-expect-error
          subscription = undefined;
        } catch (e) {
          reject(e);
          // need to set to undefined to avoid memory leak
          // @ts-expect-error
          subscription = undefined;
        }
      }) as IDisposable;
    } catch (e) {
      reject(e);
    }
  });
}
