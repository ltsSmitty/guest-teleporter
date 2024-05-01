import {
  WindowTemplate,
  Colour,
  vertical,
  horizontal,
  button,
  listview,
  window as flexWindow,
  compute,
  label,
  store,
  WritableStore,
} from "openrct2-flexui";
import { selectTile } from "../tools/selectTile";
import { getFootpathHeights } from "../tools/getFootpathHeights";
import { teleportAll } from "../tools/teleport";

let window: WindowTemplate;
let isWindowOpen = false;

const coordsStore: WritableStore<CoordsXY | null> = store<CoordsXY | null>(null);
const tileSelectionStore: WritableStore<boolean> = store<boolean>(false);
const zOptionsStore: WritableStore<number[]> = store<number[]>([]);
const selectedZIndexStore: WritableStore<number | null> = store<number | null>(null);

export function initialize() {
  window = flexWindow({
    title: "Guest Teleporter",
    width: 200,
    height: 150,
    colours: [Colour.LightBlue, Colour.LightBlue],
    onOpen: () => (isWindowOpen = true),
    onClose: () => (isWindowOpen = false),
    content: [
      vertical([
        horizontal([
          button({
            text: "Select tile",
            onClick: () => {
              let picking = tileSelectionStore.get();
              tileSelectionStore.set(!picking);
              selectTile({
                coordsStore,
                tileSelectionStore,
                isPressed: !picking,
              });
            },
            isPressed: compute(tileSelectionStore, (tileSelection) => tileSelection),
          }),
          listview({
            width: 100,
            canSelect: true,
            columns: [{ header: "Path heights" }],
            items: compute(coordsStore, (coords) => {
              zOptionsStore.set(getFootpathHeights(coords));
              return zOptionsStore.get().map((z) => `${z}`);
            }),
            onClick: (index) => selectedZIndexStore.set(index),
          }),
        ]),
        horizontal([
          button({
            text: "Teleport guests",
            disabled: compute(coordsStore, selectedZIndexStore, (coords, selectedZIndex) => {
              return !coords || selectedZIndex === null;
            }),
            onClick: () => {
              if (!coordsStore.get() || selectedZIndexStore.get() === null) return;
              teleportAll({
                x: coordsStore.get()!.x,
                y: coordsStore.get()!.y,
                z: zOptionsStore.get()[selectedZIndexStore.get()!],
              });
            },
          }),
        ]),
        label({
          text: compute(coordsStore, selectedZIndexStore, (coords, selectedZIndex) => {
            if (!coords) return "{RED}Select a tile";
            if (selectedZIndex === null) return "{RED}Select a path z height";
            return `Selected destination: (${coords.x / 32}, ${coords.y / 32}, ${zOptionsStore.get()[selectedZIndex]})`;
          }),
        }),
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
