<template>
  <div class="LoginWindow border border-slate-800 rounded-2xl p-4">
    <div class="text-2xl text-center pt-2">Add a new room</div>
    <div class="flex flex-col gap-4 my-4">
      <div>
        <el-input v-model="newPin" placeholder="Enter new PIN"></el-input>
      </div>
      <div class="flex-center">
        <el-button @click="addPin">Add PIN</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const newPin = ref('');

const addPin = async () => {
  if (!newPin.value) {
    ElMessage.error('PIN cannot be empty');
    return;
  }
  try {
    await axios.post('/api/add-pin', { pin: newPin.value });
    ElMessage.success('PIN added successfully');
    newPin.value = '';
  } catch (error) {
    ElMessage.error('Failed to add PIN');
  }
};
</script>

<style scoped>
.AddPin {
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.AddPin .el-input {
  margin-right: 8px;
}
</style>
