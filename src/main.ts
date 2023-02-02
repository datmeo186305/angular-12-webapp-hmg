import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: environment.SENTRY_DSN,
  environment: environment.PRODUCTION ? 'production' : 'dev',
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["https://hmg.monex.vn", "https://api-aws.epay.vn", /^\//],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0,
});


if (environment.PRODUCTION) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
