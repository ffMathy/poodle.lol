import { component$ } from '@builder.io/qwik';
import { groupBy, keys } from "lodash";
import { addDays, addHours, format } from 'date-fns';
import { routeLoader$ } from '@builder.io/qwik-city';
import { nanoid } from 'nanoid';
import { getAppointmentKey } from '~/data/keys';
import { createQwikCompatibleKvClient } from '../kv';

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
    title: string,
    description?: string,
    location?: string,
    availableTimes: Timeslot[],
    attendees: Attendee[]
}

export const useAppointment = routeLoader$(async (requestEvent): Promise<Appointment|undefined> => {
    const kv = createQwikCompatibleKvClient();
    const appointment = await kv.get(getAppointmentKey(requestEvent.params.appointmentId));
    if(!appointment) {
        requestEvent.status(404);
        return;
    }

    return appointment as Appointment;
});

export default component$(() => {
    const appointment = useAppointment().value;
    if(!appointment)
        return null;

    return (
        <form>
            <div class="space-y-12">
                <div>
                    <h2 class="text-xl font-semibold leading-7 text-gray-900">
                        {appointment.title}
                    </h2>
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
                <th key={"available-time-header-" + time.id}
                    class="text-xs text-center p-0 pt-0 font-normal"
                >
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
                return <td 
                    key={"attendee-row-" + time.id}
                    class="p-3"
                >
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