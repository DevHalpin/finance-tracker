<template>
    <div class="main-container">
        <div class="content-container">
            <div class="header">
                <h1>Welcome Back!</h1>
                <p>Log in or create an account to get back to your dashboard.</p>
            </div>
            <div class="sign-up-container">
                <button @click="signup" class="signup-button">Sign Up</button>
            </div>
        </div>
        <div class="image-container">

        </div>
    </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';

const { loginWithRedirect } = useAuth0();

const signup = () => {
  loginWithRedirect({
    authorizationParams: {
      screen_hint: 'signup',
    }
  });
};
</script>

<style scoped>
.main-container {
    min-height: 100vh;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
}

.content-container {
    height: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
}

.header {
    text-align: center;
    padding-top: 4rem;
}

.header>*+* {
    margin-top: 1rem;
}

.image-container {
    display: none;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding-block: 1rem;
    background-color: #2563EB;
}

.header h1 {
    font-weight: 700;
    font-size: 1.875rem;
    line-height: 2.25rem;
    color: #2E2A47;
}

.header p {
    font-size: 1rem;
    line-height: 1.5rem;
    color: #7E8CA0;
}

.sign-up-container {
    display: flex;
    margin-top: 4rem;
    justify-content: center;
    align-items: center;
}

.signup-button {
    background-color: #2563EB;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
}

@media (min-width: 1024px) {
    .main-container {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .content-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .image-container {
        display: flex;
    }
}
</style>
