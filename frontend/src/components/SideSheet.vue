<template>
    <v-navigation-drawer v-model="open" location="right" temporary :width="drawerWidth" class="drawer elevation-3">
        <v-container class="pt-6 text-center">
            <v-btn icon variant="text" class="close-btn" @click="open = false" aria-label="Close drawer">
                <v-icon color="grey">mdi-close</v-icon>
            </v-btn>

            <section>
                <h2 class="text-h6 font-weight-bold mb-1">{{ title }}</h2>
                <p class="text-body-2 text-grey-darken-1">{{ description }}</p>
            </section>
        </v-container>
        <slot></slot>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{
    modelValue: boolean;
    title: string;
    description: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const open = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const { smAndDown, width } = useDisplay();
const drawerWidth = computed(() => (smAndDown.value ? width.value || 300 : 400));
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