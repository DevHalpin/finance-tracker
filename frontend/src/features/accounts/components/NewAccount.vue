<template>
    <SideSheet v-model="open" title="New Account" description="Create a new account to track your transactions.">
        <AccountForm :id="undefined" ref="formRef" :disabled="isDisabled" @submit="handleSubmit" />
    </SideSheet>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import SideSheet from '../../../components/SideSheet.vue';
import AccountForm from './AccountForm.vue';
import { useCreateAccount } from '../hooks/useCreateAccount';

interface AccountFormValues {
    name: string;
}

interface AccountFormExposed {
    reset: () => void;
}

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'created'): void;
}>();

const open = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const formRef = ref<ComponentPublicInstance<AccountFormExposed> | null>(null);
const mutation = useCreateAccount();
const isDisabled = computed(() => mutation.isPending.value);

const handleSubmit = (values: AccountFormValues) => {
    mutation.mutate(values, {
        onSuccess: () => {
            emit('created');
            open.value = false;
            formRef.value?.reset();
        },
    });
};
</script>
