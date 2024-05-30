<!-- <template>
  <div class="LoginWindow border border-slate-800 rounded-2xl p-4">
    <div class="text-2xl text-center pt-2">Add room</div>
    <div class="flex flex-col gap-4 my-4">
      <div>
        <el-input class="LoginPinInput" v-model="pinInput" placeholder="Pin" />
      </div>
      <div class="flex-center">
        <el-button type="primary" @click="processEnter(pinInput)">Add and enter</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElLoading } from 'element-plus';
import { appName } from '~/constants/app';

const { login, isLoggedIn } = useAuth();

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
    .finally(() => loading.close());
}

const pinInput = ref('');

if (process.client) {
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
  });
}

watch(isLoggedIn, (value) => {
  if (value) navigateTo('/');
});
onMounted(() => {
  if (isLoggedIn.value) navigateTo('/');
});

useTitle(`Addroom - ${appName}`)
definePageMeta({
  layout: 'default',
  middleware: ['only-no-auth']
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
</style> -->
<template>
  <div>
    <h1>Add Room</h1>
    <input v-model="newRoom" placeholder="Enter room name" />
    <button @click="addRoom">Add Room</button>

    <h1>Login</h1>
    <input v-model="pin" placeholder="Enter pin to login" />
    <button @click="login">Login</button>

    <div v-if="message">{{ message }}</div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useFetch } from '#app';

export default {
  setup() {
    const newRoom = ref('');
    const pin = ref('');
    const message = ref('');

    const addRoom = async () => {
      const { data, error } = await useFetch('/api/addRoom', {
        method: 'POST',
        body: { room: newRoom.value },
      });
      if (error.value) {
        message.value = 'Error adding room';
      } else {
        message.value = 'Room added successfully';
        newRoom.value = '';
      }
    };

    const login = async () => {
      const { data, error } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: { pin: pin.value },
      });
      if (data.value.isLoggedIn) {
        message.value = 'Logged in successfully';
      } else {
        message.value = 'Login failed: ' + data.value.error;
      }
    };

    return {
      newRoom,
      pin,
      message,
      addRoom,
      login,
    };
  },
};
</script>