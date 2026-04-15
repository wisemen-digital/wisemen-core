import { ref } from 'vue'

export function useSelectDropdown() {
  const isDropdownVisible = ref<boolean>(false)

  function openDropdown(): void {
    isDropdownVisible.value = true
  }

  function closeDropdown(): void {
    isDropdownVisible.value = false
  }

  function onTriggerKeyDown(event: KeyboardEvent): void {
    const isArrowUpOrDown = event.key === 'ArrowUp' || event.key === 'ArrowDown'

    if (isArrowUpOrDown && !isDropdownVisible.value) {
      openDropdown()
    }

    const isRegularCharacter = event.key.length === 1 && event.key !== ' '

    if (isRegularCharacter && !isDropdownVisible.value) {
      openDropdown()
    }
  }

  return {
    isDropdownVisible,
    closeDropdown,
    openDropdown,
    onTriggerKeyDown,
  }
}
