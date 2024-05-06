import * as window from "./ui/window";

export function startup() {
  if (typeof ui !== "undefined") {
    window.initialize();

    const menuItemName = "Guest Teleporter - All";
    ui.registerMenuItem(menuItemName, window.openWindow);
  }
}
