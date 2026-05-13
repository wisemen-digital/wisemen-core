import type {
  Action,
  ActionGroup,
} from '@wisemen/vue-core-actions'
import { _createUntypedAction } from '@wisemen/vue-core-actions'
import type { PlainDateRange } from '@wisemen/vue-core-dates'
import { useOverlay } from '@wisemen/vue-core-design-system'
import {
  FilterLinesIcon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'
import SuperJSON from 'superjson'
import type {
  Component,
  ComputedRef,
  Ref,
} from 'vue'
import {
  computed,
  ref,
  useId,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import FiltersDialogDateRangeFilter from '@/components/FiltersDialogDateRangeFilter.vue'
import FiltersDialogNumberFilter from '@/components/FiltersDialogNumberFilter.vue'

export type SelectFilterValue = number | string | Record<string, any>

interface BaseFilter<TKey extends string> {
  isStatic?: boolean
  icon?: Component
  key: TKey
  label: string
}

export enum FilterType {
  BOOLEAN = 'boolean',
  DATE_RANGE = 'date-range',
  MULTI_AUTOCOMPLETE = 'multi-autocomplete',
  MULTI_SELECT = 'multi-select',
  NUMBER = 'number',
}

interface BaseSelectFilter<TValue extends SelectFilterValue> {
  displayFn: (value: TValue) => string
  options: (searchInput: string) => TValue[]
}

interface BaseAutocompleteFilter<TValue extends SelectFilterValue> {
  displayFn: (value: TValue) => string
  options: (
    searchInput: string,
    getPaginationOffsetForSubActionId: (subActionId: string) => number | null,
  ) => Promise<TValue[] | {
    items: TValue[]
    pagination: {
      nextOffset: number | null
    }
  }>
}

type FilterKeys<TFilters extends readonly Filter[]> = TFilters[number]['key']

export interface MultiSelectFilter<
  TKey extends string = string,
  TValue extends SelectFilterValue = SelectFilterValue,
> extends BaseFilter<TKey>, BaseSelectFilter<TValue> {
  defaultValue?: TValue[]
  type: FilterType.MULTI_SELECT
}

export interface MultiAutocompleteFilter<
  TKey extends string = string,
  TValue extends SelectFilterValue = SelectFilterValue,
> extends BaseFilter<TKey>, BaseAutocompleteFilter<TValue> {
  defaultValue?: TValue[]
  type: FilterType.MULTI_AUTOCOMPLETE
}

export interface BooleanFilter<TKey extends string = string> extends BaseFilter<TKey> {
  badgeLabel?: string
  canBeToggled: boolean
  defaultValue?: boolean | null
  /**
   * Used to show e.g. "User is disabled" or "Project is active"
   */
  entityLabel: string
  falseLabel: string
  trueLabel: string
  type: FilterType.BOOLEAN
}

export interface NumberFilter<TKey extends string = string> extends BaseFilter<TKey> {
  /**
   * Unit to be used when not supported by Intl.NumberFormat
   */
  customUnit?: string
  defaultValue?: number | null
  formatOptions?: Intl.NumberFormatOptions
  max?: number
  min?: number
  placeholder?: string
  step?: number
  type: FilterType.NUMBER
}

export interface DateRangeFilter<TKey extends string = string> extends BaseFilter<TKey> {
  defaultValue?: PlainDateRange
  type: FilterType.DATE_RANGE
}

export function createMultiSelectFilter<
  const TKey extends string,
  const TValue extends SelectFilterValue,
>(
  options: Omit<MultiSelectFilter<TKey, TValue>, 'type'>,
): MultiSelectFilter<TKey, TValue> {
  return {
    ...options,
    type: FilterType.MULTI_SELECT,
  }
}

export function createMultiAutocompleteFilter<
  const TKey extends string,
  const TValue extends SelectFilterValue,
>(
  options: Omit<MultiAutocompleteFilter<TKey, TValue>, 'type'>,
): MultiAutocompleteFilter<TKey, TValue> {
  return {
    ...options,
    type: FilterType.MULTI_AUTOCOMPLETE,
  }
}

export function createBooleanFilter<const TKey extends string>(
  options: Omit<BooleanFilter<TKey>, 'type'>,
): BooleanFilter<TKey> {
  return {
    ...options,
    type: FilterType.BOOLEAN,
  }
}

export function createNumberFilter<const TKey extends string>(
  options: Omit<NumberFilter<TKey>, 'type'>,
): NumberFilter<TKey> {
  return {
    ...options,
    type: FilterType.NUMBER,
  }
}

export function createDateRangeFilter<const TKey extends string>(
  options: Omit<DateRangeFilter<TKey>, 'type'>,
): DateRangeFilter<TKey> {
  return {
    ...options,
    type: FilterType.DATE_RANGE,
  }
}

export type Filter
  = | BooleanFilter
    | DateRangeFilter<string>
    | MultiAutocompleteFilter<string, any>
    | MultiSelectFilter<string, any>
    | NumberFilter<string>

export type FilterWithAction<TFilter> = TFilter & {
  action: Action
}

export type FilterValues<TF extends readonly Filter[]> = {
  [F in TF[number] as F['key']]:
  F extends { defaultValue?: infer V }
    ? Exclude<V, undefined>
    : never
}

interface Options<TFilters extends Filter[]> {
  actionGroup: ActionGroup
  filters: TFilters
}

interface UseFiltersReturn<TFilters extends Filter[]> {
  action: Action
  actionGroup: ActionGroup
  activeFilters: ComputedRef<FilterWithAction<Filter>[]>
  clearAll: () => void
  clearFilter: (key: string, onlyIfEmpty?: boolean, onlyIfNotStatic?: boolean) => void
  clearFiltersAction: Action
  setOpenFilter: (filterKey: string | null) => void
  values: Ref<FilterValues<TFilters>, any>
}

function isItemWithPagination(value: unknown): value is {
  items: any[]
  pagination: {
    nextOffset: number | null
  }
} {
  return value !== null
    && typeof value === 'object'
    && 'items' in value
    && 'pagination' in value
}

export function useFilters<TFilters extends Filter[]>(
  options: Options<TFilters>,
): UseFiltersReturn<TFilters> {
  const i18n = useI18n()
  const overlay = useOverlay()

  const numberFilterDialog = overlay.create(FiltersDialogNumberFilter)
  const dateRangeFilterDialog = overlay.create(FiltersDialogDateRangeFilter)

  const id = useId()

  const values = ref<FilterValues<TFilters>>(getDefaultValues())
  const openFilterKey = ref<FilterKeys<TFilters> | null>(null)

  // Tracks the keys of currently active filters. Used to determine the order of the active filters.
  const activeFiltersKeys = ref<Set<FilterKeys<TFilters>>>(
    new Set(),
  ) as Ref<Set<FilterKeys<TFilters>>>

  const filterActions = options.filters.map((filter) => {
    switch (filter.type) {
      case FilterType.MULTI_SELECT:
      case FilterType.MULTI_AUTOCOMPLETE:
        return {
          action: _createUntypedAction({
            id: filter.key,
            name: filter.label,
            group: options.actionGroup,
            icon: () => filter.icon ?? null,
            multiSelectSubActions: true,
            parentScoreInfluence: 'none',
            searchSubActionsConfig: {
              minLength: 1,
              placeholder: i18n.t('component.filters_listbox.filter_placeholder'),
            },
            subActions: async (ctx) => {
              const maybeOptions = await filter.options(ctx.searchInput, ctx.getPaginationOffsetForSubActionId)

              const options = (isItemWithPagination(maybeOptions)
                ? maybeOptions.items
                : maybeOptions) as any[]

              const selectedValues = values.value[filter.key] as SelectFilterValue[]
              const isFirstPage = ctx.getPaginationOffsetForSubActionId(filter.key) === null
              const uniqueOptions = isFirstPage
                ? [
                    ...selectedValues,
                    ...options.filter(
                      (option) => !selectedValues.some((v) => SuperJSON.stringify(v) === SuperJSON.stringify(option)),
                    ),
                  ]
                : options.filter(
                    (option) => !selectedValues.some((v) => SuperJSON.stringify(v) === SuperJSON.stringify(option)),
                  )

              const actions = uniqueOptions.map((option: SelectFilterValue) => _createUntypedAction({
                id: SuperJSON.stringify(option),
                name: filter.displayFn(option),
                execute: () => {
                  const filterValues = values.value[filter.key] as SelectFilterValue[]

                  const isOptionSelected = filterValues.some(
                    (selectedOption) => SuperJSON.stringify(selectedOption) === SuperJSON.stringify(option),
                  )

                  if (isOptionSelected) {
                    values.value[filter.key] = filterValues.filter(
                      (selectedOption) => SuperJSON.stringify(selectedOption) !== SuperJSON.stringify(option),
                    )
                  }
                  else {
                    values.value[filter.key] = [
                      ...filterValues,
                      option,
                    ]
                  }
                },
                parentScoreInfluence: 'direct',
                selected: () => {
                  const filterValues = values.value[filter.key] as SelectFilterValue[]

                  const isOptionSelected = filterValues.some(
                    (selectedOption) => SuperJSON.stringify(selectedOption) === SuperJSON.stringify(option),
                  )

                  return isOptionSelected
                },
                skipFilterScoring: filter.type === FilterType.MULTI_AUTOCOMPLETE && !selectedValues.some((value) => (
                  SuperJSON.stringify(value) === SuperJSON.stringify(option)
                )),
              }))

              if (isItemWithPagination(maybeOptions)) {
                return {
                  actions,
                  pagination: {
                    nextOffset: maybeOptions.pagination.nextOffset,
                  },
                }
              }

              return actions
            },
          }),
          key: filter.key,
        }
      case FilterType.BOOLEAN:
        return {
          action: _createUntypedAction({
            id: filter.key,
            name: filter.label,
            disabledReason: () => values.value[filter.key] === null ? null : i18n.t('component.filters.boolean_filter_already_active'),
            execute: () => {
              values.value[filter.key] = true
            },
            group: options.actionGroup,
            icon: () => filter.icon ?? null,
            parentScoreInfluence: 'none',
          }),
          key: filter.key,
          searchSubActionsConfig: {
            placeholder: 'Filter...',
          },
        }
      case FilterType.NUMBER:
        return {
          action: _createUntypedAction({
            id: filter.key,
            name: filter.label,
            execute: () => {
              numberFilterDialog.open({
                filter,
                initialValue: values.value[filter.key],
                onSubmit: (value) => {
                  values.value[filter.key] = value
                  numberFilterDialog.close()
                },
              })
            },
            group: options.actionGroup,
            icon: () => filter.icon ?? null,
            parentScoreInfluence: 'none',
          }),
          key: filter.key,
        }
      case FilterType.DATE_RANGE:
        return {
          action: _createUntypedAction({
            id: filter.key,
            name: filter.label,
            execute: () => {
              dateRangeFilterDialog.open({
                filter,
                initialValue: values.value[filter.key],
                onSubmit: (value) => {
                  values.value[filter.key] = value
                  dateRangeFilterDialog.close()
                },
              })
            },
            group: options.actionGroup,
            icon: () => filter.icon ?? null,
            parentScoreInfluence: 'none',
          }),
          key: filter.key,
        }
      default:
        throw new Error('Unsupported filter type')
    }
  })

  const clearFiltersAction = _createUntypedAction({
    id: 'clear-filters',
    isApplicable: (ctx) => {
      if (activeFiltersKeys.value.size === 0) {
        return false
      }

      return ctx.menuType === 'commandMenu'
    },
    name: () => i18n.t('component.filters.clear_filters'),
    execute: () => clearAll(),
    group: options.actionGroup,
    icon: () => Trash01Icon,
    keyboardShortcut: {
      key: 'F',
      shift: true,
    },
  })

  const addFilterAction = _createUntypedAction({
    id,
    name: () => i18n.t('component.filters.add_filters'),
    forceAsRootMenu: true,
    group: options.actionGroup,
    icon: () => FilterLinesIcon,
    nameAsParent: i18n.t('component.filters_dropdown_menu.filter'),
    searchSubActionsConfig: {
      minLength: 99,
      placeholder: i18n.t('component.filters.add_filter_placeholder'),
    },
    subActions: () => [
      ...filterActions.map((filterAction) => filterAction.action),
      _createUntypedAction({
        id: 'clear-filters',
        isApplicable: (ctx) => {
          if (ctx.menuType === 'commandMenu') {
            return false
          }

          if (activeFiltersKeys.value.size === 0 || ctx.metadata.filters?.hideClearAll === true) {
            return false
          }

          return ctx.searchInput.trim().length === 0
        },
        name: () => i18n.t('component.filters.clear_filters'),
        execute: () => clearAll(),
        group: options.actionGroup,
        icon: () => Trash01Icon,
        keyboardShortcut: {
          key: 'F',
          shift: true,
        },
        separatorGroup: 'clear',
      }),
    ],
    subActionsHaveKeyboardShortcuts: true,
  })

  // Filters that are currently active (either have non-default values or are open)
  const activeFilters = computed<FilterWithAction<Filter>[]>(
    () => Array.from(activeFiltersKeys.value).map(getFilterByKey).map((filter) => ({
      ...filter,
      action: getFilterActionByKey(filter.key),
    })),
  )

  // Watches filter values and updates the set of active filter keys accordingly.
  watch(values, () => {
    for (const filter of options.filters) {
      if (isFilterActive(filter.key)) {
        activeFiltersKeys.value.add(filter.key)
      }
      else {
        activeFiltersKeys.value.delete(filter.key)
      }
    }
  }, {
    deep: true,
    immediate: true,
  })

  /**
   * Determines whether a filter is considered "active."
   * A filter is active if its current value differs from its default or if it is currently open.
   * @param key The key of the filter to check.
   */
  function isFilterActive(key: FilterKeys<TFilters>): boolean {
    const isFilterOpen = openFilterKey.value === key

    return isFilterOpen || !isFilterEmpty(key)
  }

  /**
   * Checks if a filter is empty (meaning its value is equal to its fallback value).
   * @param key The key of the filter to check.
   * @returns True if the filter is empty, false otherwise.
   */
  function isFilterEmpty(key: FilterKeys<TFilters>): boolean {
    const value = values.value[key]
    const filter = getFilterByKey(key)

    switch (filter.type) {
      case FilterType.MULTI_SELECT:
      case FilterType.MULTI_AUTOCOMPLETE:
        return value.length === 0
      case FilterType.BOOLEAN:
        return value === null
      case FilterType.NUMBER:
        return value === null
      case FilterType.DATE_RANGE:
        return value.from === null || value.until === null
    }
  }

  function getDefaultValues(): FilterValues<TFilters> {
    return options.filters.reduce((acc, filter) => {
      acc[filter.key as keyof typeof acc] = filter.defaultValue ?? getFallbackValue(filter.key) as any

      return acc
    }, {} as FilterValues<TFilters>)
  }

  /**
   * Returns the fallback value for a filter key.
   * @param key The key of the filter
   * @returns The fallback value for the filter key.
   */
  function getFallbackValue(key: FilterKeys<TFilters>): unknown {
    const filter = getFilterByKey(key)

    switch (filter.type) {
      case FilterType.MULTI_SELECT:
      case FilterType.MULTI_AUTOCOMPLETE:
        return []
      case FilterType.BOOLEAN:
        return null
      case FilterType.NUMBER:
        return null
      case FilterType.DATE_RANGE:
        return {
          from: null,
          until: null,
        }
    }
  }

  /**
   * Returns the filter definition by its key.
   * @param key The key of the filter to retrieve.
   * @returns The filter definition.
   */
  function getFilterByKey(key: FilterKeys<TFilters>): Filter {
    return options.filters.find((filter) => filter.key === key)!
  }

  function getFilterActionByKey(key: FilterKeys<TFilters>): Action {
    return filterActions.find((filter) => filter.key === key)!.action
  }

  function setOpenFilter(filterKey: string | null): void {
    openFilterKey.value = filterKey
  }

  /**
   * Clears the value of the specified filter.
   * Optionally, it only clears the filter if the value is already empty.
   * @param key The key of the filter to clear.
   * @param onlyIfEmpty If true, the filter is only cleared if it is currently empty. False by default.
   */
  function clearFilter(key: string, onlyIfEmpty = false, onlyIfNotStatic = false): void {
    const isEmpty = isFilterEmpty(key)
    const filter = getFilterByKey(key)

    if (onlyIfEmpty && !isEmpty) {
      return
    }

    if (onlyIfNotStatic && filter.isStatic === true) {
      return
    }

    values.value[key] = getFallbackValue(key)
    activeFiltersKeys.value.delete(key)
  }

  function clearAll(): void {
    activeFiltersKeys.value.clear()

    for (const filter of options.filters) {
      values.value[filter.key] = getFallbackValue(filter.key)
    }
  }

  return {
    action: addFilterAction,
    actionGroup: options.actionGroup,
    activeFilters,
    clearAll,
    clearFilter,
    clearFiltersAction,
    setOpenFilter,
    values: values as unknown as Ref<FilterValues<TFilters>, any>,
  }
}

export type Filters = ReturnType<typeof useFilters>
