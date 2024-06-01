<template>
</template>

<script setup lang="ts">
import { appName } from '~/constants/app';
import { ElLoading } from 'element-plus';
import useAuth from '~/composables/useAuth';

const { logout } = useAuth();

useTitle(`Log Out - ${appName}`)

const loading = process.client
  ? ElLoading.service({ text: 'Logging out...' })
  : null

const clearSession = () => {
  sessionStorage.clear();
};

logout()
  .finally(() => {
    clearSession();
    if (loading) loading.close();
    navigateTo('/');
    ElMessage.warning('Logout successfully');
  });

definePageMeta({
  layout: 'default',
})
</script>

<style scoped>
.LoginWindow {
  --h: 185px;
  margin: auto;
  margin-top: calc(((100vh - 56px) / 2) - (var(--h) / 2));
  max-width: 90vw;
  width: 320px;
  box-shadow: var(--el-box-shadow);
}
</style>
