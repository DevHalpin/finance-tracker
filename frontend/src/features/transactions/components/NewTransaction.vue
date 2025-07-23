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
import TransactionForm from './TransactionForm.vue';
import { useCreateTransaction } from '../hooks/useCreateTransaction';
import { useCreateCategory } from '../../categories/hooks/useCreateCategory';
import { useGetCategories } from '../../categories/hooks/useGetCategories';
import { useGetAccounts } from '../../accounts/hooks/useGetAccounts';
import { useCreateAccount } from '../../accounts/hooks/useCreateAccount';
import { convertAmountToMilliunits } from '../../../libs/utils';

const categoryMutation = useCreateCategory();
const categoryQuery = useGetCategories();
const onCreateCategory = async (name: string) => {
    const newCategory = await categoryMutation.mutateAsync({ name });
    return {
        label: newCategory.name,
        value: String(newCategory.id)
    }
}

const categoryOptions = computed(() => (categoryQuery.data?.value ?? []).map(category => ({
    label: category.name,
    value: String(category.id)
})));

const accountQuery = useGetAccounts();
const accountMutation = useCreateAccount();

const onCreateAccount = async (name: string) => {
    const newAccount = await accountMutation.mutateAsync({ name });
    return {
        label: newAccount.name,
        value: String(newAccount.id)
    }
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

type TransactionFormValues = {
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

const formRef = ref<ComponentPublicInstance<TransactionFormExposed> | null>(null);
const createMutation = useCreateTransaction();
const isDisabled = computed(() => createMutation.isPending.value || categoryMutation.isPending.value || accountMutation.isPending.value);
const isLoading = computed(() => categoryQuery.isLoading.value || accountQuery.isLoading.value);
const handleSubmit = (values: TransactionFormValues) => {
    const amount = parseFloat(values.amount);
    const amountInMilliunits = convertAmountToMilliunits(amount)
    console.log(values)
    createMutation.mutate({
        amount: amountInMilliunits,
        payee: values.payee,
        date: values.date,
        account: values.account.value,
        category: values.category ? values.category.value : undefined,
        notes: values.notes ? values.notes : undefined,
    })
};
</script>
