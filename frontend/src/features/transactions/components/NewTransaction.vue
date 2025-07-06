<template>
    <SideSheet v-model="open" title="New Transaction" description="Create a new transaction.">
        
        <div v-if="isLoading" class="d-flex justify-center py-10">
            <v-progress-circular indeterminate color="primary" />
        </div>
        <TransactionForm v-else :id="undefined" ref="formRef" :disabled="isDisabled" @submit="handleSubmit"
            :categoryOptions="categoryOptions" :accountOptions="accountOptions" :onCreateCategory="onCreateCategory"
            :onCreateAccount="onCreateAccount" />
    </SideSheet>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import SideSheet from '../../../components/SideSheet.vue';
import TransactionForm, { type FormValues as TransactionFormValues } from './TransactionForm.vue';
import { useCreateTransaction } from '../hooks/useCreateTransaction';
import { useCreateCategory } from '../../categories/hooks/useCreateCategory';
import { useGetCategories } from '../../categories/hooks/useGetCategories';
import { useGetAccounts } from '../../accounts/hooks/useGetAccounts';
import { useCreateAccount } from '../../accounts/hooks/useCreateAccount';
import { convertAmountToMilliunits } from '../../../libs/utils';

const categoryMutation = useCreateCategory();
const categoryQuery = useGetCategories();
const onCreateCategory = (name: string) => {
    categoryMutation.mutate({ name });
}

const categoryOptions = computed(() => (categoryQuery.data?.value ?? []).map(category => ({
    label: category.name,
    value: String(category.id)
})));

const accountQuery = useGetAccounts();
const accountMutation = useCreateAccount();

const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name });
}

const accountOptions = computed(() => (accountQuery.data?.value ?? []).map(account => ({
    label: account.name,
    value: String(account.id)
})));

interface TransactionFormExposed {
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

const formRef = ref<ComponentPublicInstance<TransactionFormExposed> | null>(null);
const createMutation = useCreateTransaction();
const isDisabled = computed(() => createMutation.isPending.value || categoryMutation.isPending.value || accountMutation.isPending.value);
const isLoading = computed(() => categoryQuery.isLoading.value || accountQuery.isLoading.value);
const handleSubmit = (values: TransactionFormValues) => {
    const amount = parseFloat(values.amount);
    const amountInMilliunits = convertAmountToMilliunits(amount)
    console.log(values.account.valueOf())
    createMutation.mutate({
        amount: amountInMilliunits,
        payee: values.payee,
        date: values.date,
        account: "42",
        category: "12",
        notes: values.notes ? values.notes : undefined,
    })
    // console.log(values)
};
</script>
