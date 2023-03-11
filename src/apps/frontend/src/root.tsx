import { component$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { trpc } from './api/client';

import './global.css';

export default component$(() => {
  const name = useSignal("<not loaded>");

  useVisibleTask$(() => {
    async function task() {
      const response = await trpc.userById.query("1");
      name.value = response.name;
    }

    task();
  })

  return <>
    <head>
      <meta charSet="utf-8" />
      <link rel="manifest" href="/manifest.json" />
    </head>
    <body lang="en">
      Hello world! Name from backend: {name}
    </body>
  </>
});
