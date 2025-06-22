<template>
  <ConfirmDialog :title="title" :message="message" :model-value="isOpen" @update:model-value="val => isOpen = val" :confirm="handleConfirm" :close="handleCancel" />
  <v-navigation-drawer v-model="drawerOpen" location="right" temporary :width="drawerWidth" class="drawer elevation-3">
    <v-container class="pt-6 text-center">
      <v-btn icon variant="text" class="close-btn" @click="drawerOpen = false" aria-label="Close drawer">
        <v-icon color="grey">mdi-close</v-icon>
      </v-btn>

      <section>
        <h2 class="text-h6 font-weight-bold mb-1">Edit Account</h2>
        <p class="text-body-2 text-grey-darken-1">Edit an existing account.</p>
      </section>
    </v-container>

    <template v-if="isLoading">
      <v-progress-circular indeterminate color="primary" class="mt-4" size="48" />
    </template>

    <template v-else-if="isError">
      <v-alert type="error" class="mt-4">Failed to load account</v-alert>
    </template>

    <template v-else>
      <AccountForm :id="reactiveId" :disabled="isDisabled" :default-values="accountData" @submit="handleSubmit"
        @delete="handleDelete" />
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useOpenAccount } from '../hooks/useOpenAccount';
import { useUpdateAccount } from '../hooks/useUpdateAccount';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import { useGetAccount } from '../hooks/useGetAccount';
import AccountForm from './AccountForm.vue';
import {  useConfirm } from '../../../hooks/useConfirm';
import type { FormValues } from './AccountForm.vue';
import ConfirmDialog from '../../../components/ConfirmDialog.vue';

// === Drawer state ===
const { id, drawerOpen } = useOpenAccount();

const { isOpen, confirm, title, message, handleConfirm, handleCancel } = useConfirm("Are you sure?", "You are about to delete this account!")

const reactiveId = computed(() =>
  typeof id.value === 'string' ? id.value : undefined
);

// === Query + Mutation ===
const { data: accountData, isLoading, isError } = useGetAccount(reactiveId);
const editMutation = useUpdateAccount(() => reactiveId.value!);
const deleteMutation = useDeleteAccount(() => reactiveId.value!);
const isDisabled = computed(() => editMutation.isPending.value || deleteMutation.isPending.value);

const handleSubmit = async (values: FormValues) => {
  editMutation.mutate(values, {
    onSuccess: () => {
      drawerOpen.value = false;
    },
  });
};

const handleDelete = async () => {
  const confirmed = await confirm()

  if (!confirmed) return;

  deleteMutation.mutate(undefined, {
    onSuccess: () => {
      drawerOpen.value = false;
    },
  });
};

// === Responsive width ===
const { smAndDown, width } = useDisplay();
const drawerWidth = computed(() =>
  smAndDown.value ? width.value || 300 : 400
);
</script>

<style scoped>
.drawer {
  border-left: 1px solid #e0e0e0;
  background-color: white;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}
</style>
