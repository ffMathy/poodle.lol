import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import { DocumentHead, routeLoader$, useNavigate } from '@builder.io/qwik-city';
import { InitialValues, SubmitHandler, getValue, getValues, insert, remove, replace, setValue, setValues, swap, useForm, zodForm$ } from '@modular-forms/qwik';
import { getDurationsInMinutes, renderLabelFromValue as getLabelFromDurationInMinutes } from './duration-section';
import { DateSection } from './date-section';
import { Section } from './section';
import { AppointmentRequest, appointmentRequestSchema, defaultAppointmentRequest, useCreateAppointment, useCreateUser } from './backend';
import { orderBy, times } from 'lodash';
import { format, setHours, setMinutes } from 'date-fns';
import { time } from 'console';
import Button from '~/components/button';
import { InputError } from '~/components/input-error';
import { start } from 'repl';
import { TextInput } from '~/components/text-input';
import { TextArea } from '~/components/text-area';
import { Select } from '~/components/select';
import { TimePicker } from '~/components/time-picker';

export const head: DocumentHead = {
  title: 'Poodle',
  meta: [
    {
      name: 'description',
      content: 'Find a date for your next event without the hassle.',
    },
  ],
};

export const useFormLoader = routeLoader$<InitialValues<AppointmentRequest>>(() => defaultAppointmentRequest as InitialValues<AppointmentRequest>);

export default component$(() => {
  const createAppointment = useCreateAppointment();
  const createUser = useCreateUser();
  const navigate = useNavigate();

  const [form, { Form, Field, FieldArray }] = useForm({
    loader: useFormLoader(),
    validate: zodForm$(appointmentRequestSchema),
    fieldArrays: [
      "startTimesPerDay",
      "startTimesPerDay.$.times"
    ]
  });

  const onFormSubmitted: SubmitHandler<AppointmentRequest> = $(async (store: AppointmentRequest) => {
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

  return <>
    {process.env.NODE_ENV === "development" && <div class="mb-5">
      <button class="bg-red-400" onClick$={() => {
        const values = getValues(form);
        console.log(values);
      }}>
        Fetch form
      </button>
    </div>}
    <Form onSubmit$={onFormSubmitted} shouldActive={false}>

      <Section
        title="What"
        description="Describe what your event is about."
      >
        <div class="sm:col-span-4">
          <Field name="title">
            {(field, props) =>
              <TextInput
                {...props}
                type="text"
                error={field.error}
                value={field.value}
                label="Title"
                placeholder="John's birthday party" />}
          </Field>
        </div>

        <div class="col-span-full">
          <Field name="description">
            {(field, props) =>
              <TextArea
                {...props}
                error={field.error}
                value={field.value}
                label="Description"
                placeholder="Looking forward to seeing you at my birthday party! Remember the presents." />}
          </Field>
        </div>
      </Section>

      <Section
        title="Where"
        description="Describe where to meet."
      >
        <div class="col-span-full">
          <Field name="location">
            {(field, props) =>
              <TextArea
                {...props}
                error={field.error}
                value={field.value}
                label="Location"
                placeholder="Central Park" />}
          </Field>
        </div>
      </Section>

      <Section
        title="When"
        description="Add the times that are valid for attendees to pick from."
      >
        <div class="sm:col-span-4">
          <Field name="durationInMinutes" type="number">
            {(field, props) =>
              <Select<number>
                {...props}
                value={getValue(form, field.name, { shouldActive: false })}
                options={getDurationsInMinutes().map(durationInMinutes => ({
                  label: getLabelFromDurationInMinutes(durationInMinutes),
                  value: durationInMinutes
                }))}
                label="Duration"
                onChange$={value => setValue(form, field.name, value)}
              />}
          </Field>
        </div>

        <DateSection
          key="date-section"
          onAdded$={date => {
            insert(form, "startTimesPerDay", {
              value: {
                day: date,
                times: [{ date }]
              }
            });
          }}
          onDeleted$={index => {
            remove(
              form,
              "startTimesPerDay",
              {
                at: index
              });
          }}
        />

        <FieldArray name="startTimesPerDay">
          {(startTimesPerDayArray) => <>
            <InputError error={startTimesPerDayArray.error} />

            {startTimesPerDayArray.items.map((item, dayIndex) => {
              const day = getValue(form, `${startTimesPerDayArray.name}.${dayIndex}.day`, {
                shouldActive: false
              })!;
              return <div key={item} class="col-span-full">
                <label for="about" class="block text-sm font-light leading-6 text-gray-900 mb-2">
                  {format(day, "PPP")}
                </label>
                <div>
                  <FieldArray name={`${startTimesPerDayArray.name}.${dayIndex}.times`}>
                    {(timeFieldArray) => <>
                      {timeFieldArray.items.map((item, timeIndex) =>
                        <div
                          key={`time-${item}-${timeIndex}`}
                          class="flex mb-2"
                        >
                          <Field name={`${timeFieldArray.name}.${timeIndex}.date`} type="Date">
                            {(field, props) => {
                              return <TimePicker
                                {...props}
                                selectedTime={getValue(form, field.name, { shouldActive: false })}
                                onChange$={newTime => {
                                  setValue(form, field.name, newTime);
                                }}
                              />
                            }
                            }
                          </Field>
                          <button
                            title="Remove time"
                            hidden={timeFieldArray.items.length === 1}
                            type="button"
                            class="ml-1 rounded-full p-1 text-indigo-600 focus-visible:outline"
                            onClick$={() => {
                              remove(form, timeFieldArray.name, { at: timeIndex })
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </>}
                  </FieldArray>

                  <Button
                    class="mt-1"
                    label="Add time"
                    onClick$={() => {
                      insert(form, `${startTimesPerDayArray.name}.${dayIndex}.times`, {
                        value: { date: day }
                      });
                    }}
                  >
                    <svg q:slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                  </Button>
                </div>
              </div>
            })}
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
    </Form>
  </>
});

