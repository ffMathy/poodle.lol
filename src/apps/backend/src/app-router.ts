import { initTRPC } from '@trpc/server';
import { nan, z } from 'zod';
import { nanoid } from 'nanoid'
import { addDays, addHours } from 'date-fns'
import superjson from 'superjson'; 

const t = initTRPC.create({
  transformer: superjson
});

type Attendee = {
  userName: string,
  subscribedTimeslotIds: Timeslot["id"][]
}

type Timeslot = {
  id: string,
  startTime: Date,
  endTime: Date
}

export type Appointment = {
  creatorName: string,
  title: string,
  description?: string,
  location?: string,
  availableTimes: Timeslot[],
  attendees: Attendee[]
}

export const appRouter = t.router({
  createUserId: t.procedure
    .input(z.void())
    .query(() => {
      return nanoid();
    }),
  createAppointment: t.procedure
    .input(z.object({
      creator: z.object({
        id: z.string(),
        name: z.string()
      }),
      title: z.string(),
      description: z.optional(z.string()),
      location: z.optional(z.string()),
      availableTimes: z.array(z.object({
        startTime: z.date(),
        endTime: z.date()
      }))
    }))
    .mutation(async ({ input }) => {
      return nanoid();
    }),
  getAppointmentById: t.procedure
    .input(z.string())
    .query(async () => {
      const availableTimes = [
        {
          id: nanoid(),
          startTime: addDays(new Date(), 2),
          endTime: addHours(addDays(new Date(), 2), 2)
        },
        {
          id: nanoid(),
          startTime: addHours(addDays(new Date(), 2), 2),
          endTime: addHours(addDays(new Date(), 2), 4)
        },
        {
          id: nanoid(),
          startTime: addDays(new Date(), 4),
          endTime: addHours(addDays(new Date(), 4), 2)
        }
      ];
      return {
        creatorName: "John Doe",
        title: "John's birthday party",
        description: "It's gonna be awesome.",
        location: "Central Park",
        availableTimes: availableTimes,
        attendees: [
          {
            userName: "Julia",
            subscribedTimeslotIds: [availableTimes[0].id]
          },
          {
            userName: "Robert",
            subscribedTimeslotIds: [availableTimes[2].id]
          },
          {
            userName: "Marc",
            subscribedTimeslotIds: [
              availableTimes[0].id,
              availableTimes[1].id
            ]
          }
        ]
      } as Appointment;
    })
});
 
export type AppRouter = typeof appRouter;