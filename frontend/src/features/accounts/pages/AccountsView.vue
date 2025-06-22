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
            <div class="d-flex flex-lg-row align-start align-lg-center justify-lg-space-between ga-2">
                <v-card-title class="text-h6 text-truncate">Accounts</v-card-title>
                <v-btn color="primary" variant="flat" size="small" @click="openDrawer">
                    <Plus class="mr-2" />
                    Add New
                </v-btn>
            </div>

            <v-alert type="error" v-if="isError">Failed to load accounts.</v-alert>

            <DataTable v-else :headers="headers" :items="accountsInfo" @edit="editItem" @delete="deleteItem"
                :disabled="isDisabled" />
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Plus } from 'lucide-vue-next';
import { useNewAccount } from '../hooks/useNewAccount';
import { useGetAccounts } from '../hooks/useGetAccounts';
import { useBulkDeleteAccounts } from '../hooks/useBulkDelete';
import DataTable from '../../../components/DataTable.vue';

const { openDrawer } = useNewAccount();
const { data: accounts, isLoading, isError } = useGetAccounts();
const deleteAccounts = useBulkDeleteAccounts();

const isDisabled = computed(() => isLoading.value || deleteAccounts.isPending.value);


const headers = [
    { title: 'Name', value: 'name', sortable: true },
    { title: '', value: 'actions', sortable: false }
]

const accountsInfo = computed(() =>
    accounts.value?.map(account => ({
        id: account.id,
        name: account.name,
    })) ?? []
);

const editItem = (item: Record<string, number | string>) => {
    console.log('Edit item:', item);
    // Implement edit logic here
};
const deleteItem = (rows: Record<string, number | string>[]) => {

    const ids: number[] = rows
        .map(r => r.id)
        .filter((id): id is string | number => id !== undefined)
        .map(Number);


    if (!ids.length || isDisabled.value) return;

    deleteAccounts.mutate({ ids });
}

</script>

<style scoped>
.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
