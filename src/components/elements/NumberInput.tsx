import { component$, Slot } from '@builder.io/qwik';

import { Add, Remove } from 'qwik-ionicons';

export default component$((props: any) => {
  return (
    <div class="flex flex-col">
      <label for={props.id} class="mb-2">
        <Slot />
      </label>
      <RawNumberInput {...props} />
    </div>
  );
});

export const RawNumberInput = component$(({ id, input, value, min, max, onDecrement$, onIncrement$, onChange$ }: any) => {
  return (
    <div class={{
      'flex': true,
      'gap-2': !input,
      'items-stretch': true,
    }}>
      <button data-action="decrement" disabled={value <= min} onClick$={onDecrement$} class={`
        flex justify-center items-center transition ease-in-out border border-gray-500 bg-gray-600 text-gray-100 text-2xl hover:bg-gray-500 cursor-pointer
        ${input ? 'w-20 rounded-l-md border-r-0' : 'w-[50%] rounded-md'}
        py-1.5
      `}>
        <Remove width="24" class="fill-current" />
      </button>
      {
        input && <input type="number" {...{ id, value, min, max, onChange$ }} class="transition ease-in-out text-lg text-center border border-gray-600 bg-gray-700 text-gray-50 hover:bg-gray-500 focus:bg-gray-500 px-3 py-2 w-[calc(100%-10rem)]" />
      }
      <button data-action="increment" disabled={value >= max} onClick$={onIncrement$} class={`
        flex justify-center items-center transition ease-in-out border border-gray-500 bg-gray-600 text-gray-100 text-2xl hover:bg-gray-500 cursor-pointer
        ${input ? 'w-20 rounded-r-md border-l-0' : 'w-[50%] rounded-md'}
        py-1.5
      `}>
        <Add width="24" class="fill-current" />
      </button>
    </div>
  );
});