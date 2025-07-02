<template>
    <SideSheet v-model="open" title="New Category" description="Create a new category to organize your transactions.">
        <CategoryForm :id="undefined" ref="formRef" :disabled="isDisabled" @submit="handleSubmit" />
    </SideSheet>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import SideSheet from '../../../components/SideSheet.vue';
import CategoryForm from './CategoryForm.vue';
import { useCreateCategory } from '../hooks/useCreateCategory';

interface CategoryFormValues {
    name: string;
}

interface CategoryFormExposed {
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

const formRef = ref<ComponentPublicInstance<CategoryFormExposed> | null>(null);
const mutation = useCreateCategory();
const isDisabled = computed(() => mutation.isPending.value);

const handleSubmit = (values: CategoryFormValues) => {
    mutation.mutate(values, {
        onSuccess: () => {
            emit('created');
            open.value = false;
            formRef.value?.reset();
        },
    });
};
</script>
