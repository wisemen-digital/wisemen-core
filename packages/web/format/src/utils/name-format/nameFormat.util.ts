import type { PersonName } from '@/models'

export class PersonNameFormatUtil {
  /**
   * Combine first and last name with null-safety.
   * E.g., toFullName("John", "Doe") → "John Doe", toFullName("John", null) → "John".
   */
  static toFullName(personName: PersonName): string {
    return [
      personName.firstName,
      personName.lastName,
    ]
      .filter((part): part is string => part != null && part.trim().length > 0)
      .join(' ')
  }

  /**
   * Extract initials from first and last name.
   * E.g., toInitials("John", "Doe") → "JD", toInitials("Alice", null) → "A".
   */
  static toInitials(personName: PersonName): string {
    return [
      personName.firstName,
      personName.lastName,
    ]
      .filter((part): part is string => part != null && part.trim().length > 0)
      .map((part) => part[0].toUpperCase())
      .join('')
  }
}
