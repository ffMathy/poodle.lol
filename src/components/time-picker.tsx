import { component$, useComputed$ } from "@builder.io/qwik";
import {Select} from "./select";
import { format, setHours, setMinutes } from "date-fns";

export const TimePicker = component$((props: {
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

    return <Select<Date>
        name={`time-picker-${props.key}`}
        key={`time-picker-${props.key}`}
        label="Pick time"
        class={props.class}
        options={times.value.map(x => ({
            label: format(x, "p"),
            value: x
        }))}
        value={props.selectedTime}
        placeholder={format(setMinutes(setHours(new Date(), 0), 0), "p")}
        onChange$={props.onChange$}
    />
})