import { ref } from 'vue'
import type { Ref } from 'vue'

type OpenCategoryState = {
    id: Ref<string | undefined>;
    drawerOpen: Ref<boolean>;
    openDrawer: (id: string) => void;
    closeDrawer: () => void;
}
const drawerOpen = ref(false);
const id = ref<string | undefined>(undefined);

export function useOpenCategory(): OpenCategoryState {

    const openDrawer = (categoryId: string) => {
        id.value = categoryId;
        drawerOpen.value = true;
    };

    const closeDrawer = () => {
        id.value = undefined;
        drawerOpen.value = false;
    };

    return {
        id,
        drawerOpen,
        openDrawer,
        closeDrawer
    };
}