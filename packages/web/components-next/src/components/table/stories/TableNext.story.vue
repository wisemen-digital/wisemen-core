<script setup lang="ts">
import TableBody from '@/components/table/parts/TableBody.vue'
import TableBodyRowCell from '@/components/table/parts/TableCell.vue'
import TableContent from '@/components/table/parts/TableContent.vue'
import TableHeader from '@/components/table/parts/TableHeader.vue'
import TableHeaderCell from '@/components/table/parts/TableHeaderCell.vue'
import TableRoot from '@/components/table/parts/TableRoot.vue'
import TableBodyRow from '@/components/table/parts/TableRow.vue'
</script>

<template>
  <Story title="Table Next">
    <TableRoot
      :is-first-column-sticky="true"
      :is-last-column-sticky="true"
      grid-template-columns="grid-cols-[140px_200px_200px_200px_200px_auto]"
      class="mx-auto max-h-140 w-full max-w-4xl"
    >
      <TableContent>
        <TableHeader>
          <TableHeaderCell
            :is-sortable="true"
            sort-direction="asc"
          >
            Label 1
          </TableHeaderCell>
          <TableHeaderCell>Label 2</TableHeaderCell>
          <TableHeaderCell>Label 3</TableHeaderCell>
          <TableHeaderCell>Label 4</TableHeaderCell>
          <TableHeaderCell>Label 5</TableHeaderCell>
          <TableHeaderCell>Label 6</TableHeaderCell>
        </TableHeader>

        <TableBody>
          <TableBodyRow
            v-for="i in 20"
            :key="i"
          >
            <TableBodyRowCell>Content {{ i }}</TableBodyRowCell>
            <TableBodyRowCell>Content {{ i + 1 }}</TableBodyRowCell>
            <TableBodyRowCell>Content {{ i + 2 }}</TableBodyRowCell>
            <TableBodyRowCell>Content {{ i + 3 }}</TableBodyRowCell>
            <TableBodyRowCell>Content {{ i + 4 }}</TableBodyRowCell>
            <TableBodyRowCell>Content {{ i + 5 }}</TableBodyRowCell>
          </TableBodyRow>
        </TableBody>
      </TableContent>
    </TableRoot>
  </Story>
</template>
