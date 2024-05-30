<template>
  <div v-if="show" class="file-viewer">
    <div class="file-viewer-content">
      <img :src="src" alt="File" class="file-viewer-image" />
      <div class="file-viewer-actions">
        <el-button @click="downloadFile">Download</el-button>
        <el-button @click="closeViewer">Back</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const closeViewer = () => {
  emit('close');
};

const downloadFile = () => {
  const link = document.createElement('a');
  link.href = props.src;
  link.download = props.src.split('/').pop() || 'file';
  link.click();
};
</script>

<style scoped>
.file-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.file-viewer-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.file-viewer-image {
  max-width: 100%;
  max-height: 100%;
}

.file-viewer-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
