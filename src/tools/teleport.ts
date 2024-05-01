const teleportAll = (coords: CoordsXYZ) => {
  const guests = map.getAllEntities("guest");
  guests.forEach((guest) => {
    guest.x = coords.x + 16;
    guest.y = coords.y + 16;
    guest.z = coords.z * 8;
  });
};

export { teleportAll };
