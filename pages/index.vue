<template>
  <div class="mt-8 flex-col flex-center">
    <FileViewer :src="currentFile" :show="viewerVisible" @close="viewerVisible = false" />
    <div v-if="isLoggedIn">
      <div>
        <el-button :icon="Upload" @click="fileInputEl().click()" :loading="isLoading">Upload</el-button>
        <el-button :icon="Refresh" @click="loading(drive.refresh)" :loading="isLoading">Refresh</el-button>
        <el-button @click="setView('grid')" :disabled="viewType === 'grid'">Grid View</el-button>
        <el-button @click="setView('list')" :disabled="viewType === 'list'">List View</el-button>
        <el-button @click="shareRoom" :icon="Share">Share Room</el-button>
        <form style="display: none;">
          <input class="FileUpload" type="file" multiple @change="loading(() => drive.uploadFiles(fileInputEl().files))" />
        </form>
      </div>
      <div class="FileList mt-8 m-8">
        <div v-if="fileList.length === 0">
          <div class="text-center select-none">
            <el-text type="info">No files</el-text>
          </div>
        </div>
        <div v-if="viewType === 'grid'" class="FileGrid">
          <div v-for="fp in fileList" :key="fp" class="FileItem">
            <div class="ImageContainer" @click="openViewer(`/api/drive/file/${fp}`)">
              <img
                :src="getFileIcon(fp)"
                alt="Uploaded file"
                class="UploadedFile"
              />
            </div>
            <el-button
              class="FileItemDeleteBtn"
              :icon="Delete"
              type="danger"
              plain
              :loading="isLoading"
              @click="loading(() => drive.deleteFile(fp))"
            />
          </div>
        </div>
        <div v-else class="FileListItems">
          <div v-for="fp in fileList" :key="fp" class="FileItem flex justify-center items-center">
            <a class="flex-1" @click="openViewer(`/api/drive/file/${fp}`)">
              <el-text size="large">{{ fp }}</el-text>
              <br>
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

<script>
import { ref, watch, onMounted } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';
import { Upload, Refresh, Delete, Share } from '@element-plus/icons-vue';
import { appName } from '~/constants/app';
import useAuth from '~/composables/useAuth';
import useDrive from '~/composables/useDrive';
import FileViewer from '~/components/fileviewer.vue';

export default {
  components: {
    FileViewer
  },
  setup() {
    const { isLoggedIn } = useAuth();
    const drive = useDrive();
    const { isLoading, fileList } = drive;

    const viewType = ref('grid');
    const viewerVisible = ref(false);
    const currentFile = ref('');
    const currentRoom = ref('');

    const setView = (type) => {
      viewType.value = type;
    };

    const openViewer = (file) => {
      currentFile.value = file;
      viewerVisible.value = true;
    };

    const loading = async (func, text = 'Loading...') => {
      const loading = ElLoading.service({ text });
      try {
        return await func();
      } finally {
        loading.close();
      }
    };

    const fileInputEl = () => {
      return document.querySelector('.FileUpload');
    };

    const isImage = (fileName) => {
      return /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName);
    };

    const getFileIcon = (fileName) => {
      const extension = getFileExtension(fileName).toLowerCase();
      if (isImage(fileName)) {
        return `/api/drive/file/${fileName}`;
      }
      switch (extension) {
        case 'pdf':
          return '/pdf.png';
        case 'doc':
        case 'docx':
          return '/doc.png';
        case 'ppt':
        case 'pptx':
          return '/ppt.png';
        case 'xls':
        case 'xlsx':
          return '/excel.png';
        case 'zip':
        case 'rar':
          return '/zip.png';
        default:
          return '/other.png';
      }
    };

    const getFileExtension = (fileName) => {
      return fileName.split('.').pop() || '';
    };

    const shareRoom = () => {
      const roomNumber = currentRoom.value; 
      const shareUrl = `${window.location.origin}/login?room=${roomNumber}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        ElMessage.success('Share link copied to clipboard');
      }).catch(() => {
        ElMessage.error('Failed to copy share link');
      });
    };

    onMounted(() => {
      const room = sessionStorage.getItem('currentRoom');
      if (room) {
        currentRoom.value = room;
      }
    });

    watch(isLoggedIn, (value) => (value ? loading(drive.refresh) : (drive.fileList.value = [])));

    if (process.client) {
      if (isLoggedIn.value) {
        loading(drive.refresh);
      }
    }

    useTitle(`${appName}`);
    definePageMeta({
      layout: 'default'
    });

    return {
      isLoggedIn,
      isLoading,
      fileList,
      viewType,
      viewerVisible,
      currentFile,
      setView,
      openViewer,
      loading,
      fileInputEl,
      getFileIcon,
      shareRoom
    };
  }
};
</script>

<style scoped>
.FileGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.FileItem {
  position: relative;
  cursor: pointer;
}

.ImageContainer {
  position: relative;
  width: 20vw;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 15px;
}

.UploadedFile {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.FileItemDeleteBtn {
  position: absolute;
  bottom: 6px;
  right: 8px;
  border: none;
}

.FileListItems {
  display: flex;
  flex-direction: column;
}

.FileListItems .FileItem {
  width: 85vw;
}

.FileItem a:hover {
  background: #ffffff10;
  padding-top: 10px;
  padding-bottom: 10px;
}

.FileItem a {
  text-decoration: none;
  padding-top: 10px;
  padding-bottom: 10px;
  max-width: 70vw;
  border-bottom: 1px solid #afafaf9c;
}
</style>
