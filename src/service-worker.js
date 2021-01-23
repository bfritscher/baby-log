import { precacheAndRoute } from "workbox-precaching";
import { googleFontsCache, staticResourceCache } from "workbox-recipes";

addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

precacheAndRoute(self.__WB_MANIFEST);
googleFontsCache();
staticResourceCache();
