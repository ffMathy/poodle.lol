import { routeLoader$, globalAction$, zod$ } from "@builder.io/qwik-city";
import { InitialValues } from "@modular-forms/qwik";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getUserKey, getAppointmentKey } from "~/utils/keys";
import { createQwikCompatibleKvClient } from "~/utils/kv";
import { Appointment } from "./[appointmentId]";
import { add, addMinutes } from "date-fns";


export const appointmentRequestSchema = z.object({
    creatorId: z.string(),
    title: z
        .string()
        .nonempty("You must specify a title."),
    description: z
        .string()
        .optional(),
    location: z
        .string()
        .optional(),
    durationInMinutes: z
        .number()
        .nonnegative("Minutes must be positive."),
    startTimesPerDay: z
        .array(z
            .object({
                day: z
                    .date(),
                times: z
                    .array(z.date())
                    .nonempty("You must specify at least one time for all the dates selected.")
            }))
        .nonempty("You must specify at least one date.")
});
export type AppointmentRequest = z.infer<typeof appointmentRequestSchema>;

export const defaultAppointmentRequest: AppointmentRequest = {
    startTimesPerDay: [] as any,
    durationInMinutes: 15,
    creatorId: "",
    title: "",
    description: "",
    location: ""
};

export const useCreateAppointment = globalAction$(
    async (data, requestEvent) => {
        const appointmentId = nanoid();

        const kv = createQwikCompatibleKvClient();

        const creator = await kv.get(getUserKey(data.creatorId));
        if (!creator) {
            requestEvent.status(400);
            return {};
        }

        await kv.set(getAppointmentKey(appointmentId), {
            creatorId: data.creatorId,
            title: data.title,
            description: data.description,
            location: data.location,
            availableTimes: data.startTimesPerDay.flatMap(x => x.times).map(x => ({
                id: nanoid(),
                startTime: x,
                endTime: addMinutes(x, data.durationInMinutes)
            })),
            attendees: []
        } as Appointment);

        return { id: appointmentId };
    },
    zod$(appointmentRequestSchema));

export const useCreateUser = globalAction$(
    async (data, requestEvent) => {
        const userId = nanoid();

        const kv = createQwikCompatibleKvClient();
        await kv.set(getUserKey(userId), {}, {});

        return { id: userId };
    },
    zod$(z.object({})));