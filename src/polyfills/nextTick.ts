export function nextTick() {
  return new Promise<void>((resolve, reject) => {
    try {
      const subscription = context.subscribe("interval.tick", () => {
        try {
          subscription.dispose();
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}
