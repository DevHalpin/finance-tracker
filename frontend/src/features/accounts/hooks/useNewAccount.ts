import { ref } from 'vue'
import type { Ref } from 'vue'

type NewAccountState = {
  drawerOpen: Ref<boolean>;
  openDrawer: () => void;
  closeDrawer: () => void;
}
const drawerOpen = ref(false);

export function useNewAccount(): NewAccountState {

  const openDrawer = () => {
    drawerOpen.value = true;
  };

  const closeDrawer = () => {
    drawerOpen.value = false;
  };

  return {
    drawerOpen,
    openDrawer,
    closeDrawer
  };
}