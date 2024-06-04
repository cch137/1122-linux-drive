<template>
  <div class="mt-8 flex-col flex-center">
    <div>
      <h1>Welcome to Drive!</h1>
      <div class="mt-16 flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <div class="flex gap-2">
            <div class="flex-1">
              <el-input ref="roomIdInput" v-model="roomId" placeholder="Room ID">
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

      <div v-if="recentRooms.length" class="mt-8">
        <hr />
        <h3>Recently Rooms</h3>
        <el-list class="el-list-with-scrollbar"> 
          <el-list-item v-for="room in recentRooms" :key="room.roomId" @click="joinRecentRoom(room.roomId)">
            <div class="room-item">
              <div>{{ room.roomId }}</div>
              <div class="timestamp">{{ formatTime(room.timestamp) }}</div>
            </div>
          </el-list-item>
        </el-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { appName } from '~/constants/app';
import copyToClipboard from '@cch137/utils/web/copy-to-clipboard';


const auth = useAuth();
const router = useRouter();
const roomId = ref('');
const roomIdInput = ref<HTMLInputElement>();
const recentRooms = ref<{ roomId: string; timestamp: number }[]>([]);

onMounted(() => {
  const id = auth.roomId.value || '';
  if (id) {
    roomId.value = id;
    login();
  }
  loadRecentRooms();
});

async function login() {
  try {
    await auth.login(roomId.value);
    if (auth.isLoggedIn.value) {
      saveRecentRoom(roomId.value);
      router.push('/');
    }
  } catch (e) {
    ElMessage.error('Please try again after 5 minutes.');
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
    ElMessage.error('Please try again after 5 minutes.');
  }
}

async function copyNewRoomId() {
  try {
    copyToClipboard(roomId.value);
    ElMessage.success('Copied room id.');
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : 'Failed to copy.');
  }
}

function saveRecentRoom(roomId: string) {
  const timestamp = Date.now();
  const recentRooms = JSON.parse(localStorage.getItem('recentRooms') || '[]');
  const newRooms = recentRooms.filter((room: { roomId: string; }) => room.roomId !== roomId);
  newRooms.unshift({ roomId, timestamp });
  localStorage.setItem('recentRooms', JSON.stringify(newRooms));
  loadRecentRooms();
}

function loadRecentRooms() {
  const recentRoomsData = JSON.parse(localStorage.getItem('recentRooms') || '[]');
  const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000;
  recentRooms.value = recentRoomsData.filter((room: { timestamp: number; }) => room.timestamp > twelveHoursAgo);
}

function joinRecentRoom(id: string) {
  roomId.value = id;
  login();
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

useTitle(`Log In - ${appName}`);
definePageMeta({
  layout: 'default',
  middleware: ['only-no-auth']
});
</script>

<style scoped>
.room-item {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.room-item:hover {
  background-color: #717171;
}

.timestamp {
  margin-left: 20px;
}
.LoginWindow {
  --h: 185px;
  margin: auto;
  margin-top: calc(((100vh - 56px) / 2) - (var(--h) / 2));
  max-width: 90vw;
  width: 320px;
  box-shadow: var(--el-box-shadow);
}
.LoginWindow {
  --h: 185px;
  margin: auto;
  margin-top: calc(((100vh - 56px) / 2) - (var(--h) / 2));
  max-width: 90vw;
  width: 320px;
  box-shadow: var(--el-box-shadow);
}
.el-list-with-scrollbar {
  height: 200px;
  overflow-y: scroll;
  display: block;
}
</style>


