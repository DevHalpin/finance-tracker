<template>
  <v-form ref="formRef" @submit.prevent="submitForm" v-model="isFormValid" class="pt-4">
    <DatePicker class="mb-4" v-model="form.date" label="Date" :disabled="disabled" />
    <SelectBox class="mb-4" v-model="form.account" label="Account" :options="accountOptions" :disabled="disabled" @create="onCreateAccount" placeholder="Select an account" />
    <SelectBox class="mb-4" v-model="form.category" label="Category" :options="categoryOptions" :disabled="disabled" @create="onCreateCategory" placeholder="Select a category" />
    <CurrencyInput class="mb-4" v-model="form.amount" label="Amount" :rules="amountRules" :disabled="disabled" />
    <v-text-field class="mb-4" v-model="form.payee" label="Payee" :rules="payeeRules" :disabled="disabled" variant="outlined" density="comfortable" />
    <v-textarea class="mb-4" v-model="form.notes" label="Notes" :disabled="disabled" variant="outlined" density="comfortable" auto-grow rows="1" />

    <v-btn type="submit" :disabled="!isFormValid || disabled" color="primary" block class="mb-4">
      {{ id ? "Save Changes" : "Create Transaction" }}
    </v-btn>

    <v-btn v-if="!!id && onDelete" type="button" @click="handleDelete" :disabled="disabled" variant="outlined" block>
      <Trash class="mr-2" />
      Delete Transaction
    </v-btn>
  </v-form>
</template>

<script lang="ts" setup>
import { ref, watch, defineExpose } from 'vue';
import { VForm } from 'vuetify/components';
import { Trash } from 'lucide-vue-next';
import SelectBox from '../../../components/SelectBox.vue';
import DatePicker from '../../../components/DatePicker.vue';
import CurrencyInput from '../../../components/CurrencyInput.vue';

interface FormValues {
  id?: string;
  amount: string;
  payee: string;
  date: string;
  account: {
    label: string;
    value: string;
  };
  category: {
    label: string;
    value: string;
  } | null;
  notes: string | null;
}

type Option = {
  label: string;
  value: string;
}

const props = defineProps<{
  id?: string;
  defaultValues?: FormValues;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => Promise<Option | void>;
  onCreateCategory: (name: string) => Promise<Option | void>;
  onDelete?: () => void;
}>();


const emit = defineEmits<{
  (e: 'submit', values: FormValues): void;
  (e: 'delete'): void;
}>();

const formRef = ref<VForm | null>(null);
const isFormValid = ref(false);

const form = ref<FormValues>({
  id: props.id,
  amount: props.defaultValues?.amount || '',
  payee: props.defaultValues?.payee || '',
  date: props.defaultValues?.date || '',
  account: {
    label: props.defaultValues?.account.label || '',
    value: props.defaultValues?.account.value || '',
  },
  category: {
    label: props.defaultValues?.category?.label || '',
    value: props.defaultValues?.category?.value || '',
  },
  notes: props.defaultValues?.notes || '',
});

const amountRules = [
  (v: string) => !!v || 'Amount is required',
];
const payeeRules = [
  (v: string) => !!v || 'Payee is required',
];

watch(
  () => props.defaultValues,
  (newValues) => {
    if (newValues) {
      form.value = {
        id: props.id,
        amount: newValues.amount,
        payee: newValues.payee,
        date: newValues.date,
        account: {
          label: newValues.account.label,
          value: newValues.account.value,
        },
        category: {
          label: newValues.category?.label || '',
          value: newValues.category?.value || '',
        },
        notes: newValues.notes,
      };
    }
  }
);

const submitForm = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    if (valid) {
      emit('submit', form.value);
    }
  }
};

const handleDelete = () => {
  if (props.onDelete) {
    props.onDelete();
  }
};

const reset = () => {
  form.value = {
    id: props.id,
    amount: '',
    payee: '',
    date: '',
    account: {
      label: '',
      value: '',
    },
    category: {
      label: '',
      value: '',
    },
    notes: '',
  };
  isFormValid.value = false;
  formRef.value?.resetValidation();
};

defineExpose({ reset });
</script>
