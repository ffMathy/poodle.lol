import { component$, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { trpc } from '../api/client';

export default component$(() => {
  const userId = useSignal<string>();

  useTask$(() => {
    async function task() {
      const existingUserId = localStorage.getItem("user-id");
      if(existingUserId) {
        userId.value = existingUserId;
        return;
      }

      const newUserId = await trpc.createUserId.query();
      localStorage.setItem("user-id", newUserId);
      userId.value = newUserId;
    }

    task();
  });

  return <>
    <div>
      Hello! Name from backend: {userId}
    </div>
  </>
});

export const head: DocumentHead = {
    title: 'Welcome to Qwik',
    meta: [
      {
        name: 'description',
        content: 'Qwik site description',
      },
    ],
  };
  