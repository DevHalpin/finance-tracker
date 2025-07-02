<template>
    <EntityForm 
        ref="entityFormRef"
        :id="id"
        :default-values="defaultValues"
        @submit="emit('submit', $event)"
        @delete="emit('delete')"
        :disabled="disabled"
        name-label="Category Name"
        name-placeholder="e.g. Food, Travel, etc."
        create-label="Create Category"
        delete-label="Delete Category"
    />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EntityForm, { type FormValues } from '../../../components/EntityForm.vue';

defineProps<{
  id: string | undefined;
  defaultValues?: FormValues;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', values: FormValues): void;
  (e: 'delete'): void;
}>();

const entityFormRef = ref<InstanceType<typeof EntityForm> | null>(null);

const reset = () => {
    entityFormRef.value?.reset();
}

defineExpose({
    reset
});
</script>
