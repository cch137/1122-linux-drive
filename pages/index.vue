<template>
  <div class="mt-8 flex-col flex-center">
    <FileViewer :src="currentFile" :show="viewerVisible" @close="viewerVisible = false" />
    <div v-if="isLoggedIn">
      <div>
        <el-button :icon="ElIconUpload" @click="fileInputEl?.click()" :loading="isLoading">Upload</el-button>
        <el-button :icon="ElIconRefresh" @click="loading(drive.refresh)" :loading="isLoading">Refresh</el-button>
        <el-button @click="viewType = 'grid'" :disabled="viewType === 'grid'">Grid View</el-button>
        <el-button @click="viewType = 'list'" :disabled="viewType === 'list'">List View</el-button>
        <el-button @click="shareRoom" :icon="ElIconShare">Share Room</el-button>
        <form style="display: none;">
          <input class="FileUpload" type="file" multiple ref="fileInputEl" @change="loading(() => handleFileUpload(fileInputEl?.files))" />
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

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { appName } from '~/constants/app';
import useAuth from '~/composables/useAuth';
import useDrive from '~/composables/useDrive';
import FileViewer from '~/components/fileviewer.vue';

const { isLoggedIn, roomId } = useAuth();
const drive = useDrive();
const { isLoading, fileList } = drive;
const viewerVisible = ref(false);
const currentFile = ref('');
const fileInputEl = ref<HTMLInputElement>();
const router = useRouter();
const viewType = ref<'grid' | 'list'>('grid');

const openViewer = (file: string) => {
  currentFile.value = file;
  viewerVisible.value = true;
};

const loading = async (func: Function, text = 'Loading...') => {
  const loading = ElLoading.service({ text });
  try {
    return await func();
  } finally {
    loading.close();
  }
};

const isImage = (fileName: string) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
};

const getFileIcon = (fileName: string) => {
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

const getFileExtension = (fileName: string) => {
  return fileName.split('.').pop() || '';
};

const deleteFile = async (fp: string) => {
  isLoading.value = true;
  try {
    console.log('Deleting file:', fp);
    console.log('Room ID:', roomId.value);
    await drive.deleteFile(fp);
    ElMessage.warning(`File [${fp}] deleted.`);
  } catch (error) {
    console.error('Failed to delete file:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleFileUpload = async (files?: FileList | null) => {
  if (!files) return;
  isLoading.value = true;
  try {
    const existingFiles = fileList.value;
    const filesToUpload = Array.from(files);

    for (const file of filesToUpload) {
      if (existingFiles.includes(file.name)) {
        await ElMessageBox.confirm(
          `File ${file.name} already exists. Do you want to overwrite it or create a copy?`,
          'File Exists',
          {
            confirmButtonText: 'Overwrite',
            cancelButtonText: 'Create Copy',
            type: 'warning',
          }
        ).then(async () => {
          // Overwrite the file
          uploadFiles([file], true);
        }).catch(async () => {
          // Create a copy
          const newFileName = getUniqueFileName(file.name, existingFiles);
          const newFile = new File([file], newFileName, { type: file.type });
          await uploadFiles([newFile], false);
        });
      } else {
        await uploadFiles([file], false);
      }
    }

    await drive.refresh();
  } catch (error) {
    console.error('Failed to upload files:', error);
  } finally {
    isLoading.value = false;
  }
};

const getUniqueFileName = (fileName: string, existingFiles: string[]) => {
  const name = fileName.substring(0, fileName.lastIndexOf('.'));
  const extension = fileName.substring(fileName.lastIndexOf('.'));
  let newName = fileName;
  let index = 1;

  while (existingFiles.includes(newName)) {
    newName = `${name}(${index})${extension}`;
    index++;
  }

  return newName;
};

const uploadFiles = async (files: File[], overwrite = false) => {
  isLoading.value = true;
  try {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    formData.append('roomId', roomId.value);
    formData.append('overwrite', overwrite.toString());
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/drive/file');
    xhr.send(formData);
    xhr.upload.addEventListener('progress', (ev) => {
      console.log(ev.lengthComputable, ev.loaded, ev.total);
    });
    ElMessage.success('File uploaded successfully');
    setTimeout(() => {
      window.location.href = '/';
    }, 700);
   
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
