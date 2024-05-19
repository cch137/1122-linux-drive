<template>
</template>

<script setup lang="ts">
import { appName } from '~/constants/app';
import { ElLoading } from 'element-plus';

const { logout } = useAuth();

useTitle(`Log Out - ${appName}`)

const loading = process.client
  ? ElLoading.service({ text: 'Logging out...' })
  : null
logout()
  .finally(() => {
    if (loading) loading.close();
    navigateTo('/');
  });

definePageMeta({
  layout: 'default',
})
</script>

<style>
.LoginWindow {
  --h: 185px;
  margin: auto;
  margin-top: calc(((100vh - 56px) / 2) - (var(--h) / 2));
  max-width: 90vw;
  width: 320px;
  box-shadow: var(--el-box-shadow);
}
</style>