import { ref } from 'vue'
import type { Ref } from 'vue'

type NewCategoryState = {
  drawerOpen: Ref<boolean>;
  openDrawer: () => void;
  closeDrawer: () => void;
}
const drawerOpen = ref(false);

export function useNewCategory(): NewCategoryState {

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