<template>
    <ConfirmDialog :title="title" :message="message" :model-value="isOpen" @update:model-value="val => isOpen = val"
        :confirm="handleConfirm" :close="handleCancel" />
    <SideSheet v-model="open" title="Edit Transaction" description="Edit an existing transaction.">
        <template v-if="isLoading">
            <v-progress-circular indeterminate color="primary" class="mt-4" size="48" />
        </template>

        <template v-else-if="isError">
            <v-alert type="error" class="mt-4">Failed to load transaction</v-alert>
        </template>

        <template v-else>
            <TransactionForm :id="id" :disabled="isDisabled" :default-values="defaultValues" @submit="handleSubmit"
                @delete="handleDelete" :account-options="accountOptions" :category-options="categoryOptions"
                :on-create-account="onCreateAccount" :on-create-category="onCreateCategory" />
        </template>
    </SideSheet>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUpdateTransaction } from '../hooks/useUpdateTransaction';
import { useDeleteTransaction } from '../hooks/useDeleteTransaction';
import { useGetTransaction } from '../hooks/useGetTransaction';
import TransactionForm from './TransactionForm.vue';
import { useConfirm } from '../../../hooks/useConfirm';
import ConfirmDialog from '../../../components/ConfirmDialog.vue';
import SideSheet from '../../../components/SideSheet.vue';
import { useGetAccounts } from '../../accounts/hooks/useGetAccounts';
import { useCreateAccount } from '../../accounts/hooks/useCreateAccount';
import { useGetCategories } from '../../categories/hooks/useGetCategories';
import { useCreateCategory } from '../../categories/hooks/useCreateCategory';

type TransactionValues = {
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

const { isOpen, confirm, title, message, handleConfirm, handleCancel } = useConfirm("Are you sure?", "You are about to delete this transaction!")

// === Query + Mutation ===
const { data: transactionData, isLoading, isError } = useGetTransaction(computed(() => props.id));
const editMutation = useUpdateTransaction();
const deleteMutation = useDeleteTransaction();

const defaultValues = computed(() => {
    if (!transactionData.value) return undefined;
    return {
        ...transactionData.value,
        amount: String(transactionData.value.amount),
        account: {
            label: transactionData.value.account_name,
            value: transactionData.value.account
        },
        category: {
            label: transactionData.value.category_name ?? '',
            value: transactionData.value.category ?? '',
        },
    }
})

const categoryMutation = useCreateCategory();
const categoryQuery = useGetCategories();
const onCreateCategory = async (name: string) => {
    const newCategory = await categoryMutation.mutateAsync({ name });
    if (defaultValues.value) {
        defaultValues.value.category = {
            label: newCategory.name,
            value: String(newCategory.id)
        };
    }
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
    if (defaultValues.value) {
        defaultValues.value.account = {
            label: newAccount.name,
            value: String(newAccount.id)
        };
    }
    return {
        label: newAccount.name,
        value: String(newAccount.id)
    }
}

const accountOptions = computed(() => (accountQuery.data?.value ?? []).map(account => ({
    label: account.name,
    value: String(account.id)
})));


const isDisabled = computed(() => editMutation.isPending.value || deleteMutation.isPending.value || categoryMutation.isPending.value || accountMutation.isPending.value);

const handleSubmit = async (values: TransactionValues) => {
    if (!values.id) return;

    const amount = Math.round(parseFloat(values.amount) * 1000);

    editMutation.mutate({
        id: Number(values.id),
        payee: values.payee,
        date: values.date,
        amount,
        account: Number(values.account.value),
        category: values.category ? Number(values.category.value) : undefined,
        notes: values.notes ?? undefined,
    }, {
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
