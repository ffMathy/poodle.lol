import { Resource, component$, useResource$, useTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { trpc } from '../../api/client';
import { groupBy, keys } from "lodash";
import { getDate, getDay } from 'date-fns';

type Appointment = Awaited<ReturnType<typeof trpc.getAppointmentById.query>>;

type TimeSlot = Appointment["availableTimes"][0];
type Attendee = Appointment["attendees"][0];

export default component$(() => {
    const appointmentResource = useResource$(async () => {
        return await trpc.getAppointmentById.query("lol");
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
    const times = props.availableTimes;
    const availableTimesByDay = groupBy(
        times,
        x => x.startTime.toDateString());

    const AvailableTimeHeader = (props: {
        date: Date
    }) => {
        const startTime = times[0].startTime;
        return <th>
            {startTime.getDate()}
        </th>
    }

    const AttendeeRow = (props: {
        attendee: Attendee
    }) => {
        return <tr>
            <td>
                {props.attendee.userName}
            </td>
            {times.map(time => 
                <td>
                    Foo
                </td>)}
        </tr>
    }

    return <table class="table-auto">
        <thead>
            <tr>
                <th class="font-bold">Participants</th>
                {keys(availableTimesByDay).map(date => 
                    <AvailableTimeHeader date={new Date(date)} />)}
            </tr>
        </thead>
        <tbody>
            {props.attendees.map(attendee => 
                <AttendeeRow attendee={attendee} />)}
        </tbody>
    </table>
});