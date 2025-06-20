import { ref } from 'vue'

export const useConfirm = (defaultTitle: string, defaultMessage: string) => {
  const isOpen = ref(false)
  const title = ref(defaultTitle)
  const message = ref(defaultMessage)
  const resolver = ref<(confirmed: boolean) => void>()

  const confirm = (overrideTitle?: string, overrideMessage?: string) => {
    title.value = overrideTitle ?? defaultTitle
    message.value = overrideMessage ?? defaultMessage
    isOpen.value = true
    return new Promise<boolean>((resolve) => {
      resolver.value = resolve
    })
  }

  const handleConfirm = () => {
    resolver.value?.(true)
    isOpen.value = false
  }

  const handleCancel = () => {
    resolver.value?.(false)
    isOpen.value = false
  }

  return {
    isOpen,
    title,
    message,
    confirm,
    handleConfirm,
    handleCancel,
  }
}
