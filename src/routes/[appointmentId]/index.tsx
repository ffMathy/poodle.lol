import { component$ } from '@builder.io/qwik';
import { groupBy, keys } from "lodash";
import { addDays, addHours, format } from 'date-fns';
import { routeLoader$ } from '@builder.io/qwik-city';
import { nanoid } from 'nanoid';

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

export const useAppointment = routeLoader$(async (requestEvent) => {
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
});

export default component$(() => {
    const appointment = useAppointment().value;

    return (
        <form>
            <div class="space-y-12">
                <div>
                    <h2 class="text-xl font-semibold leading-7 text-gray-900">
                        {appointment.title}
                    </h2>
                    <span class="text-base text-gray-400">
                        By {appointment.creatorName}
                    </span>
                    <p class="mt-1 text-sm leading-8 text-gray-600">
                        {appointment.description}
                    </p>
                    <p class="mt-1 text-xs leading-8 text-gray-600">
                        {appointment.location}
                    </p>
                </div>
                <div>
                    <AvailableTimesTable
                        availableTimes={appointment.availableTimes}
                        attendees={appointment.attendees}
                    />
                </div>
            </div>
        </form>);
});

const AvailableTimesTable = component$((props: {
    availableTimes: Timeslot[],
    attendees: Attendee[]
}) => {
    const allAvailableTimes = props.availableTimes;
    const availableTimesByDay = groupBy(
        allAvailableTimes,
        x => x.startTime.toDateString());

    const AvailableDateHeader = (props: {
        date: Date
    }) => {
        const times = availableTimesByDay[props.date.toDateString()];
        const firstStartTime = times[0].startTime;
        const colspan = times.length;

        return <th class="text-center" colSpan={colspan}>
            <div class="uppercase text-2xl font-thin">
                {format(firstStartTime, "LLL")}
            </div>
            <div class="text-4xl px-5 pb-5 font-light">
                {format(firstStartTime, "do")}
            </div>
        </th>
    }

    const AvailableTimesHeader = (props: {
        date: Date
    }) => {
        const times = availableTimesByDay[props.date.toDateString()];

        return <>
            {times.map(time =>
                <th class="text-xs text-center p-0 pt-0 font-normal">
                    {format(time.startTime, "p")}<br />
                    {format(time.endTime, "p")}
                </th>)}
        </>
    }

    const AttendeeRow = (props: {
        attendee: Attendee
    }) => {
        return <tr>
            <td class="text-right p-3">
                {props.attendee.userName}
            </td>
            {allAvailableTimes.map(time => {
                const isParticipating = props.attendee.subscribedTimeslotIds.indexOf(time.id) > -1;
                const colorClass = isParticipating ?
                    "bg-green-100" :
                    "bg-red-100"
                return <td class="p-3">
                    <div class="flex place-content-center">
                        <div class={`${colorClass} w-12 h-12`}></div>
                    </div>
                </td>;
            })}
        </tr>
    }

    return <table class="table-auto">
        <thead>
            <tr>
                <th></th>
                {keys(availableTimesByDay).map(date =>
                    <AvailableDateHeader date={new Date(date)} />)}
            </tr>
            <tr>
                <th class="font-bold p-3 pt-0">Participants</th>
                {keys(availableTimesByDay).map(date =>
                    <AvailableTimesHeader date={new Date(date)} />)}
            </tr>
        </thead>
        <tbody>
            {props.attendees.map(attendee =>
                <AttendeeRow attendee={attendee} />)}
        </tbody>
    </table>
});