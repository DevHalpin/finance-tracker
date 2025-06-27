<template>
  <ConfirmDialog :title="title" :message="message" :model-value="isOpen" @update:model-value="val => isOpen = val" :confirm="handleConfirm" :close="handleCancel" />
  <v-menu location="bottom end" transition="scale-transition">
    <template #activator="{ props: menuActivatorProps }">
      <v-btn v-bind="menuActivatorProps" variant="text" class="pa-0">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item @click="onEdit(props.id)" :disabled="deleteMutation.isPending.value">
        <v-list-item-title>
          <span class="d-flex align-center ga-2">
            <Edit class="v-icon notranslate" />
            Edit
          </span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="onDelete()" :disabled="deleteMutation.isPending.value">
        <v-list-item-title>
          <span class="d-flex align-center ga-2">
            <Trash class="v-icon notranslate" />
            Delete
          </span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>


<script setup lang="ts">
import { Edit, Trash } from 'lucide-vue-next';
import { useOpenAccount } from '../hooks/useOpenAccount';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import { useConfirm } from '../../../hooks/useConfirm';
import ConfirmDialog from '../../../components/ConfirmDialog.vue';


const { openDrawer } = useOpenAccount()
const { isOpen, confirm, title, message, handleConfirm, handleCancel } = useConfirm("Are you sure?", "You are about to delete this account!")

const props = defineProps<{
  id: string | number
}>()
const deleteMutation = useDeleteAccount(() => props.id)

const onEdit = (id: string | number) => {
    // Emit an event to the parent component to handle the edit action
    if (!id) {
        console.warn('Edit action triggered without a valid ID')
        return
    }
    if (typeof id !== 'string' && typeof id !== 'number') {
        console.warn('Edit action triggered with an invalid ID type:', typeof id)
        return
    }
    if (typeof id === 'number'){
        id = id.toString()
    }
    openDrawer(id)
}

const onDelete = async () => {
  const confirmed = await confirm()

  if (!confirmed) return;

  deleteMutation.mutate(undefined, {
    onSuccess: () => {
      console.log('Account deleted successfully')
    },
  })
}


</script>