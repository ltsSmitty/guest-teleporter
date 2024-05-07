import {
  WindowTemplate,
  Colour,
  vertical,
  window as flexWindow,
  compute,
  label,
  store,
  WritableStore,
  toggle,
  spinner,
  horizontal,
} from "openrct2-flexui";
import { selectTile } from "../tools/selectTile";
import { getFootpathHeights } from "../tools/getFootpathHeights";
import { Teleporter } from "../controller";
import { initializeStore } from "../tools/saveStore";

let window: WindowTemplate;
let isWindowOpen = false;

const balloonToggleStore: WritableStore<boolean> = store<boolean>(false);
const balloonZStore: WritableStore<number | null> = store<number | null>(null);
const waterToggleStore: WritableStore<boolean> = store<boolean>(false);
const waterZStore: WritableStore<number | null> = store<number | null>(null);
const atmToggleStore: WritableStore<boolean> = store<boolean>(false);
const atmZStore: WritableStore<number | null> = store<number | null>(null);

export function initialize() {
  const teleporter = new Teleporter();
  const key = "guest-teleporter-multi";
  const balloonCoordsStore: WritableStore<CoordsXY | null> = initializeStore<CoordsXY | null>(`${key}-balloon-coords`);
  const waterCoordsStore: WritableStore<CoordsXY | null> = initializeStore<CoordsXY | null>(`${key}-water-coords`);
  const atmCoordsStore: WritableStore<CoordsXY | null> = initializeStore<CoordsXY | null>(`${key}-atm-coords`);

  window = flexWindow({
    title: "Guest Teleporter Multi",
    width: 300,
    height: 250,
    colours: [Colour.LightBlue, Colour.LightBlue],
    onOpen: () => (isWindowOpen = true),
    onClose: () => (isWindowOpen = false),
    content: [
      vertical([
        toggle({
          text: "Select balloon tile",
          onChange: (isChecked) => {
            balloonToggleStore.set(isChecked);
            if (isChecked) {
              selectTile({
                coordsStore: balloonCoordsStore,
                tileSelectionStore: balloonToggleStore,
                isPressed: isChecked,
                callback: (coords) => {
                  balloonZStore.set(getFootpathHeights(coords)[0]);
                  teleporter.setBalloonCoords({ ...coords, z: balloonZStore.get()! });
                },
              });
            }
          },
          isPressed: compute(balloonToggleStore, (tileSelection) => tileSelection),
        }),

        toggle({
          text: "Select water tile",
          onChange: (isChecked) => {
            waterToggleStore.set(isChecked);
            if (isChecked) {
              selectTile({
                coordsStore: waterCoordsStore,
                tileSelectionStore: waterToggleStore,
                isPressed: isChecked,
                callback: (coords) => {
                  waterZStore.set(getFootpathHeights(coords)[0]);
                  teleporter.setWaterCoords({ ...coords, z: waterZStore.get()! });
                },
              });
            }
          },
          isPressed: compute(waterToggleStore, (tileSelection) => tileSelection),
        }),
        toggle({
          text: "Select atm tile",
          onChange: (isChecked) => {
            atmToggleStore.set(isChecked);
            if (isChecked) {
              selectTile({
                coordsStore: atmCoordsStore,
                tileSelectionStore: atmToggleStore,
                isPressed: isChecked,
                callback: (coords) => {
                  atmZStore.set(getFootpathHeights(coords)[0]);
                  teleporter.setAtmCoords({ ...coords, z: atmZStore.get()! });
                },
              });
            }
          },
          isPressed: compute(atmToggleStore, (tileSelection) => tileSelection),
        }),
        toggle({
          text: "Turn on teleport",
          disabled: compute(
            balloonCoordsStore,
            waterCoordsStore,
            atmCoordsStore,
            (balloonCoords, waterCoords, atmCoords) => {
              return !balloonCoords || !waterCoords || !atmCoords;
            }
          ),
          onChange: (isChecked) => {
            if (isChecked) {
              teleporter.runTeleport(true);
            } else {
              teleporter.runTeleport(false);
            }
          },
        }),
      ]),
      label({
        text: compute(balloonCoordsStore, balloonZStore, (coords, z) => {
          if (!coords) return "{RED}Select a balloon tile";
          return `Balloon destination: (${coords.x / 32}, ${coords.y / 32}, ${z ? z : "__"})`;
        }),
      }),
      label({
        text: compute(waterCoordsStore, waterZStore, (coords, z) => {
          if (!coords) return "{RED}Select a water tile";
          return `Water destination: (${coords.x / 32}, ${coords.y / 32}, ${z ? z : "__"})`;
        }),
      }),
      label({
        text: compute(atmCoordsStore, atmZStore, (coords, z) => {
          if (!coords) return "{RED}Select a atm tile";
          return `Atm destination: (${coords.x / 32}, ${coords.y / 32}, ${z ? z : "__"})`;
        }),
      }),
      horizontal([
        label({ text: "Ticks between computation" }),
        spinner({
          width: 50,
          minimum: 1,
          value: teleporter.loopsBetweenComputations,
          onChange: (value) => {
            teleporter.loopsBetweenComputations.set(value);
          },
        }),
      ]),
      horizontal([
        label({ text: "Num guests process/tick (x100)" }),
        spinner({
          width: 50,
          minimum: 1,
          value: teleporter.eventsPerTickHundreds,
          onChange: (value) => {
            teleporter.eventsPerTickHundreds.set(value);
          },
        }),
        label({ text: "x100", width: 50 }),
      ]),
    ],
  });
}

/**
 * Opens the main window. If already open, the window will be focused.
 */
export function openWindow() {
  if (isWindowOpen) {
    window.focus();
  } else {
    window.open();
  }
}
