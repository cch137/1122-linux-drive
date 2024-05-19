export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const { isLoggedIn } = useAuth();
    if (isLoggedIn.value) {
      return navigateTo('/');
    }
  }
})
