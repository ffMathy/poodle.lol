import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

import Header from '~/components/header';
import Footer from '~/components/footer';

import { Analytics } from '@vercel/analytics/react';

export default component$(() => {
  return (
    <div class="page">
      <main>
        <Header />
        <Slot />
      </main>
      <div class="section dark">
        <div class="container">
          <Footer />
        </div>
      </div>
      <Analytics />
    </div>
  );
});
