<template>
    <v-app>
        <NewAccountDrawer v-model="newAccountOpen" />
        <EditAccountDrawer v-model="editAccountOpen" :id="editAccountId" />
        <EditCategoryDrawer v-model="editCategoryOpen" :id="editCategoryId" />
        <NewCategoryDrawer v-model="newCategoryOpen" />
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
import { useNewAccount } from '../features/accounts/hooks/useNewAccount';
import { useOpenAccount } from '../features/accounts/hooks/useOpenAccount';
import { useNewCategory } from '../features/categories/hooks/useNewCategory';
import { useOpenCategory } from '../features/categories/hooks/useOpenCategory';
const { drawerOpen: newAccountOpen } = useNewAccount();
const { drawerOpen: editAccountOpen, id: editAccountId } = useOpenAccount();
const { drawerOpen: newCategoryOpen } = useNewCategory();
const { drawerOpen: editCategoryOpen, id: editCategoryId } = useOpenCategory();
</script>