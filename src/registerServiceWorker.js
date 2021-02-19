import { Workbox, messageSW } from "workbox-window";

if (process.env.NODE_ENV === "production" && !process.env.BUID_CAP) {
  if ("serviceWorker" in navigator) {
    const wb = new Workbox(`${process.env.BASE_URL}service-worker.js`);
    let registration;

    const forceUpdate = () => {
      wb.addEventListener("controlling", () => {
        window.location.reload();
      });

      if (registration && registration.waiting) {
        // Send a message to the waiting service worker,
        // instructing it to activate.
        // Note: for this to work, you have to add a message
        // listener in your service worker. See below.
        messageSW(registration.waiting, { type: "SKIP_WAITING" });
      }
    };

    // Add an event listener to detect when the registered
    // service worker has installed but is waiting to activate.
    wb.addEventListener("waiting", forceUpdate);
    wb.addEventListener("externalwaiting", forceUpdate);
    wb.register().then((r) => (registration = r));
  }
}
