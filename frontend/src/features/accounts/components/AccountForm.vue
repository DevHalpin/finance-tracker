<template>
    <v-form ref="formRef" @submit.prevent="submitForm" v-model="isFormValid" class="pt-4">
        <v-text-field class="mb-4" v-model="form.name" label="Account Name" placeholder="e.g. Cash, Bank, Credit Card"
            :rules="nameRules" :disabled="disabled" variant="outlined" density="comfortable" />

        <v-btn type="submit" :disabled="!isFormValid || disabled" color="primary" block class="mb-4">
            {{ id ? "Save Changes" : "Create Account" }}
        </v-btn>

        <v-btn v-if="!!id && onDelete" type="button" @click="handleDelete" :disabled="disabled" variant="outlined"
            block>
            <Trash class="mr-2" />
            Delete Account
        </v-btn>
    </v-form>

</template>

<script lang="ts" setup>
import { ref, watch, defineExpose } from 'vue';
import { VForm } from 'vuetify/components';
import { Trash } from 'lucide-vue-next';

export interface FormValues {
  name: string;
}

const props = defineProps<{
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', values: FormValues): void;
  (e: 'delete'): void;
}>();

const formRef = ref<VForm | null>(null);
const isFormValid = ref(false);

const form = ref<FormValues>({
  name: props.defaultValues?.name || '',
});

const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => v.length >= 3 || 'Name must be at least 3 characters',
];

watch(
  () => props.defaultValues,
  (newValues) => {
    form.value = { name: newValues?.name || '' };
  }
);

const submitForm = async () => {
  const valid = await formRef.value?.validate();
  if (valid) {
    emit('submit', form.value);
  }
};

const handleDelete = () => {
  emit('delete');
};

const reset = () => {
  form.value = { name: '' };
  isFormValid.value = false;
  formRef.value?.resetValidation();
};

defineExpose({ reset });
</script>
