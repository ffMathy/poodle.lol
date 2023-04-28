import { initTRPC } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { addDays, addHours } from 'date-fns'
 
const t = initTRPC.create();

type Attendee = {
  userName: string,
  subscribedTimeslotIds: Timeslot["id"][]
}

type Timeslot = {
  id: string,
  startTime: Date,
  endTime: Date
}

type Appointment = {
  creatorName: string,
  title: string,
  description?: string,
  location?: string,
  availableTimes: Timeslot[],
  attendees: Attendee[]
}

export const appRouter = t.router({
  createUserId: t.procedure
    .query(() => {
      return uuidv4();
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
      return uuidv4();
    }),
  getAppointmentById: t.procedure
    .input(z.string())
    .mutation(async ({ input: id}) => {
      const availableTimes = [
        {
          id: uuidv4(),
          startTime: addDays(new Date(), 2),
          endTime: addHours(addDays(new Date(), 2), 2)
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
            subscribedTimeslotIds: [availableTimes[1].id]
          },
          {
            userName: "Marc",
            subscribedTimeslotIds: [
              availableTimes[0].id,
              availableTimes[1].id
            ]
          }
        ]
      }
    })
});
 
export type AppRouter = typeof appRouter;