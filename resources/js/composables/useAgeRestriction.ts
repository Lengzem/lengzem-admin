import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';

export function useAgeRestriction() {
  const toast = useToast();
  const ageRestriction = ref(false); // Default to restricted (kids mode)

  // Initialize from localStorage
  const storedRestriction = localStorage.getItem('age_restriction');
  if (storedRestriction) {
    ageRestriction.value = JSON.parse(storedRestriction);
  }

  // Check if user is allowed to view adult content
  const isAdultAllowed = computed(() => !ageRestriction.value);

  // Set age restriction mode
  function setAgeRestriction(isKidMode) {
    ageRestriction.value = isKidMode;
    localStorage.setItem('age_restriction', JSON.stringify(isKidMode));
    toast.success(`Switched to ${isKidMode ? 'Kids' : 'Adult'} Mode`);
  }

  // Verify age for adult content
  function verifyAdultAccess() {
    if (ageRestriction.value) {
      toast.warning('You must be 18+ to view this content');
      return false;
    }
    return true;
  }

  return {
    ageRestriction,
    isAdultAllowed,
    setAgeRestriction,
    verifyAdultAccess
  };
}