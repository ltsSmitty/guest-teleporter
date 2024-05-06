export const getFootpathHeights = (coords: CoordsXY | null) => {
  if (!coords) return [];

  const elements = map.getTile(coords.x / 32, coords.y / 32).elements;
  let pathHeights = elements.filter((element) => element.type === "footpath").map((path) => path.baseZ);
  let surfaceHeights = elements.filter((element) => element.type === "surface").map((surface) => surface.baseZ);

  const heights = [...pathHeights, ...surfaceHeights];
  const uniqueHeights = heights.filter((height, index) => heights.indexOf(height) === index);
  return uniqueHeights.sort((a, b) => a - b);
};
