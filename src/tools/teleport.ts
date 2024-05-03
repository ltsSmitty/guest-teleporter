const teleportGuest = (guest: Guest, coords: CoordsXYZ) => {
  if (!guest.isInPark) return;

  const modifiedCoords = {
    x: coords.x,
    y: coords.y,
    z: coords.z,
  };
  // pick up
  context.executeAction(
    "peeppickup",
    {
      type: 0,
      id: guest.id,
      x: -32768,
      y: 0,
      z: 0,
      playerId: 0,
      // flags: -2147483648,
    },
    async (res) => {
      if (res.error) {
        // console.log(`Guest ${guest.id} not able to be picked up; likely on ride`, res);
        return;
      }
      // set down
      await context.executeAction(
        "peeppickup",
        {
          type: 2,
          id: guest.id,
          ...modifiedCoords,
          playerId: 0,
          flags: -2147483648,
        },
        (res) => {
          if (res.error) {
            // console.log("set down error", res);
          }
        }
      );
    }
  );
};

const teleportAll = (coords: CoordsXYZ) => {
  const modifiedCoords = {
    x: coords.x + 16,
    y: coords.y + 16,
    z: coords.z,
  };
  const guests = map.getAllEntities("guest");
  guests.forEach((guest) => {
    if (!guest.isInPark) return;
    // pick up
    context.executeAction(
      "peeppickup",
      {
        type: 0,
        id: guest.id,
        x: -32768,
        y: 0,
        z: 0,
        playerId: 0,
        flags: -2147483648,
      },
      (res) => {
        if (res.error) {
          console.log(`Guest ${guest.id} not able to be picked up; likely on ride`, res);
          return;
        }
        // set down
        context.executeAction(
          "peeppickup",
          {
            type: 2,
            id: guest.id,
            ...modifiedCoords,
            playerId: 0,
            flags: -2147483648,
          },
          (res) => {
            if (res.error) {
              console.log("set down error", res);
            }
          }
        );
      }
    );
  });
};

export { teleportGuest, teleportAll };
