import { component$, useComputed$, useSignal } from "@builder.io/qwik";
import { addDays, addMonths, format, getMonth, isMonday, isSunday, isToday as isTodayFn, lastDayOfMonth, nextSunday, previousMonday } from "date-fns";

export default component$((props: {
  selectedDates: Date[],
  onChange$: (dates: Date[]) => void
}) => {
  const startOfCurrentMonthDate = useSignal(new Date());

  const startDate = useComputed$(() => {
    const firstDay = startOfCurrentMonthDate.value;
    return isMonday(firstDay) ? firstDay : previousMonday(firstDay);
  });
  const endDate = useComputed$(() => {
    const lastDay = lastDayOfMonth(startOfCurrentMonthDate.value);
    return isSunday(lastDay) ? lastDay : nextSunday(lastDay);
  });

  const allDatesOfMonthVisualization = useComputed$(() => {
    let currentDate = startDate.value;

    const dates = new Array<Date>();
    while (currentDate.getTime() <= endDate.value.getTime()) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    dates.push(currentDate);

    return dates;
  });

  return (
    <div class="mt-0 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-9">
      <div class="flex items-center text-gray-900">
        <button 
          type="button" 
          class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          onClick$={() => startOfCurrentMonthDate.value = addMonths(startOfCurrentMonthDate.value, -1)}
        >
          <span class="sr-only">Previous month</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </button>
        <div class="flex-auto text-sm font-semibold">
          {format(startOfCurrentMonthDate.value, "LLLL")} {format(startOfCurrentMonthDate.value, "u")}
        </div>
        <button 
          type="button" 
          class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          onClick$={() => startOfCurrentMonthDate.value = addMonths(startOfCurrentMonthDate.value, 1)}
        >
          <span class="sr-only">Next month</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div class="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
        <div>S</div>
      </div>
      <div class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
        {allDatesOfMonthVisualization.value.map((date, index) => {
          const isCurrentMonth = getMonth(date) === getMonth(startOfCurrentMonthDate.value);
          const isToday = isTodayFn(date);

          const isSelected = !!props.selectedDates.find(x => x.getTime() === date.getTime());

          const isTopLeftDay = index === 0;
          const isTopRightDay = index === 6;

          const isBottomLeftDay = index === allDatesOfMonthVisualization.value.length - 7;
          const isBottomRightDay = index === allDatesOfMonthVisualization.value.length - 1;

          const buttonClasses = [
            "py-1.5",
            "hover:bg-gray-100",
            "focus:z-10",
            isCurrentMonth ? 
              "bg-white" :
              "bg-gray-50",
            (isSelected || isToday) && "font-semibold",
            (isSelected) && "text-white",
            (!isSelected && !isToday && isCurrentMonth) && "text-gray-900",
            (!isSelected && !isToday && !isCurrentMonth) && "text-gray-400",
            (isToday && !isSelected) && "text-indigo-600",
            isTopLeftDay && "rounded-tl-lg",
            isTopRightDay && "rounded-tr-lg",
            isBottomLeftDay && "rounded-bl-lg",
            isBottomRightDay && "rounded-br-lg"
          ];

          const timeClasses = [
            "mx-auto",
            "flex",
            "h-7",
            "w-7",
            "items-center",
            "justify-center",
            "rounded-full",
            (isSelected) && "bg-indigo-600"
          ];

          return <button 
            type="button" 
            class={buttonClasses.filter(x => x).join(' ')}
            onClick$={() => {
              if(!props.selectedDates.includes(date)) {
                props.onChange$([...props.selectedDates, date]);
              } else {
                props.onChange$(props.selectedDates.filter(x => x !== date));
              }
            }}
          >
            <time 
              dateTime={date.toDateString()} 
              class={timeClasses.filter(x => x).join(' ')}
            >
              {format(date, "d")}
            </time>
          </button>;
        })}
      </div>
    </div>
  );
});
