<template>
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
            <v-btn icon @click="onDelete([item])">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </template>
        <template v-slot:[`footer.prepend`]>
            <div class="px-4 py-2 text-sm text-grey-700 mr-auto">
                {{ selected.length }} of {{ filteredItems.length }} selected
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { Trash } from 'lucide-vue-next';
import { ref, computed, defineProps, defineEmits } from 'vue'

const selected = ref<(number | string)[]>([])

const selectedItems = computed(() => {
    return props.items.filter(item => {
        const id = item.id
        return (typeof id === 'string' || typeof id === 'number') && selected.value.includes(id)
    })
})

const props = defineProps<{
    headers: Record<string, string | boolean>[]
    items: Record<string, number | string>[]
    disabled?: boolean
}>()

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


function onDelete(items: Record<string, number | string>[]) {
    emit('delete', items)
}
</script>
