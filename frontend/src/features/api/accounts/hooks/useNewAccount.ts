import { ref } from 'vue'

const drawerOpen = ref(false)

export function useNewAccount() {
  const openDrawer = () => {
    drawerOpen.value = true
  }

  const closeDrawer = () => {
    drawerOpen.value = false
  }

  return {
    drawerOpen,
    openDrawer,
    closeDrawer
  }
}
