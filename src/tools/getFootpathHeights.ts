export const getFootpathHeights = (coords: CoordsXY | null) => {
  if (!coords) return [];

  const elements = map.getTile(coords.x / 32, coords.y / 32).elements;
  const heights = elements
    .filter((element) => element.type === "footpath")
    .map((path) => path.baseZ / 8);

  return [...heights].sort((a, b) => a - b);
};
