import * as window from "./ui/window";
export async function startup() {
  if (typeof ui !== "undefined") {
    window.initialize();

    const menuItemName = "Guest Teleporter - multi";
    ui.registerMenuItem(menuItemName, window.openWindow);
  }
}
