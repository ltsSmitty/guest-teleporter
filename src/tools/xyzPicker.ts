const pickerToolId = "ti-pick-xy";

/**
 * Starts a tool that allows the user to click on a track segment to select it.
 */
export function toggleXYZPicker(props: {
  isPressed: boolean;
  onMove: (coords: CoordsXYZ) => void;
  onPick: (coords: CoordsXYZ) => void;
  onFinish: () => void;
}): void {
  const { isPressed, onMove, onPick, onFinish } = props;
  if (isPressed) {
    ui.activateTool({
      id: pickerToolId,
      cursor: "cross_hair",
      onMove: (args) => {
        const coords = args.mapCoords;
        if (coords) {
          onMove(coords);
        }
      },
      onDown: (args) => {
        const coords = args.mapCoords;
        if (coords) {
          onPick(coords);
          ui.tool?.cancel();
        }
      },
      onFinish,
    });
  } else {
    const tool = ui.tool;
    if (tool && tool.id === pickerToolId) {
      tool.cancel();
    }
  }
}
