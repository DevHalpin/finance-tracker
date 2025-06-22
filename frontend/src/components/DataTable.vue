<template>
    <ConfirmDialog :title="title" :message="message" :model-value="isOpen" @update:model-value="val => isOpen = val" :confirm="handleConfirm" :close="handleCancel" />
    <div class="d-flex">
        <v-row>
            <v-col cols="6">
                <v-text-field v-model="search" label="Search" hide-details density="compact" clearable />
            </v-col>
        </v-row>
        <v-btn v-if="selected.length > 0" @click="onDelete(selectedItems)" :disabled="disabled">
            <Trash class="size-4 mr-2" />
            Delete ({{ selected.length }})
        </v-btn>
    </div>

    <v-data-table :headers="headers" :items="filteredItems" item-value="id" show-select v-model="selected" class="pt-4">
        <template v-slot:[`item.actions`]="{ item }">
            <Actions :id="item.id" />
        </template>
        <template v-slot:[`footer.prepend`]>
            <div class="px-4 py-2 text-sm text-grey-700 mr-auto">
                {{ selected.length }} of {{ filteredItems.length }} row(s) selected
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { Trash } from 'lucide-vue-next';
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue';
import Actions from '../features/accounts/components/ActionsSection.vue';

import { useConfirm } from '../hooks/useConfirm';

const { isOpen, confirm, title, message, handleConfirm, handleCancel } = useConfirm("Are you sure?", "You are about to perform a bulk delete.")
const props = defineProps<{
    headers: Record<string, string | boolean>[]
    items: Record<string, number | string>[]
    disabled?: boolean
}>()

const selected = ref<(number | string)[]>([])

watch(() => props.items, () => {
    selected.value = selected.value.filter(id => {
        return props.items.some(item => item.id === id)
    })
}, { deep: true, immediate: true }
)

const selectedItems = computed(() => {
    return props.items.filter(item => {
        const id = item.id
        return (typeof id === 'string' || typeof id === 'number') && selected.value.includes(id)
    })
})


const emit = defineEmits<{
    (e: 'delete', items: Record<string, number | string>[]): void
}>()

const search = ref('')

const filteredItems = computed(() => {
    if (!search.value) return props.items
    return props.items.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(search.value.toLowerCase())
        )
    )
})


const onDelete = async (items: Record<string, number | string>[]) => {
  if (props.disabled || items.length === 0) return;

  const names = items.map(i => i.name).filter(n => typeof n === 'string') as string[]
  const titleText = `Delete ${items.length} item${items.length > 1 ? 's' : ''}?`
  const messageText = names.length
    ? `Are you sure you want to delete:\n- ${names.join('\n- ')}`
    : `Are you sure you want to delete ${items.length} item(s)?`

  const confirmed = await confirm(titleText, messageText)
  if (!confirmed) return

  emit('delete', items)
}
</script>
