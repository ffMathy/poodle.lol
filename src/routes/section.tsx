import { component$, Slot } from "@builder.io/qwik";


export const Section = component$((props: {
    title?: string,
    description?: string
  }) => {
    const classNameAdd = props.title || props.description ?
      "bg-white shadow-sm ring-1 ring-gray-900/5" :
      "";
    return <div class="space-y-10 divide-y divide-gray-900/10 mb-10">
      <div class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        <div class="px-4 sm:px-0">
          {props.title &&
            <h2 class="text-base font-semibold leading-7 text-gray-900">{props.title}</h2>}
  
          {props.description &&
            <p class="mt-1 text-sm leading-6 text-gray-600">{props.description}</p>}
        </div>
        <div class={`${classNameAdd} sm:rounded-xl md:col-span-2`}>
          <div class="px-4 py-6 sm:p-8">
            <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <Slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  })