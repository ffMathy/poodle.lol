import { component$, useComputed$, useSignal } from "@builder.io/qwik";
import Combobox from "./combobox";
import { format, setHours, setMinutes } from "date-fns";
import Button from "./button";

const TimePicker = component$((props: {
    key?: string,
    selectedTime?: Date,
    class?: string,
    onChange$: (time: Date) => void
}) => {
    const times = useComputed$(() => {
        const result = new Array<Date>();
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 15) {
                result.push(
                    setMinutes(
                        setHours(
                            new Date(),
                            h),
                        m))
            }
        }

        return result;
    });

    return <Combobox<Date>
        key={`time-picker-${props.key}`}
        class={props.class}
        values={times.value}
        selectedValue={props.selectedTime}
        placeholder={format(setMinutes(setHours(new Date(), 0), 0), "p")}
        onChange$={props.onChange$}
        onRenderText$={date => format(date, "p")}
    />
})

export default TimePicker;

export const TimePerDayPicker = component$((props: {
    day: Date,
    onChange$: (times: Date[]) => void
}) => {
    const times = useSignal<Array<Date>>([props.day]);

    return <>
        <label for="about" class="block text-sm font-light leading-6 text-gray-900 mb-2">
            {format(props.day, "PPP")}
        </label>
        <div class="mb-5">
            {times.value.map((time, timeIndex) => 
                <div 
                    class="flex mb-2" 
                    key={`time-${props.day.toISOString()}-${timeIndex}`}
                >
                    <TimePicker
                        key={`time-picker-${props.day.toISOString()}-${timeIndex}`}
                        selectedTime={time}
                        onChange$={newTime => {
                            const timesCopy = [...times.value];
                            timesCopy[timeIndex] = setMinutes(
                                setHours(
                                    props.day,
                                    newTime.getHours()),
                                newTime.getMinutes());

                            times.value = timesCopy;
                            props.onChange$(timesCopy);
                        }}
                    />
                    <button type="button" class="ml-1 rounded-full p-1 text-indigo-600 focus-visible:outline">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            )}

            <Button
                class="mt-1"
                label="Add time"
                onClick$={() => {
                    times.value = [...times.value, props.day];
                }}
            >
                <svg q:slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

            </Button>
        </div>
    </>
})