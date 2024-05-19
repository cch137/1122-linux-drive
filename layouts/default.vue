<template>
  <div>
    <ClientOnly>
      <DefaultHeader />
      <div style="padding-top: 56px;" class="w-full">
        <slot />
      </div>
    </ClientOnly>
  </div>
</template>
