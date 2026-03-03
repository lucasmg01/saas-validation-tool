export default defineNuxtPlugin(() => {
  const validationStore = useValidationStore()
  validationStore.hydrate()

  watch(
    () => validationStore.$state,
    () => {
      validationStore.persist()
    },
    { deep: true }
  )
})
