import { WritableStore } from "openrct2-flexui";
import { toggleXYZPicker } from "./xyzPicker";

export const selectTile = (props: {
  coordsStore: WritableStore<CoordsXY | null>;
  tileSelectionStore: WritableStore<boolean>;
  isPressed: boolean;
  callback?: (coords: CoordsXYZ) => void;
}) => {
  if (props.isPressed) {
    toggleXYZPicker({
      isPressed: props.isPressed,
      onMove: (coords) => (ui.tileSelection.tiles = [coords]),
      onPick: (coords) => {
        props.coordsStore.set(coords);
        props.tileSelectionStore.set(false);
        if (props.callback) props.callback(coords);
      },
      onFinish: () => {
        props.tileSelectionStore.set(false);
      },
    });
  }
};
