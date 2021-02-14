import { precacheAndRoute, matchPrecache } from "workbox-precaching";
import { googleFontsCache, staticResourceCache } from "workbox-recipes";
import { setCatchHandler } from "workbox-routing";

addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

precacheAndRoute(self.__WB_MANIFEST);
googleFontsCache();
staticResourceCache();

// Catch routing errors, like if the user is offline
setCatchHandler(async ({ event }) => {
  // Return the precached offline page if a document is being requested
  if (event.request.destination === "document") {
    return matchPrecache("./index.html");
  }

  return Response.error();
});
