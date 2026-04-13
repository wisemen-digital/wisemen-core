import type { PersonName } from '@/models'

export class PersonNameFormatUtil {
  /**
   * Combine first and last name with null-safety.
   * E.g., toFullPersonName("John", "Doe") → "John Doe", toFullPersonName("John", null) → "John".
   */
  static toFullPersonName(PersonName: PersonName): string {
    return [
      PersonName.firstName,
      PersonName.lastName,
    ]
      .filter((part): part is string => part != null && part.trim().length > 0)
      .join(' ')
  }

  /**
   * Extract initials from first and last name.
   * E.g., toInitials("John", "Doe") → "JD", toInitials("Alice", null) → "A".
   */
  static toInitials(PersonName: PersonName): string {
    return [
      PersonName.firstName,
      PersonName.lastName,
    ]
      .filter((part): part is string => part != null && part.trim().length > 0)
      .map((part) => part[0].toUpperCase())
      .join('')
  }
}
