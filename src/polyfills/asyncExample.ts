import { nextTick } from "./nextTick";

export async function getAverageGrassLength() {
  let steps = 0;
  let grassLength = 0;
  let grassCount = 0;
  const size = map.size;
  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      const tile = map.getTile(x, y);
      const numElements = tile.numElements;
      for (let i = 0; i < numElements; i++) {
        const el = tile.getElement(i);
        switch (el.type) {
          case "surface":
            const surfaceEl = el as SurfaceElement;
            if (surfaceEl.surfaceStyle === 0) {
              grassLength += surfaceEl.grassLength;
              grassCount++;
            }
            break;
        }
      }

      steps++;
      if (steps >= 1000) {
        steps = 0;
        await nextTick();
      }
    }
  }

  if (grassCount == 0) return 0;
  console.log("Grass count", grassCount, "all grass length", grassLength);
  return Math.round(grassLength / grassCount);
}
