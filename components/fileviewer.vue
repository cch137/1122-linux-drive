<template>
  <div v-if="show" class="file-viewer" @keydown.esc="closeViewer">
    <div class="file-viewer-actions">
      <el-button type="primary" @click="closeViewer" class="file-viewer-close">Back</el-button>
      <el-button type="primary" @click="downloadFile" class="file-viewer-download">Download</el-button>
    </div>
    <div class="file-viewer-content">
      <template v-if="isImage(src)">
        <img :src="src" alt="File" class="file-viewer-image" />
      </template>
      <template v-else>
        <el-dialog v-model="dialogVisible" title="Warning" width="500" center>
          <span>This file format is not supported for preview. Please download it to view.</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="closeViewer">Cancel</el-button>
              <el-button type="primary" @click="downloadFile">Download</el-button>
            </div>
          </template>
        </el-dialog>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  emits: ['close'],
  methods: {
    closeViewer() {
      this.$emit('close');
    },
    downloadFile() {
      const link = document.createElement('a');
      link.href = this.src;
      link.download = this.src.split('/').pop() || 'file';
      link.click();
    },
    handleKeydown(event) {
      if (event.key === 'Escape') {
        this.closeViewer();
      }
    },
    isImage(file) {
      return /\.(jpg|jpeg|png|gif|bmp)$/i.test(file);
    }
  },
  watch: {
    show(value) {
      if (value && !this.isImage(this.src)) {
        this.dialogVisible = true;
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.file-viewer-actions {
  position: absolute;
  top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.file-viewer-close {
  position: absolute;
  left: 20px;
}

.file-viewer-download {
  position: absolute;
  right: 20px;
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
</style>
