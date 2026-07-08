<script setup lang="ts">
import Preview from '@/ui/table/stories/TablePlayground.vue'
import SortingPreview from '@/ui/table/stories/TableSortingPlayground.vue'
</script>

# Table

Data table with sorting, virtual scrolling, grouping, row links, and per-row actions.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-table--default)

## Sorting

Pass a `Sort` instance created with `useSort` to enable column sorting. Any column whose `key` matches one of the keys passed to `useSort` becomes clickable. Clicking the header cycles through `asc → desc → unsorted`. You are responsible for reacting to `sort.values` and reordering your data accordingly.

```ts
const sort = useSort({
  keys: ['name', 'email', 'role'],
})

const data = computed(() => {
  const [activeSort] = sort.values.value
  if (!activeSort) return rawData
  return [...rawData].sort((a, b) => {
    const cmp = String(a[activeSort.key]).localeCompare(String(b[activeSort.key]))
    return activeSort.direction === 'asc' ? cmp : -cmp
  })
})
```

```vue-html
<UITable :sort="sort" :data="data" ... />
```

<ClientOnly>
  <DesignSystemPreview>
    <SortingPreview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-table--sorting)

## API

<!-- @include: ./table-meta.md -->
