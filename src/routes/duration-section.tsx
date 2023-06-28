import { component$, useComputed$, useSignal } from "@builder.io/qwik";
import { FieldElementProps, FieldPath, FieldStore, FieldValues } from "@modular-forms/qwik";
import Combobox from "~/components/combobox";
import ErrorLabel from "~/components/error-label";

export const DurationSection = component$(<TFieldValues extends FieldValues, TFieldPath extends FieldPath<TFieldValues>>(props: {
  fieldStore: FieldStore<TFieldValues, TFieldPath>,
  fieldProps: FieldElementProps<TFieldValues, TFieldPath>
}) => {
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
      <label for={props.fieldProps.name} class="block text-sm font-medium leading-6 text-gray-900">
        Duration
      </label>
      <div class="mt-2">
        <Combobox
          fieldProps={props.fieldProps}
          values={durations.value}
          selectedValue={selectedDuration.value}
          onChange$={(value) => {
            selectedDuration.value = value;
          }}
          label="Duration"
          onRenderText$={duration => {
            if (!duration.hours)
              return `${duration.minutes}m`;
  
            return `${duration.hours}h ${duration.minutes}m`;
          }}
        />
        <ErrorLabel error={props.fieldStore.error} />
      </div>
    </div>
  });