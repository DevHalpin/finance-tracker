<template>
    <v-container class="pb-10" style="margin-top: -7rem;" max-width="1570px">
        <v-card class="elevation-1 pa-4">
            <div class="d-flex flex-lg-row align-start align-lg-center justify-lg-space-between ga-2">
                <v-card-title class="text-h6 text-truncate">Accounts</v-card-title>
                <v-btn color="primary" variant="flat" size="small" @click="openDrawer">
                    <Plus class="mr-2" />
                    Add New
                </v-btn>
            </div>

            <v-alert type="error" v-if="isError">Failed to load accounts.</v-alert>

            <div v-else-if="isLoading">
                <v-card class="pa-4" elevation="0">
                    <v-skeleton-loader type="heading" class="mb-4" width="300px" />
                    <div class="d-flex justify-center" style="height: 500px;">
                        <v-progress-circular
                            indeterminate
                            size="48"
                            color="grey-lighten-1"
                            class="my-auto"
                        />
                    </div>
                </v-card>
            </div>

            <DataTable
                v-else
                :headers="headers"
                :items="items"
                @edit="editItem"
                @delete="deleteItem"
                :disabled="true"
            />
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Plus } from 'lucide-vue-next';
import { useNewAccount } from '../features/api/accounts/hooks/useNewAccount';
import DataTable from '../features/api/accounts/components/DataTable.vue';
import { useGetAccounts } from '../features/api/accounts/hooks/useGetAccounts';

const { openDrawer } = useNewAccount();
const { data: accounts, isLoading, isError } = useGetAccounts();


const headers = [
    { title: 'Name', value: 'name', sortable: true },
    { title: 'Actions', value: 'actions', sortable: false }
]

const items = computed(() =>
    accounts.value?.map(account => ({
        id: account.id,
        name: account.name,
    })) ?? []
);
// const items: Record<string, string | number>[] = accounts.map(account => ({
//   id: account.id,
//   name: account.name,
// }));

const editItem = (item: Record<string, number | string>) => {
    console.log('Edit item:', item);
    // Implement edit logic here
};
const deleteItem = (item: Record<string, number | string>[]) => {
    console.log('Delete item:', item);
    // Implement delete logic here
};

</script>

<style scoped>
.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
