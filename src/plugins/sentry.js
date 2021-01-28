import Vue from "vue";
import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";
import { Integrations } from "@sentry/tracing";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://e685ca32271d4359a4e723124ef77872@sentry.j42.org/19",
    autoSessionTracking: true,
    integrations: [
      new VueIntegration({
        Vue,
        tracing: true,
        logErrors: true
      }),
      new Integrations.BrowserTracing()
    ],
    tracingOptions: {
      trackComponents: true
    },
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0
  });
}
