import { component$, useComputed$, useSignal, useStore, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { trpc } from '../api/client';
import DatePicker from '~/components/date-picker';
import Checkbox from '~/components/checkbox';
import Combobox from '~/components/combobox';

export default component$(() => {
  return <form>
    <div class="space-y-6">
      <h2 class="text-base font-semibold leading-7 text-gray-900">New event poll</h2>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
          <div class="mt-2">
            <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input type="text" autoComplete="name" class="block flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="John's birthday party" />
            </div>
          </div>
        </div>

        <div class="sm:col-span-4">
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Your name</label>
          <div class="mt-2">
            <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input type="text" autoComplete="name" class="block flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="John Doe" />
            </div>
          </div>
        </div>

        <div class="col-span-full">
          <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
          <div class="mt-2">
            <textarea id="about" name="about" rows={3} class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Looking forward to seeing you at my birthday party! Remember the presents."></textarea>
          </div>
        </div>

        <div class="col-span-full">
          <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Location</label>
          <div class="mt-2">
            <textarea id="about" name="about" rows={2} class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Central Park"></textarea>
          </div>
        </div>

        <DurationSection />

        <div class="col-span-full">
          <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Dates</label>
          <div class="mt-5">
            <DatePicker />
          </div>
        </div>

        <TimeSection />
      </div>
    </div>
  </form>
});

const DurationSection = component$(() => {
  type Duration = { hours: number, minutes: number };

  const durations = useComputed$(() => {
    const result = new Array<Duration>();
    for(let h=0; h < 24; h++) {
      for(let m=0; m < 60; m += 15) {
        result.push({ hours: h, minutes: m })
      }
    }

    return result;
  });

  const selectedDuration = useSignal<Duration>(() => durations.value[0]);
  
  return <div class="sm:col-span-4">
    <label for="Duration" class="block text-sm font-medium leading-6 text-gray-900">Duration</label>
    <div class="mt-2">
      <Combobox<Duration>
        values={durations.value}
        selectedValue={selectedDuration.value}
        placeholder='0h 0m'
        onChange$={value => selectedDuration.value = value}
        onRenderText$={duration => {
          if(!duration.hours)
            return `${duration.minutes}m`;

          return `${duration.hours}h ${duration.minutes}m`;
        }}
    />
    </div>
  </div>
});

const TimeSection = component$(() => {
  const useSameTimesForAllDates = useSignal(true);

  return <div class="col-span-full">
    <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Times</label>
    <div class="mt-5">
      <Checkbox
        isChecked={useSameTimesForAllDates.value}
        onChange$={isChecked => useSameTimesForAllDates.value = isChecked}
      />
    </div>
  </div>
})

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
