import { component$, useComputed$, useSignal } from "@builder.io/qwik";
import Combobox from "~/components/combobox";

export const DurationSection = component$(() => {
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
        <Combobox
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