<template>
    <v-dialog :model-value="modelValue" @update:model-value="onUpdate" max-width="500">
        <v-card>
            <v-card-title class="text-h6">{{ title }} </v-card-title>
            <v-divider />
            <v-card-text class="py-6 px-4 text-body-1">
                <div v-for="(line, index) in message.split('\n')" :key="index">
                    {{ line }}
                </div>
            </v-card-text>

            <v-divider />

            <v-card-actions class="justify-end px-4 pb-4 pt-2">
                <v-btn variant="text" @click="close">Cancel</v-btn>
                <v-btn color="error" variant="flat" @click="confirm">Confirm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    modelValue: boolean
    message: string
    confirm: () => void
    close: () => void
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

function onUpdate(val: boolean) {
    emit('update:modelValue', val)
}
</script>
