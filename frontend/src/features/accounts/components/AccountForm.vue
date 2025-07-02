<template>
    <EntityForm 
        ref="entityFormRef"
        :id="id"
        :default-values="defaultValues"
        @submit="emit('submit', $event)"
        @delete="emit('delete')"
        :disabled="disabled"
        name-label="Account Name"
        name-placeholder="e.g. Cash, Bank, Credit Card"
        create-label="Create Account"
        delete-label="Delete Account"
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
