import { ref } from 'vue'

export function useConfirm() {
    const isOpen = ref(false)
    const message = ref('')
    let confirmCallback: (() => void) | null = null

    function open(confirmMessage: string, onConfirm: () => void) {
        message.value = confirmMessage
        confirmCallback = onConfirm
        isOpen.value = true
    }

    function confirm() {
        if (confirmCallback) {
            confirmCallback()
        }
        close()
    }
    
    
    function close() {
        isOpen.value = false
        message.value = ''
        confirmCallback = null
    }

    return {
        isOpen,
        message,
        open,
        confirm,
        close
    }
}