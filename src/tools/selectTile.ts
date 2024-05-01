import { WritableStore } from "openrct2-flexui";
import { toggleXYZPicker } from "./xyzPicker";

export const selectTile = (props: {
  coordsStore: WritableStore<CoordsXY | null>;
  tileSelectionStore: WritableStore<boolean>;
  isPressed: boolean;
}) => {
  if (props.isPressed) {
    toggleXYZPicker({
      isPressed: props.isPressed,
      onMove: (coords) => (ui.tileSelection.tiles = [coords]),
      onPick: (coords) => {
        props.coordsStore.set(coords);
        props.tileSelectionStore.set(false);
      },
      onFinish: () => {},
    });
  }
};
