<template>
  <v-menu location="bottom end" transition="scale-transition">
    <template #activator="{ props: menuActivatorProps }">
      <v-btn v-bind="menuActivatorProps" variant="text" class="pa-0">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item @click="onEdit(props.id)">
        <v-list-item-title>
          <span class="d-flex align-center ga-2">
            <Edit class="v-icon notranslate" />
            Edit
          </span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>


<script setup lang="ts">
import { Edit } from 'lucide-vue-next';
import { useOpenAccount } from '../hooks/useOpenAccount';

const { openDrawer } = useOpenAccount()

const props = defineProps<{
    id: string | number | undefined
}>()

const onEdit = (id: string | number | undefined) => {
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


</script>