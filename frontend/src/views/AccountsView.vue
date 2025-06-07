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
            <DataTable :headers="headers" :items="items" @edit="editItem" @delete="deleteItem" :disabled="true" />
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { useNewAccount } from '../features/api/accounts/hooks/useNewAccount';
import DataTable from '../features/api/accounts/components/DataTable.vue';

const headers = [
    { title: 'Name', value: 'name', sortable: true },
    { title: 'Email', value: 'email', sortable: true },
    { title: 'Actions', value: 'actions', sortable: false }
]

const items = [
    { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
    { id: 2, name: 'John Smith', email: 'john@example.com' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 4, name: 'Bob Williams', email: 'bob@example.com' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 6, name: 'Diana Prince', email: ' diana@example.com' },
    { id: 7, name: 'Bruce Wayne', email: 'bruce@example.com' },
    { id: 8, name: 'Clark Kent', email: 'clark@example.com' },
    { id: 9, name: 'Peter Parker', email: '     peter@example.com' },
    { id: 10, name: 'Tony Stark', email: 'tony@example.com' },
    { id: 11, name: 'Natasha Romanoff', email: 'natasha@example.com' },
]

const editItem = (item: Record<string, number | string>) => {
    console.log('Edit item:', item);
    // Implement edit logic here
};
const deleteItem = (item: Record<string, number | string>[]) => {
    console.log('Delete item:', item);
    // Implement delete logic here
};

const { openDrawer } = useNewAccount();
</script>

<style scoped>
.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
