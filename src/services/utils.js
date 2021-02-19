import { Capacitor, Plugins } from "@capacitor/core";
const { StatusBar } = Plugins;

export function setThemeColor(color) {
  const metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor.setAttribute("content", color);
  if (Capacitor.isNative) {
    StatusBar.setBackgroundColor({ color });
  }
}
