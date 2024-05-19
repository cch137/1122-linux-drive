<template>
  <div class="mt-8 flex-col flex-center">
    <div v-if="isLoggedIn">
      <div>
        <el-button :icon="Upload" @click="fileInputEl().click()" :loading="isLoading">Upload</el-button>
        <el-button :icon="Refresh" @click="loading(drive.refresh)" :loading="isLoading">Refresh</el-button>
        <form style="display: none;">
          <input class="FileUpload" type="file" multiple @change="loading(() => drive.uploadFiles(fileInputEl().files))" />
        </form>
      </div>
      <div class="FileList mt-8">
        <div v-if="fileList.length === 0">
          <div class="text-center select-none">
            <el-text type="info">No files</el-text>
          </div>
        </div>
        <div v-for="fp in fileList" class="FileItem flex justify-center items-center">
          <a
            class="flex-1"
            :href="`/api/drive/file/${fp}`"
            target="_blank"
          >
            <el-text size="large">{{ fp }}</el-text>
          </a>
          <el-button
            class="FileItemDeleteBtn mx-1"
            :icon="Delete" type="danger"
            plain
            :loading="isLoading"
            @click="loading(() => drive.deleteFile(fp))"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <h1>Welcome to Drive!</h1>
      <div class="mt-8 text-center">
        <el-text size="large">You are not logged in. </el-text>
        <el-text size="large">Please </el-text>
        <NuxtLink href="/login">
          <el-button size="small" class="HomepageLoginButton mb-1">Log In</el-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElLoading } from 'element-plus';
import { Upload, Refresh, Delete } from '@element-plus/icons-vue'
import { appName } from '~/constants/app';

const { isLoggedIn } = useAuth();

const drive = useDrive();
const { isLoading, fileList } = drive;

async function loading(func: Function, text = 'Loading...') {
  const loading = ElLoading.service({ text });
  try {
    return await func();
  } finally {
    loading.close();
  }
}

function fileInputEl() {
  return document.querySelector('.FileUpload') as HTMLInputElement;
}

watch(isLoggedIn, (value) => value ? loading(drive.refresh) : drive.fileList.value = []);

if (process.client) {
  if (isLoggedIn.value) {
    loading(drive.refresh);
  }
}

useTitle(`${appName}`)
definePageMeta({
  layout: 'default'
})
</script>

<style>
.HomepageLoginButton span {
  transform: scale(1.125);
}

.FileList {
  max-width: 90vw;
  width: 540px;
}

.FileItem {
  border-bottom: 1px solid #80808080;
}

.FileItem a {
  padding: .5rem 1rem;
  transition: .3s ease-in-out;
}

.FileItem a:hover {
  background: #ffffff10;
}

.FileItemDeleteBtn {
  padding: 8px;
}
</style>