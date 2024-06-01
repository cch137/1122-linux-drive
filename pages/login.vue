<template>
  <div class="mt-8 flex-col flex-center">
    <div>
      <h1>Welcome to Drive!</h1>
      <div class="mt-16 flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <div class="flex gap-2">
            <div class="flex-1">
              <el-input ref="roomIdInput" v-model:="roomId" placeholder="Room ID">
                <template #append>
                  <el-button class="HomepageLoginButton" @click="copyNewRoomId" :icon="ElIconCopyDocument" circle />
                </template>
              </el-input>
            </div>
            <div class="w-20 flex">
              <el-button class="HomepageLoginButton flex-1" type="primary" @click="login">
                Join
              </el-button>
            </div>
          </div>
        </div>
        <el-text type="info" size="large">or</el-text>
        <div class="flex-center">
          <div>
            <el-button class="HomepageLoginButton flex-1" @click="generatePin">
              Create a new room
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { appName } from '~/constants/app';
import copyToClipboard from '@cch137/utils/web/copy-to-clipboard';

const auth = useAuth();
const roomId = ref('');
const roomIdInput = ref<HTMLInputElement>();

async function login() {
  try {
    await auth.login(roomId.value);
    if (auth.isLoggedIn.value) navigateTo('/');
  } catch (e) {
    ElMessage.error('Please try again after 5 minutes.')
  }
}

async function generatePin() {
  try {
    const pin = await $fetch('/api/auth/generate-pin', { method: 'POST' });
    if (!pin) throw new Error('Room creation error.');
    ElMessage.success('Room created.');
    roomId.value = pin;
    roomIdInput.value?.focus();
  } catch (e) {
    ElMessage.error('Please try again after 5 minutes.')
  }
}

async function copyNewRoomId() {
  try {
    copyToClipboard(roomId.value);
    ElMessage.success('Copied room id.');
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : 'Failed to copy.')
  }
}

useTitle(`Log In - ${appName}`);
definePageMeta({
  layout: 'default',
  middleware: ['only-no-auth']
});
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
