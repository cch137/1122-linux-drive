<template>
  <div class="LoginWindow border border-slate-800 rounded-2xl p-4">
    <div class="text-2xl text-center pt-2">Log In</div>
    <div class="flex flex-col gap-4 my-4">
      <div>
        <el-input class="LoginPinInput" v-model="pinInput" placeholder="Pin" @keyup.enter="processEnter(pinInput)" />
      </div>
      <div class="flex-center">
        <el-button type="primary" @click="processEnter(pinInput)">Enter</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { ElLoading } from 'element-plus';
import { useRouter } from 'vue-router';
import { appName } from '~/constants/app';
import useAuth from '~/composables/useAuth';

const { login, isLoggedIn } = useAuth();
const router = useRouter();

function focusPinInput() {
  try {
    (document.querySelector('.LoginPinInput input') as HTMLInputElement).focus();
  } catch {}
}

function processEnter(pin: string) {
  pin = pin.trim();
  if (pin.length == 0) return focusPinInput();
  const loading = ElLoading.service({ text: 'Logging in...' });
  login(pin)
    .then(() => {
      sessionStorage.setItem('currentRoom', pin);
    })
    .finally(() => loading.close());
}

const pinInput = ref('');

onMounted(() => {
  setTimeout(() => focusPinInput(), 0);
  let counter = 0;
  const setMarginTop = () => {
    const loginWindowEl = document.querySelector('.LoginWindow') as HTMLDivElement;
    loginWindowEl.style.setProperty('--h', `${loginWindowEl.clientHeight}px`);
    counter++;
    if (++counter > 10) clearInterval(itv);
  }
  const itv = setInterval(setMarginTop, 100);
  setMarginTop();

  // Check URL for room parameter and set pinInput
  const params = new URLSearchParams(window.location.search);
  const room = params.get('room');
  if (room) {
    pinInput.value = room;
  }
});

watch(isLoggedIn, (value) => {
  if (value) router.push('/');
});

onMounted(() => {
  if (isLoggedIn.value) router.push('/');
});

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
