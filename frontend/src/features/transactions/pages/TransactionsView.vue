<template>
    <v-container class="pb-10" style="margin-top: -7rem;" max-width="1570px">
        <div v-if="isLoading">
            <v-card class="elevation-1 pa-4">
                <div class="d-flex flex-lg-row align-start align-lg-center justify-lg-space-between ga-2 mb-4">
                    <v-skeleton-loader type="heading" width="150px" />
                    <v-skeleton-loader type="button" width="100px" />
                </div>

                <v-skeleton-loader type="table-heading" class="mb-2" />

                <v-container class="pa-0" fluid>
                    <v-row v-for="i in 3" :key="i" class="align-center">
                        <v-col cols="1" class="d-flex justify-center">
                            <v-skeleton-loader width="24px" height="24px" class="rounded-sm" />
                        </v-col>
                        <v-col cols="8">
                            <v-skeleton-loader type="text" width="70%" />
                        </v-col>
                        <v-col cols="3" class="text-end">
                            <v-skeleton-loader type="avatar" width="40px" height="40px" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </div>
        <v-card v-else class="elevation-1 pa-4">
            <div v-if="variant === VARIANTS.IMPORT" class="mb-4">
                <ImportCard :data="importResults.data" :onCancel="cancelImport" :onSubmit="handleImportSubmit" />
            </div>
            <div v-else>
                <div class="d-flex flex-lg-row align-start align-lg-center justify-lg-space-between ga-2">
                    <v-card-title class="text-h6 text-truncate">Transactions History</v-card-title>
                    <div class="d-flex flex-row align-center ga-2">
                        <v-btn color="primary" variant="flat" size="small" @click="openNewDrawer">
                            <Plus class="mr-2" />
                            Add New
                        </v-btn>
                        <UploadButton @upload="handleUpload" />
                    </div>
                </div>

                <v-alert type="error" v-if="isError">Failed to load Transactions.</v-alert>

                <DataTable v-else :headers="headers" :items="transactionsInfo" @delete="deleteBulk"
                    :disabled="isDisabled" :actions-component="TransactionActions" />
            </div>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import TransactionActions from '../components/TransactionActions.vue';
import { useNewTransaction } from '../hooks/useNewTransaction';
import { useGetTransactions } from '../hooks/useGetTransactions';
import { useBulkDeleteTransactions } from '../hooks/useBulkDelete';
import DataTable from '../../../components/DataTable.vue';
import { format } from 'date-fns';
import { formatCurrency } from '../../../libs/utils';
import UploadButton from '../components/UploadButton.vue';
import ImportCard from '../components/ImportCard.vue';

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
}

type ImportResults = {
  data: Record<string, string>[];
  errors: unknown[];
  meta: unknown;
};

const { openDrawer: openNewDrawer } = useNewTransaction();
const { data: transactions, isLoading, isError } = useGetTransactions();
const deleteTransactions = useBulkDeleteTransactions();
const variant = ref(VARIANTS.LIST);
const importResults = ref<ImportResults>({
  data: [],
  errors: [],
  meta: {}
});


const isDisabled = computed(() => isLoading.value || deleteTransactions.isPending.value);




const headers = [
    { title: 'Date', value: 'date', sortable: true },
    { title: 'Category', value: 'category', sortable: true },
    { title: 'Payee', value: 'payee', sortable: true },
    { title: 'Amount', value: 'amount', sortable: true },
    { title: 'Account', value: 'account', sortable: true },
    { title: 'Notes', value: 'notes', sortable: false },
    { title: '', value: 'actions', sortable: false }
]

const transactionsInfo = computed(() =>
    transactions.value?.map(transaction => ({
        id: transaction.id,
        payee: transaction.payee,
        date: format(transaction.date, "MMMM dd, yyyy"),
        amount: formatCurrency(transaction.amount / 1000),
        account: transaction.account_name,
        category: transaction.category_name,
        notes: transaction.notes,
    })) ?? []
);

console.log("Transactions Info:", transactionsInfo.value);

const deleteBulk = (rows: Record<string, number | string | undefined | null | boolean>[]) => {

    const ids: number[] = rows
        .map(r => r.id)
        .filter((id): id is string | number => id !== undefined)
        .map(Number);


    if (!ids.length || isDisabled.value) return;

    deleteTransactions.mutate({ ids });
}

const cancelImport = () => {
  variant.value = VARIANTS.LIST;
  importResults.value = { data: [], errors: [], meta: {} };
};

const handleUpload = (results: ImportResults) => {
  console.log('Upload results:', results);
  variant.value = VARIANTS.IMPORT;
  importResults.value = results;
};

const handleImportSubmit = (data: Record<string, string>[]) => {
  console.log('Import data:', data);
  // Here you would typically send the data to your backend for processing
  // For now, we just log it and reset the import state
  cancelImport();
};
</script>

<style scoped>
.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
