<template>
    <ItemActions :on-edit="onEdit" :on-delete="onDelete" :disabled="deleteMutation.isPending.value" />
</template>

<script setup lang="ts">
import { useOpenAccount } from '../hooks/useOpenAccount';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import ItemActions from '../../../components/ItemActions.vue';

const { openDrawer } = useOpenAccount();

const props = defineProps<{
    id: string | number;
}>();

const deleteMutation = useDeleteAccount();

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