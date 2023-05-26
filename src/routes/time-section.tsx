import { component$, useSignal, $ } from "@builder.io/qwik";
import { setMinutes, setHours } from "date-fns";
import Checkbox from "~/components/checkbox";
import { TimePerDayPicker } from "~/components/time-picker";

export const TimeSection = component$((props: {
    dates: Date[]
}) => {
    type TimesForDate = {
        date: Date,
        times: Date[]
    }

    const useSameTimesForAllDates = useSignal(false);

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