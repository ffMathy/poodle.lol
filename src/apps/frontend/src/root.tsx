import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head';

import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang="en" class="font-sans antialiased text-gray-600 min-h-full flex flex-col [overflow-anchor:none]">
        <div class="mx-auto max-w-container px-4 pt-4">
          <RouterOutlet />
          <ServiceWorkerRegister />
        </div>
      </body>
    </QwikCityProvider>
  );
});
