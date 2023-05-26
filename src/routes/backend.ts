import { routeLoader$, globalAction$, zod$ } from "@builder.io/qwik-city";
import { InitialValues } from "@modular-forms/qwik";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getUserKey, getAppointmentKey } from "~/utils/keys";
import { createQwikCompatibleKvClient } from "~/utils/kv";
import { Appointment } from "./[appointmentId]";


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
    duration: z
        .object({
            hours: z
                .number()
                .nonnegative("Hours must be positive."),
            minutes: z
                .number()
                .nonnegative("Minutes must be positive.")
        })
        .required(),
    startTimesPerDay: z
        .array(z
            .object({
                day: z.date(),
                times: z
                    .array(z.date())
                    .nonempty("You must specify at least one date and time.")
            }))
});
export type AppointmentRequest = z.infer<typeof appointmentRequestSchema>;

export const defaultAppointmentRequest: AppointmentRequest = {
    startTimesPerDay: [] as any,
    duration: {} as any,
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
            availableTimes: data.availableTimes.map(x => ({
                ...x,
                id: nanoid()
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