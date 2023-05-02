import { component$, useComputed$, useSignal } from "@builder.io/qwik";
import Combobox from "./combobox";
import { format, setHours, setMinutes } from "date-fns";
import Button from "./button";

const TimePicker = component$((props: {
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
        class={props.class}
        values={times.value}
        selectedValue={props.selectedTime}
        placeholder={format(setMinutes(setHours(new Date(), 0), 0), "p")}
        onChange$={props.onChange$}
        onRenderText$={date =>
            format(date, "p")}
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
                <TimePicker
                    class="mb-2"
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
                />)}
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