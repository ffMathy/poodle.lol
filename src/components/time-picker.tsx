// import { component$, useComputed$, useSignal } from "@builder.io/qwik";
// import {Select} from "./select";
// import { format, setHours, setMinutes } from "date-fns";
// import Button from "./button";
// import { FieldElementProps, FieldPath, FieldValues } from "@modular-forms/qwik";

// export const TimePicker = component$(<TValue, TFieldValues extends FieldValues, TFieldPath extends FieldPath<TFieldValues>>(props: {
//     key?: string,
//     selectedTime?: Date,
//     class?: string,
//     onChange$: (time: Date) => void,
//     fieldProps: FieldElementProps<TFieldValues, TFieldPath>
// }) => {
//     const times = useComputed$(() => {
//         const result = new Array<Date>();
//         for (let h = 0; h < 24; h++) {
//             for (let m = 0; m < 60; m += 15) {
//                 result.push(
//                     setMinutes(
//                         setHours(
//                             new Date(),
//                             h),
//                         m))
//             }
//         }

//         return result;
//     });

//     return <Select
//         key={`time-picker-${props.key}`}
//         label="Pick duration"
//         class={props.class}
//         options={times.value}
//         selectedValue={props.selectedTime}
//         fieldProps={props.fieldProps}
//         placeholder={format(setMinutes(setHours(new Date(), 0), 0), "p")}
//         onChange$={props.onChange$}
//         onRenderLabelFromValue$={date => format(date, "p")}
//     />
// })