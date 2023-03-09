<template>
  <div class="relative w-screen text-center md:w-full">
    <div
      class="-ml-6 mt-2 inline-flex max-w-full flex-col items-center rounded-md border border-solid border-gray-400/20 shadow transition hover:shadow-md md:ml-0"
    >
      <slot name="header" />
      <div class="m-3 max-w-full overflow-auto">
        <slot name="default" />
      </div>
    </div>
  </div>
</template>
