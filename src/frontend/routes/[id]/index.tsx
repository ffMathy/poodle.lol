import { Resource, component$, useResource$ } from '@builder.io/qwik';
import { Appointment } from '../../../backend/_app-router';
import { groupBy, keys } from "lodash";
import { format } from 'date-fns';
import { trpc } from '../../client';

type TimeSlot = Appointment["availableTimes"][0];
type Attendee = Appointment["attendees"][0];

export default component$(() => {
    const appointmentResource = useResource$(async () => {
        return await trpc.getAppointmentById.useQuery("lol").data!;
    });

    return <Resource
        value={appointmentResource}
        onPending={() => <div>
            Loading ...
        </div>}
        onResolved={appointment => {
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
        }} />;
});

const AvailableTimesTable = component$((props: {
    availableTimes: TimeSlot[],
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