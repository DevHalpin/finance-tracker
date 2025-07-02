<template>
    <ConfirmDialog :title="title" :message="message" :model-value="isOpen" @update:model-value="val => isOpen = val"
        :confirm="handleConfirm" :close="handleCancel" />
    <SideSheet v-model="open" title="Edit Account" description="Edit an existing account.">
        <template v-if="isLoading">
            <v-progress-circular indeterminate color="primary" class="mt-4" size="48" />
        </template>

        <template v-else-if="isError">
            <v-alert type="error" class="mt-4">Failed to load account</v-alert>
        </template>

        <template v-else>
            <AccountForm :id="id" :disabled="isDisabled" :default-values="accountData" @submit="handleSubmit"
                @delete="handleDelete" />
        </template>
    </SideSheet>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUpdateAccount } from '../hooks/useUpdateAccount';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import { useGetAccount } from '../hooks/useGetAccount';
import AccountForm from './AccountForm.vue';
import { useConfirm } from '../../../hooks/useConfirm';
import type { FormValues } from '../../../components/EntityForm.vue';
import ConfirmDialog from '../../../components/ConfirmDialog.vue';
import SideSheet from '../../../components/SideSheet.vue';

const props = defineProps<{
    id: string | undefined;
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const open = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const { isOpen, confirm, title, message, handleConfirm, handleCancel } = useConfirm("Are you sure?", "You are about to delete this account!")

// === Query + Mutation ===
const { data: accountData, isLoading, isError } = useGetAccount(computed(() => props.id));
const editMutation = useUpdateAccount();
const deleteMutation = useDeleteAccount();
const isDisabled = computed(() => editMutation.isPending.value || deleteMutation.isPending.value);

const handleSubmit = async (values: FormValues) => {
    if (!values.id) return;
    editMutation.mutate({ ...values, id: values.id }, {
        onSuccess: () => {
            open.value = false;
        },
    });
};

const handleDelete = async () => {
    const confirmed = await confirm()

    if (!confirmed || !props.id) return;

    const numberId = parseInt(props.id);


    deleteMutation.mutate({ id: numberId }, {
        onSuccess: () => {
            open.value = false;
        },
    });
};
</script>
