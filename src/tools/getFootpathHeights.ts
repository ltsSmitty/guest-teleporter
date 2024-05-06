export const getFootpathHeights = (coords: CoordsXY | null) => {
  if (!coords) return [];

  const elements = map.getTile(coords.x / 32, coords.y / 32).elements;
  let heights = elements.filter((element) => element.type === "footpath").map((path) => path.baseZ);

  if (heights.length === 0) {
    heights = elements.filter((element) => element.type === "surface").map((surface) => surface.baseZ);
  }

  return [...heights].sort((a, b) => a - b);
};
