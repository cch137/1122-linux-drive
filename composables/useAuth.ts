import { ElMessage } from "element-plus";

const isLoggedIn = ref(false);

let lastCheckLogInAt = 0;
let itIsOkToPromptError = false;
setTimeout(() => { itIsOkToPromptError = true }, 10 * 1000);
async function checkIsLoggedIn(force = false) {
  if (force || lastCheckLogInAt + 5 * 60 * 1000 < Date.now()) {
    const res = await $fetch('/api/auth/check', { method: 'POST' });
    lastCheckLogInAt = Date.now();
    if (res.error && itIsOkToPromptError) ElMessage.error(res.error);
    isLoggedIn.value = res.isLoggedIn || false;
  }
  return isLoggedIn.value
}

async function login(pin: string) {
  const res = await $fetch('/api/auth/login', { method: 'POST', body: { pin } });
  if (res.error && itIsOkToPromptError) ElMessage.error(res.error);
  isLoggedIn.value = res.isLoggedIn || false;
  if (res.isLoggedIn) {
    ElMessage.success('Logged in.');
    navigateTo('/');
  }
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' });
  isLoggedIn.value = false;
}

export default function () {
  checkIsLoggedIn();
  return {
    login,
    logout,
    checkIsLoggedIn,
    isLoggedIn,
  }
}
