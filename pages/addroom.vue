<template>
  <div class="LoginWindow border border-slate-800 rounded-2xl p-4">
    <div class="text-2xl text-center pt-2">Add a new room</div>
    <div class="flex flex-col gap-4 my-4">
      <div class="flex items-center">
        <el-input v-model="newPin" placeholder="Generated PIN" readonly></el-input>
        <el-button type="info" @click="copyToClipboard" class="ml-2">Copy</el-button>
      </div>
      <div class="flex-center">
        <el-button type="primary" @click="addPin">Press to create</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';
const newPin = ref('');
const router = useRouter();

const generatePin = async () => {
  let pin = '';
  const characters = 'ABCDEFIJKLMNOP3456789';
  const length = 8;

  const generateRandomPin = () => {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  let isUnique = false;

  while (!isUnique) {
    pin = generateRandomPin();
    try {
      const response = await axios.post('/api/check-pin', { pin });
      isUnique = response.data.isUnique;
    } catch (error) {
      console.error('Failed to check PIN uniqueness', error);
    }
  }

  newPin.value = pin;
};

const addPin = async () => {
  if (!newPin.value) {
    ElMessage.error('PIN cannot be empty');
    return;
  }
  try {
    await axios.post('/api/add-pin', { pin: newPin.value });
    ElMessage.success('PIN added successfully');
    router.push('/login');
  } catch (error) {
    ElMessage.error('Failed to add PIN');
  }
};

const copyToClipboard = async () => {
  if (!newPin.value) {
    ElMessage.error('Nothing to copy');
    return;
  }
  try {
    await navigator.clipboard.writeText(newPin.value);
    ElMessage.success('PIN copied to clipboard');
  } catch (error) {
    ElMessage.error('Failed to copy PIN');
  }
};

onMounted(async () => {
  await generatePin();
});
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

.flex-center {
  display: flex;
  justify-content: center;
}
.flex {
  display: flex;
  align-items: center;
}

.ml-2 {
  margin-left: 8px;
}
</style>
