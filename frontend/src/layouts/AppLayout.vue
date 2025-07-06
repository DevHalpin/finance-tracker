<template>
    <v-app>
        <NewAccountDrawer v-model="newAccountOpen" />
        <EditAccountDrawer v-model="editAccountOpen" :id="editAccountId" />
        <EditCategoryDrawer v-model="editCategoryOpen" :id="editCategoryId" />
        <NewCategoryDrawer v-model="newCategoryOpen" />
        <NewTransactionDrawer v-model="newTransactionOpen" />
        <EditTransactionDrawer v-model="editTransactionOpen" :id="editTransactionId" />
        <HeaderView />
        <router-view />
    </v-app>
</template>

<script setup lang="ts">
import HeaderView from '../components/HeaderView.vue';
import NewAccountDrawer from '../features/accounts/components/NewAccount.vue';
import EditAccountDrawer from '../features/accounts/components/EditAccount.vue';
import EditCategoryDrawer from '../features/categories/components/EditCategory.vue';
import NewCategoryDrawer from '../features/categories/components/NewCategory.vue';
import NewTransactionDrawer from '../features/transactions/components/NewTransaction.vue';
import EditTransactionDrawer from '../features/transactions/components/EditTransaction.vue';
import { useNewAccount } from '../features/accounts/hooks/useNewAccount';
import { useOpenAccount } from '../features/accounts/hooks/useOpenAccount';
import { useNewCategory } from '../features/categories/hooks/useNewCategory';
import { useOpenCategory } from '../features/categories/hooks/useOpenCategory';
import { useNewTransaction } from '../features/transactions/hooks/useNewTransaction';
import { useOpenTransaction } from '../features/transactions/hooks/useOpenTransaction';
const { drawerOpen: editTransactionOpen, id: editTransactionId } = useOpenTransaction();
const { drawerOpen: newTransactionOpen } = useNewTransaction();
const { drawerOpen: newAccountOpen } = useNewAccount();
const { drawerOpen: editAccountOpen, id: editAccountId } = useOpenAccount();
const { drawerOpen: newCategoryOpen } = useNewCategory();
const { drawerOpen: editCategoryOpen, id: editCategoryId } = useOpenCategory();
</script>