<script setup lang="ts">
import { useAuthStore, usePOST } from '@org/api-client'
import { AUTH_AUTHORIZATION_ROUTES } from '@org/routes-config'
import { AuthSharedOutput, RegisterSharedInput } from '@org/shared-types'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const store = useAuthStore()
const router = useRouter()

const { method, loading, error, data } = usePOST<AuthSharedOutput, RegisterSharedInput>({
  path: `${AUTH_AUTHORIZATION_ROUTES.BASE_URL}/${AUTH_AUTHORIZATION_ROUTES.REGISTER}`,
})

const form = reactive<RegisterSharedInput>({
  email: '',
  password: '',
  passwordConfirmation: '',
})

const register = async () => {
  await method(form)
  if (!data.value?.accessToken) {
    return
  }
  store.setAccessToken(data.value.accessToken)
  router.push('/')
}
</script>

<template>
  {{ error }}
  {{ data }}
  {{ loading }}
  <form @submit.prevent="register">
    <label>Email</label>
    <input v-model="form.email">
    <label>Password</label>
    <input v-model="form.password">
    <label>Password Confirmation</label>
    <input v-model="form.passwordConfirmation">
    <button>Register</button>
  </form>
</template>

<style scoped></style>
