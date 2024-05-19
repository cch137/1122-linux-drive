<template>
  <div class="fixed z-50 w-full flex">
    <div class="DefaultHeader px-4 gap-2 flex items-stretch flex-1">
      <NuxtLink href="/">
        <img style="height: 36px;" src="/favicon.ico" />
        <div class="pl-2 text-xl font-bold">{{ appName }}</div>
      </NuxtLink>
      <div class="flex-1 flex items-center justify-end gap-2">
        <NuxtLink v-if="isLoggedIn" href="/logout">
          <el-link>Log Out</el-link>
        </NuxtLink>
        <NuxtLink v-else href="/login">
          <el-link>Log In</el-link>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { appName } from '~/constants/app';

const { isLoggedIn } = useAuth();


</script>

<style>
.DefaultHeader {
  /* background: var(--el-bg-color); */
  /* border-bottom: 1px solid var(--el-border-color); */
  min-height: 56px;
}
.DefaultHeader > * {
  display: flex;
  align-items: center;
}
</style>