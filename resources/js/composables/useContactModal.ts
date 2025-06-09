import { ref } from 'vue';

const showContactModal = ref(false);

export function useContactModal() {
    function openContact() {
        showContactModal.value = true;
    }

    function closeContact() {
        showContactModal.value = false;
    }

    return {
        showContactModal,
        openContact,
        closeContact,
    };
}