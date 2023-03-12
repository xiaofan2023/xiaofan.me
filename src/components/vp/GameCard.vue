<template>
  <div class="relative -ml-6 mt-2 w-screen text-center md:ml-0 md:w-full">
    <div
      class="inline-flex max-w-full flex-col items-center rounded-md border border-solid border-gray-400/20 shadow transition hover:shadow-md"
    >
      <slot name="header" />
      <div class="m-3 max-w-full overflow-auto">
        <slot name="default" />
      </div>
    </div>
  </div>
</template>
