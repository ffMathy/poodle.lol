import { component$, useComputed$, useSignal, useStore, useTask$, useVisibleTask$, $, JSXNode, Slot } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { trpc } from '../api/client';
import DatePicker from '~/components/date-picker';
import Checkbox from '~/components/checkbox';
import Combobox from '~/components/combobox';
import TimePicker, { TimePerDayPicker } from '~/components/time-picker';
import { setHours, setMinutes } from 'date-fns';
import { cloneDeep, find, groupBy } from 'lodash';

const Section = component$((props: {
  title: string,
  description: string
}) => {
  return <div class="space-y-10 divide-y divide-gray-900/10 mb-10">
    <div class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
      <div class="px-4 sm:px-0">
        <h2 class="text-base font-semibold leading-7 text-gray-900">{props.title}</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">{props.description}</p>
      </div>
      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div class="px-4 py-6 sm:p-8">
          <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <Slot />
          </div>
        </div>
      </div>
    </div>
  </div>
})

export default component$(() => {
  const selectedDates = useSignal(new Array<Date>());

  return <>
    <Section
      title="What"
      description="Describe what your event is about."
    >
      <div class="sm:col-span-4">
        <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
        <div class="mt-2">
          <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input type="text" autoComplete="name" class="block flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="John's birthday party" />
          </div>
        </div>
      </div>

      <div class="col-span-full">
        <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
        <div class="mt-2">
          <textarea id="about" name="about" rows={3} class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Looking forward to seeing you at my birthday party! Remember the presents."></textarea>
        </div>
      </div>
    </Section>

    <Section
      title="Where"
      description="Describe where to meet."
    >
      <div class="col-span-full">
        <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Location</label>
        <div class="mt-2">
          <textarea id="about" name="about" rows={2} class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Central Park"></textarea>
        </div>
      </div>
    </Section>

    <Section
      title="When"
      description="Describe what your event is about."
    >
      <DurationSection />

      <DateSection
        selectedDates={selectedDates.value}
        onChange$={dates => selectedDates.value = dates}
      />

      <TimeSection
        dates={selectedDates.value}
      />
    </Section>
  </>
});

const DateSection = component$((props: {
  selectedDates: Date[],
  onChange$: (dates: Date[]) => void
}) => {
  return <div class="col-span-full">
    <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Dates</label>
    <div class="mt-5">
      <DatePicker
        selectedDates={props.selectedDates}
        onChange$={props.onChange$}
      />
    </div>
  </div>
})

const DurationSection = component$(() => {
  type Duration = { hours: number, minutes: number };

  const durations = useComputed$(() => {
    const result = new Array<Duration>();
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
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
          if (!duration.hours)
            return `${duration.minutes}m`;

          return `${duration.hours}h ${duration.minutes}m`;
        }}
      />
    </div>
  </div>
});

const TimeSection = component$((props: {
  dates: Date[]
}) => {
  type TimesForDate = {
    date: Date,
    times: Date[]
  }

  const useSameTimesForAllDates = useSignal(false);

  const resetTime$ = $((time: Date) =>
    setMinutes(
      setHours(
        time,
        0),
      0));

  const copyTimeTo$ = $((time: Date, destination: Date) =>
    setMinutes(
      setHours(
        destination,
        time.getHours()),
      time.getMinutes()));

  const timesForDates = useSignal<TimesForDate[]>(props.dates.map(date => ({
    date,
    times: [
      date
    ]
  })));

  if (props.dates.length === 0) {
    return <div class="col-span-full">
      <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Times</label>
      <p class="mt-5 text-sm">
        Select one or more dates first.
      </p>
    </div>;
  }

  return <div class="col-span-full">
    <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Times</label>
    <div class="mt-5">
      <Checkbox
        label='Same time for all dates'
        isChecked={useSameTimesForAllDates.value}
        onChange$={isChecked => useSameTimesForAllDates.value = isChecked}
      />
    </div>
    <div class="mt-5">
      {props.dates.map(date =>
        <TimePerDayPicker
          day={date}
          onChange$={times => { }}
        />)}
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
