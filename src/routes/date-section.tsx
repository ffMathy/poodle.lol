import { component$ } from "@builder.io/qwik"
import DatePicker from "~/components/date-picker"

export const DateSection = component$((props: {
    selectedDates: Date[],
    onAdded: (date: Date) => void,
    onDeleted: (date: Date) => void
  }) => {
    return <div class="col-span-full">
      <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Dates</label>
      <div class="mt-5">
        <DatePicker
          selectedDates={props.selectedDates}
          onAdded={props.onAdded}
          onDeleted={props.onDeleted}
        />
      </div>
    </div>
  })