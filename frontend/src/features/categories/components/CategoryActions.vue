<template>
    <ItemActions :on-edit="onEdit" :on-delete="onDelete" :disabled="deleteMutation.isPending.value" />
</template>

<script setup lang="ts">
import { useOpenCategory } from '../hooks/useOpenCategory';
import { useDeleteCategory } from '../hooks/useDeleteCategory';
import ItemActions from '../../../components/ItemActions.vue';

const { openDrawer } = useOpenCategory();

const props = defineProps<{
    id: string | number;
}>();

const deleteMutation = useDeleteCategory();

const onEdit = () => {
    if (!props.id) {
        console.warn('Edit action triggered without a valid ID');
        return;
    }
    if (typeof props.id !== 'string' && typeof props.id !== 'number') {
        console.warn('Edit action triggered with an invalid ID type:', typeof props.id);
        return;
    }
    openDrawer(props.id.toString());
};

const onDelete = () => {
    const id = typeof props.id === 'string' ? parseInt(props.id) : props.id;
    deleteMutation.mutate({ id });
};
</script>