<template>
    <header class="pa-4 pt-8 pb-16 pb-lg-36 gradient-header">
        <div class="header-content">
            <div class="header-content-inner d-flex align-center justify-space-between mb-14">
                <div class="d-flex align-center header-logo-wrap">
                    <HeaderLogo />
                    <Navigation />
                </div>
                <ClerkLoading>
                    <Loader2 class="animate-spin size-8 text-slate-400" />
                </ClerkLoading>
                <ClerkLoaded>
                    <UserButton />
                </ClerkLoaded>
            </div>
            <WelcomeMessage />
        </div>
    </header>
</template>


<script setup>
import { UserButton } from '@clerk/vue';
import HeaderLogo from '../components/HeaderLogo.vue';
import Navigation from './NavigationView.vue';
import WelcomeMessage from './WelcomeMessage.vue';
</script>

<style scoped>
.gradient-header {
    background-image: linear-gradient(to bottom, #1D4ED8, #3B82F6);
}

/* Custom container width (matches Tailwind's max-w-screen-2xl) */
.header-content {
    max-width: 1536px;
    margin-left: auto;
    margin-right: auto;
}

/* Equivalent of w-full d-flex justify-between mb-14 */
.header-content-inner {
    width: 100%;
}

/* Emulates lg:gap-x-16 */
@media (min-width: 1024px) {
    .header-logo-wrap {
        column-gap: 4rem;
        /* 64px */
    }

    .gradient-header {
        padding-left: 3.5rem !important;
        padding-right: 3.5rem !important;
        padding-bottom: 9rem !important;
    }
}
</style>
