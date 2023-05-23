import { component$, useComputed$, useSignal, $, Slot, useTask$, useVisibleTask$, useStore } from '@builder.io/qwik';
import { DocumentHead, Form, globalAction$, routeAction$, useNavigate, z, zod$ } from '@builder.io/qwik-city';
import DatePicker from '~/components/date-picker';
import Checkbox from '~/components/checkbox';
import Combobox from '~/components/combobox';
import { TimePerDayPicker } from '~/components/time-picker';
import { endOfDay, setHours, setMinutes, startOfDay } from 'date-fns';
import { nanoid } from 'nanoid';
import { getAppointmentKey, getUserKey } from '~/data/keys';
import { createQwikCompatibleKvClient } from './kv';
import { Appointment } from './[appointmentId]';

export const head: DocumentHead = {
  title: 'Poodle',
  meta: [
    {
      name: 'description',
      content: 'Find a date for your next event without the hassle.',
    },
  ],
};

export default component$(() => {
  const createAppointment = useCreateAppointment();
  const createUser = useCreateUser();
  const navigate = useNavigate();

  const selectedDates = useSignal(new Array<Date>());

  const store = useStore<AppointmentRequest>({
    availableTimes: [],
    creatorId: "",
    title: "",
    description: "",
    location: ""
  });

  const onSelectedDatesChanged = $((dates: Date[]) => {
    selectedDates.value = dates;
    store.availableTimes = dates.map(date => ({
      startTime: startOfDay(date),
      endTime: endOfDay(date)
    }));
  });

  const onSubmitClicked = $(async () => {
    const currentUserId = localStorage.getItem("user-id");
    if (currentUserId) {
      store.creatorId = currentUserId;
    } else {
      const createUserResponse = await createUser.submit({});
      if(createUserResponse.value.failed)
        throw new Error("Could not create user.");

      localStorage.setItem("user-id", createUserResponse.value.id!)
      store.creatorId = createUserResponse.value.id!;
    }

    const result = await createAppointment.submit(store);
    if(result.value.failed)
      throw new Error("Could not create appointment.");

    navigate(`/${result.value.id!}`)
  });

  return <>
    <Section
      title="What"
      description="Describe what your event is about."
    >
      <div class="sm:col-span-4">
        <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
        <div class="mt-2">
          <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              name="title"
              class="block flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="John's birthday party" />
          </div>
        </div>
      </div>

      <div class="col-span-full">
        <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
        <div class="mt-2">
          <textarea
            id="description"
            name="description"
            rows={3}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Looking forward to seeing you at my birthday party! Remember the presents."
          />
        </div>
      </div>
    </Section>

    <Section
      title="Where"
      description="Describe where to meet."
    >
      <div class="col-span-full">
        <label for="location" class="block text-sm font-medium leading-6 text-gray-900">Location</label>
        <div class="mt-2">
          <textarea
            id="location"
            name="location"
            rows={2}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Central Park"
          />
        </div>
      </div>
    </Section>

    <Section
      title="When"
      description="Add the times that are valid for attendees to pick from."
    >
      <DurationSection />

      <DateSection
        selectedDates={selectedDates.value}
        onChange$={dates => onSelectedDatesChanged(dates)}
      />

      <TimeSection
        dates={selectedDates.value}
      />
    </Section>

    <Section>
      <button
        onClick$={onSubmitClicked}
        type="submit"
        class="place-self-center w-64 col-span-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Save
      </button>
    </Section>
  </>
});

const Section = component$((props: {
  title?: string,
  description?: string
}) => {
  const classNameAdd = props.title || props.description ?
    "bg-white shadow-sm ring-1 ring-gray-900/5" :
    "";
  return <div class="space-y-10 divide-y divide-gray-900/10 mb-10">
    <div class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
      <div class="px-4 sm:px-0">
        {props.title &&
          <h2 class="text-base font-semibold leading-7 text-gray-900">{props.title}</h2>}

        {props.description &&
          <p class="mt-1 text-sm leading-6 text-gray-600">{props.description}</p>}
      </div>
      <div class={`${classNameAdd} sm:rounded-xl md:col-span-2`}>
        <div class="px-4 py-6 sm:p-8">
          <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <Slot />
          </div>
        </div>
      </div>
    </div>
  </div>
})

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

    result.splice(0, 1);

    return result;
  });

  const selectedDuration = useSignal<Duration>(() => durations.value[0]);

  return <div class="sm:col-span-4">
    <label for="Duration" class="block text-sm font-medium leading-6 text-gray-900">Duration</label>
    <div class="mt-2">
      <Combobox<Duration>
        values={durations.value}
        selectedValue={selectedDuration.value}
        onChange$={value => {
          selectedDuration.value = value;
        }}
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
        onChange$={isChecked => {
          useSameTimesForAllDates.value = isChecked;
        }}
      />
    </div>
    <div class="mt-5">
      {props.dates.map(date =>
        <TimePerDayPicker
          key={`time-per-day-picker-${date.toISOString()}`}
          day={date}
          onChange$={times => { }}
        />)}
    </div>
  </div>
})

const appointmentRequestSchema = z.object({
  creatorId: z.string(),
  title: z.string(),
  description: z.optional(z.string()),
  location: z.optional(z.string()),
  availableTimes: z.array(z.object({
    startTime: z.date(),
    endTime: z.date()
  }))
});
type AppointmentRequest = z.infer<typeof appointmentRequestSchema>;

export const useCreateAppointment = globalAction$(
  async (data, requestEvent) => {
    const appointmentId = nanoid();

    const kv = createQwikCompatibleKvClient();

    const creator = await kv.get(getUserKey(data.creatorId));
    if(!creator) {
      requestEvent.status(400);
      return {};
    }

    await kv.set(getAppointmentKey(appointmentId), {
      creatorId: data.creatorId,
      title: data.title,
      description: data.description,
      location: data.location,
      availableTimes: data.availableTimes.map(x => ({
        ...x,
        id: nanoid()
      })),
      attendees: []
    } as Appointment);

    return { id: appointmentId };
  },
  zod$(appointmentRequestSchema));

export const useCreateUser = globalAction$(
  async (data, requestEvent) => {
    const userId = nanoid();

    const kv = createQwikCompatibleKvClient();
    await kv.set(getUserKey(userId), {}, {});
    
    return { id: userId };
  },
  zod$(z.object({})));

