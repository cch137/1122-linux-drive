const isLoading = ref(false);

const fileList = ref<string[]>([]);

let streamingIsStarted = false;
async function startStreaming() {
  if (streamingIsStarted) return;

  streamingIsStarted = true;
  const controller = new AbortController();
  const decoder = new TextDecoder();

  const readChunks = async () => {
    await reader.read().then(async ({ value, done }) => {
      if (done) {
        streamingIsStarted = false;
        startStreaming();
        return;
      }
      const decodedValue = decoder.decode(value);
      if (decodedValue) {
        _fetchFileList();
      }
      readChunks();
    });
  }

  const streamRes = await fetch('/api/drive/event', {
    method: 'POST',
    body: '{}',
    signal: controller.signal
  });

  // @ts-ignore
  const reader = streamRes.body.getReader();

  readChunks();
}

async function _fetchFileList() {
  try {
    const res = await $fetch('/api/drive/list', { method: 'POST' });
    fileList.value = res.data;
    startStreaming();
  } catch {
    fileList.value = [];
  }
}

async function fetchFileList() {
  isLoading.value = true;
  try {
    await _fetchFileList();
  } catch {}
  isLoading.value = false;
}

async function uploadFiles(files: FileList | null) {
  isLoading.value = true;
  try {
    const formData = new FormData();
    if (files !== null) {
      for (let i = 0; i < files.length; i++) {
        formData.append(`${i}`, files[i]);
      }
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/drive/file');
    xhr.send(formData);
    xhr.upload.addEventListener('progress', (ev) => {
      console.log(ev.lengthComputable, ev.loaded, ev.total);
    });
    // await $fetch('/api/drive/file', { method: 'POST', body: formData });
  } catch {}
  isLoading.value = false;
}

async function deleteFile(fp: string) {
  isLoading.value = true;
  try {
    await $fetch('/api/drive/file', { method: 'DELETE', body: { fp } });
  } catch {}
  isLoading.value = false;
}

export default function() {
  return {
    fileList,
    isLoading,
    _refresh: _fetchFileList,
    refresh: fetchFileList,
    uploadFiles,
    deleteFile,
  };
}