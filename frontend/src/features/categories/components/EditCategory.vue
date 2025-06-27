<template>
  <ConfirmDialog :title="title" :message="message" :model-value="isOpen" @update:model-value="val => isOpen = val" :confirm="handleConfirm" :close="handleCancel" />
  <v-navigation-drawer v-model="drawerOpen" location="right" temporary :width="drawerWidth" class="drawer elevation-3">
    <v-container class="pt-6 text-center">
      <v-btn icon variant="text" class="close-btn" @click="drawerOpen = false" aria-label="Close drawer">
        <v-icon color="grey">mdi-close</v-icon>
      </v-btn>

      <section>
        <h2 class="text-h6 font-weight-bold mb-1">Edit Category</h2>
        <p class="text-body-2 text-grey-darken-1">Edit an existing category.</p>
      </section>
    </v-container>

    <template v-if="isLoading">
      <v-progress-circular indeterminate color="primary" class="mt-4" size="48" />
    </template>

    <template v-else-if="isError">
      <v-alert type="error" class="mt-4">Failed to load category</v-alert>
    </template>

    <template v-else>
      <CategoryForm :id="reactiveId" :disabled="isDisabled" :default-values="categoryData" @submit="handleSubmit"
        @delete="handleDelete" />
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useOpenCategory } from '../hooks/useOpenCategory';
import { useUpdateCategory } from '../hooks/useUpdateCategory';
import { useDeleteCategory } from '../hooks/useDeleteCategory';
import { useGetCategory } from '../hooks/useGetCategory';
import CategoryForm from './CategoryForm.vue';
import { useConfirm } from '../../../hooks/useConfirm';
import type { FormValues } from './CategoryForm.vue';
import ConfirmDialog from '../../../components/ConfirmDialog.vue';

// === Drawer state ===
const { id, drawerOpen } = useOpenCategory();

const { isOpen, confirm, title, message, handleConfirm, handleCancel } = useConfirm("Are you sure?", "You are about to delete this category!")

const reactiveId = computed(() =>
  typeof id.value === 'string' ? id.value : undefined
);

// === Query + Mutation ===
const { data: categoryData, isLoading, isError } = useGetCategory(reactiveId);
const editMutation = useUpdateCategory();
const deleteMutation = useDeleteCategory();
const isDisabled = computed(() => editMutation.isPending.value || deleteMutation.isPending.value);

const handleSubmit = async (values: FormValues) => {
  if (!values.id) return;
  editMutation.mutate({ ...values, id: values.id }, {
    onSuccess: () => {
      drawerOpen.value = false;
    },
  });
};

const handleDelete = async () => {
  const confirmed = await confirm()

  if (!confirmed || !id.value) return;

  const numberId = parseInt(id.value);

  deleteMutation.mutate({id: numberId}, {
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
