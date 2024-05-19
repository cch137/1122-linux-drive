export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
    const htmlEl = document.querySelector('html');
    if (!htmlEl!.classList.contains('dark')) {
      htmlEl!.classList.add('dark');
    }
  }
})
