import { component$, useSignal, $ } from '@builder.io/qwik';
import { DocumentHead, useNavigate } from '@builder.io/qwik-city';
import { SubmitHandler, getValue, getValues, insert, remove, setValues, useForm, zodForm$ } from '@modular-forms/qwik';
import { TimeSection } from './time-section';
import { DurationSection } from './duration-section';
import { DateSection } from './date-section';
import { Section } from './section';
import { AppointmentRequest, appointmentRequestSchema, useCreateAppointment, useCreateUser, useFormLoader } from './backend';
import { orderBy } from 'lodash';
import { format } from 'date-fns';

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

  const [form, { Form, Field, FieldArray }] = useForm({
    loader: useFormLoader(),
    validate: zodForm$(appointmentRequestSchema)
  });

  const onSelectedDatesChanged = $((dates: Date[]) => {
  });

  const onFormSubmitted: SubmitHandler<AppointmentRequest> = $(async (store) => {
    const currentUserId = localStorage.getItem("user-id");
    if (currentUserId) {
      store.creatorId = currentUserId;
    } else {
      const createUserResponse = await createUser.submit({});
      if (createUserResponse.value.failed)
        throw new Error("Could not create user.");

      localStorage.setItem("user-id", createUserResponse.value.id!)
      store.creatorId = createUserResponse.value.id!;
    }

    const result = await createAppointment.submit(store);
    if (result.value.failed)
      throw new Error("Could not create appointment.");

    navigate(`/${result.value.id!}`)
  });

  return <Form onSubmit$={onFormSubmitted}>
    <Section
      title="What"
      description="Describe what your event is about."
    >
      <div class="sm:col-span-4">
        <Field name="title">
          {(field, props) => <>
            <label for={props.name} class="block text-sm font-medium leading-6 text-gray-900">Title</label>
            <div class="mt-2">
              <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="text"
                  class="block flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="John's birthday party"
                  {...props} />
              </div>
            </div>
            {field.error && <p class="mt-2 text-sm text-red-600">{field.error}</p>}
          </>}
        </Field>
      </div>

      <div class="col-span-full">
        <Field name="description">
          {(field, props) => <>
            <label for={props.name} class="block text-sm font-medium leading-6 text-gray-900">Description</label>
            <div class="mt-2">
              <textarea
                rows={4}
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Looking forward to seeing you at my birthday party! Remember the presents."
                {...props}
              />
            </div>
            {field.error && <p class="mt-2 text-sm text-red-600">{field.error}</p>}
          </>}
        </Field>
      </div>
    </Section>

    <Section
      title="Where"
      description="Describe where to meet."
    >
      <div class="col-span-full">
        <Field name="location">
          {(field, props) => <>
            <label for={props.name} class="block text-sm font-medium leading-6 text-gray-900">Location</label>
            <div class="mt-2">
              <textarea
                rows={2}
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Central Park"
                {...props}
              />
            </div>
            {field.error && <p class="mt-2 text-sm text-red-600">{field.error}</p>}
          </>}
        </Field>
      </div>
    </Section>

    <Section
      title="When"
      description="Add the times that are valid for attendees to pick from."
    >
      <DurationSection />

      <DateSection
        selectedDates={selectedDates.value}
        onAdded={date => {
          selectedDates.value = orderBy([...selectedDates.value, date], x => x.getTime());
          insert(form, "startTimesPerDay", {
            value: {
              day: date,
              times: [date]
            },
            at: selectedDates.value.indexOf(date)
          });
        }}
        onDeleted={date => remove(
          form,
          "startTimesPerDay",
          { at: selectedDates.value.indexOf(date) })}
      />

      <FieldArray name="startTimesPerDay">
        {(fieldArray) => <>
          {fieldArray.items.map((item, index) =>
            <div key={item}>
              <label for="about" class="block text-sm font-light leading-6 text-gray-900 mb-2">
                {format(getValue(form, `${fieldArray.name}.${index}.day`)!, "PPP")}
              </label>
              <div class="mb-5">
                <Field name={`${fieldArray.name}.${index}.`}>
                  {(field, props) => <>
                    <TimeSection
                      dates={selectedDates.value}
                    />
                  </>}
                </Field>
              </div>
            </div>
          )}
        </>}
      </FieldArray>
    </Section>

    <Section>
      <button
        type="submit"
        class="place-self-center w-64 col-span-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Save
      </button>
    </Section>
  </Form >
});

