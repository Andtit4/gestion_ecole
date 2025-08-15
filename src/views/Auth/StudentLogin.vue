// src/views/auth/StudentLogin.vue
<template>
  <div class="flex h-screen bg-gray-100">
    <div class="m-auto w-full max-w-md">
      <div class="bg-white rounded-lg shadow p-8">
        <h2 class="text-2xl font-bold text-center mb-6">Connexion Élève</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
              Adresse email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Votre mot de passe"
            />
          </div>

          <div class="flex items-center justify-between">
            <button
              type="submit"
              :disabled="loading"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <span v-if="loading">Connexion en cours...</span>
              <span v-else>Se connecter</span>
            </button>
            
            <router-link
              to="/forgot-password"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              Mot de passe oublié ?
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
// import { useTenantStore } from '@/stores/tenant';

export default defineComponent({
  name: 'StudentLogin',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();
    const tenantStore = useTenantStore();

    const handleLogin = async () => {
      if (!tenantStore.currentTenant?.id) {
        error.value = 'Aucun établissement sélectionné';
        return;
      }

      try {
        loading.value = true;
        error.value = '';
        
        await authStore.login({
          email: email.value,
          password: password.value,
          tenantId: tenantStore.currentTenant.id,
          role: 'STUDENT'
        });

        // Rediriger vers le tableau de bord élève
        router.push('/student/dashboard');
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Échec de la connexion. Veuillez réessayer.';
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      error,
      loading,
      handleLogin,
    };
  },
});
</script>