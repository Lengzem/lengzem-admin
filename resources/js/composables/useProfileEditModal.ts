import { ref } from 'vue';

const showProfileModal = ref(false);

export function useProfileEditModal() {
    function openEditPro() {
        showProfileModal.value = true;
    }

    function closeEditPro() {
        showProfileModal.value = false;
    }

    return {
        showProfileModal,
        openEditPro,
        closeEditPro,
    };
}