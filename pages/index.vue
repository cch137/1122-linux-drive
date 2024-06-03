<template>
  <div class="mt-8 flex-col flex-center">
    <FileViewer :src="currentFile" :show="viewerVisible" @close="viewerVisible = false" />
    <div v-if="isLoggedIn">
      <div>
        <el-button :icon="Upload" @click="fileInputEl().click()" :loading="isLoading">Upload</el-button>
        <el-button :icon="Refresh" @click="loading(drive.refresh)" :loading="isLoading">Refresh</el-button>
        <el-button @click="viewType = 'grid'" :disabled="viewType === 'grid'">Grid View</el-button>
        <el-button @click="viewType = 'list'" :disabled="viewType === 'list'">List View</el-button>
        <el-button @click="shareRoom" :icon="ElIconShare">Share Room</el-button>
        <form style="display: none;">
          <input class="FileUpload" type="file" multiple @change="loading(() => uploadFiles(fileInputEl().files))" />
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
              :icon="ElIconDelete"
              type="danger"
              plain
              :loading="isLoading"
              @click="loading(() => deleteFile(fp))"
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
              :icon="ElIconDelete" type="danger"
              plain
              :loading="isLoading"
              @click="loading(() => deleteFile(fp))"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';
import { appName } from '~/constants/app';
import useAuth from '~/composables/useAuth';
import useDrive from '~/composables/useDrive';
import FileViewer from '~/components/fileviewer.vue';

export default {
  components: {
    FileViewer
  },
  setup() {
    const { isLoggedIn, roomId } = useAuth();
    const drive = useDrive();
    const { isLoading, fileList } = drive;
    const viewerVisible = ref(false);
    const currentFile = ref('');

    const viewType = ref('grid');
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

    const deleteFile = async (fp) => {
      isLoading.value = true;
      try {
        console.log('Deleting file:', fp);
        console.log('Room ID:', roomId.value);
        await drive.deleteFile(roomId.value, fp);
/*         await drive.refresh(); */
      } catch (error) {
        console.error('Failed to delete file:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const uploadFiles = async (files) => {
      isLoading.value = true;
      try {
        console.log('Uploading files:', files);
        await drive.uploadFiles(roomId.value, files);
        await drive.refresh();
      } catch (error) {
        console.error('Failed to upload files:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const shareRoom = () => {
      const shareUrl = `${window.location.origin}/login?room=${roomId.value}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        ElMessage.success('Share link copied to clipboard');
      }).catch(() => {
        ElMessage.error('Failed to copy share link');
      });
    };

    watch(isLoggedIn, (value) => (value ? loading(drive.refresh) : (drive.fileList.value = [])));

    if (process.client) {
      if (isLoggedIn.value) {
        loading(drive.refresh);
      }
    }

    useTitle(`${appName}`);
    definePageMeta({
      layout: 'default',
      middleware: ['only-auth']
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
      shareRoom,
      deleteFile,
      uploadFiles
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
