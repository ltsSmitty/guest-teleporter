import { WritableStore, store } from "openrct2-flexui";
import { TeleportDestination, getTeleportDestination } from "./tools/getTeleportDestination";
import { teleportGuest } from "./tools/teleport";
import { nextTick } from "./polyfills/nextTick";

export class CoordController {
  private waterCoordsStore: WritableStore<CoordsXYZ | null> = store<CoordsXYZ | null>(null);
  private balloonCoordsStore: WritableStore<CoordsXYZ | null> = store<CoordsXYZ | null>(null);
  private atmCoordsStore: WritableStore<CoordsXYZ | null> = store<CoordsXYZ | null>(null);

  setWaterCoords(coords: CoordsXYZ) {
    this.waterCoordsStore.set(coords);
  }

  setBalloonCoords(coords: CoordsXYZ) {
    this.balloonCoordsStore.set(coords);
  }

  setAtmCoords(coords: CoordsXYZ) {
    this.atmCoordsStore.set(coords);
  }

  getDestinationCoords(type: TeleportDestination, coords: CoordsXYZ): CoordsXYZ | undefined {
    switch (type) {
      case "water":
        const waterCoords = this.waterCoordsStore.get();
        if (!waterCoords) {
          throw new Error("No water store");
        }
        if (coordsAreNear(coords, waterCoords)) {
          return;
        }
        return waterCoords;
      case "balloon":
        const balloonCoords = this.balloonCoordsStore.get();
        if (!balloonCoords) {
          throw new Error("No balloon store");
        }
        if (coordsAreNear(coords, balloonCoords)) {
          return;
        }
        return balloonCoords;

      case "atm":
        const atmCoords = this.atmCoordsStore.get();
        if (!atmCoords) {
          throw new Error("No atm store");
        }
        if (coordsAreNear(coords, atmCoords!)) {
          return;
        }
        return atmCoords;
    }
  }
}

export class Teleporter {
  private coordController: CoordController = new CoordController();
  private activeStore: WritableStore<boolean> = store<boolean>(false);
  eventsPerTickHundreds: WritableStore<number> = store<number>(10);
  loopsBetweenComputations: WritableStore<number> = store<number>(20);
  subscription: IDisposable | undefined;
  setWaterCoords(coords: CoordsXYZ) {
    this.coordController.setWaterCoords(coords);
  }
  setBalloonCoords(coords: CoordsXYZ) {
    this.coordController.setBalloonCoords(coords);
  }
  setAtmCoords(coords: CoordsXYZ) {
    this.coordController.setAtmCoords(coords);
  }

  constructor() {
    this.loopsBetweenComputations.subscribe((interval) => {
      this.subscription?.dispose();
      this.subscription = this.createTeleportSubscription(interval);
    });
  }

  async runTeleport(active = true) {
    this.activeStore.set(active);
    if (active) {
      console.log("creating tick subscription");
      this.subscription = this.createTeleportSubscription(this.loopsBetweenComputations.get());
    } else {
      if (this.subscription?.dispose) {
        console.log("disposing of tick subscription");
        this.subscription.dispose();
        this.subscription = undefined;
      }
    }
  }

  createTeleportSubscription(ticks: number) {
    // get the guests when the plugin is activated, and not again
    const guests = map.getAllEntities("guest");
    const handle = createTickSubscription(ticks, async () => {
      let steps = 0;
      let total = 0;

      for (let i = 0; i < guests.length; i++) {
        const guest = guests[i];
        if (!guest || !guest.isInPark) {
          continue;
        }
        this.teleportGuest(guest);
        steps++;

        if (steps >= this.eventsPerTickHundreds.get() * 100) {
          total += steps;
          steps = 0;
          console.log(`hit ${total} steps, waiting for next tick`);
          await nextTick();
        }
      }
      console.log(`teleported ${guests.length} guests`);
    });
    return handle;
  }

  private async teleportGuest(guest: Guest) {
    const destinationType: TeleportDestination = getTeleportDestination(guest);
    const teleportCoords = this.coordController.getDestinationCoords(destinationType, {
      x: guest.x,
      y: guest.y,
      z: guest.z,
    });
    if (!teleportCoords) {
      return;
    }

    teleportGuest(guest, teleportCoords);
  }
}

const coordsAreNear = (coords1: CoordsXYZ, coords2: CoordsXYZ): boolean => {
  return (
    Math.abs(coords1.x - coords2.x) <= 32 &&
    Math.abs(coords1.y - coords2.y) <= 32 &&
    Math.abs(coords1.z - coords2.z) <= 16
  );
};

export const createTickSubscription = (tickInterval: number, callback: () => void) => {
  let ticks = 0;
  return context.subscribe("interval.tick", () => {
    ticks++;
    console.log("tick", ticks, ticks % tickInterval === 0);
    if (ticks % tickInterval === 0) {
      callback();
    }
  });
};
