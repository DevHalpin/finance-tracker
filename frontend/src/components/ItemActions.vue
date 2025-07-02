<template>
    <ConfirmDialog :title="title" :message="message" :model-value="isOpen" @update:model-value="val => isOpen = val"
        :confirm="handleConfirm" :close="handleCancel" />
    <v-menu location="bottom end" transition="scale-transition">
        <template #activator="{ props: menuActivatorProps }">
            <v-btn v-bind="menuActivatorProps" variant="text" class="pa-0">
                <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
        </template>

        <v-list>
            <v-list-item @click="onEdit" :disabled="disabled">
                <v-list-item-title>
                    <span class="d-flex align-center ga-2">
                        <Edit class="v-icon notranslate" />
                        Edit
                    </span>
                </v-list-item-title>
            </v-list-item>
            <v-list-item @click="onDelete" :disabled="disabled">
                <v-list-item-title>
                    <span class="d-flex align-center ga-2">
                        <Trash class="v-icon notranslate" />
                        Delete
                    </span>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import { Edit, Trash } from 'lucide-vue-next';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from './ConfirmDialog.vue';

const props = defineProps<{
    disabled?: boolean;
    onEdit: () => void;
    onDelete: () => void;
}>();

const { isOpen, confirm, title, message, handleConfirm, handleCancel } = useConfirm("Are you sure?", "You are about to perform a delete action.")

const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
        props.onDelete();
    }
};
</script>