import { tv } from '@/styles/tailwindVariants.lib'

export const createDatePickerStyle = tv({
  slots: {
    cell: `relative flex-1 p-0 text-center text-xs`,
    cellTrigger: `
      inline-flex h-9 w-full items-center justify-center rounded-full text-xs
      font-normal text-secondary transition-colors duration-100 outline-none
      not-data-disabled:hover:bg-primary-hover
      focus-visible:ring-2 focus-visible:ring-fg-brand-primary
      data-disabled:pointer-events-none data-disabled:text-disabled
      data-disabled:opacity-50
      data-outside-view:pointer-events-none data-outside-view:text-disabled
      data-selected:bg-brand-solid data-selected:text-primary-on-brand
      data-selected:hover:bg-brand-solid-hover
      data-unavailable:pointer-events-none data-unavailable:text-disabled
      data-unavailable:line-through
    `,
    content: `
      z-40 w-72 origin-(--reka-popover-content-transform-origin)
      will-change-[transform,opacity]
    `,
    contentInner: `
      flex flex-col gap-lg overflow-hidden rounded-2xl border border-secondary
      bg-primary p-2xl px-3xl shadow-lg
    `,
    grid: `w-full border-collapse select-none`,
    gridRow: `flex`,
    headCell: `flex-1 py-xs text-center text-xs font-medium text-tertiary`,
    header: `flex w-full items-center justify-between`,
    heading: `text-sm font-semibold text-primary`,
    headingTrigger: `
      cursor-pointer rounded-sm px-xxs text-sm font-semibold text-primary
      transition-colors outline-none
      hover:bg-primary-hover
      focus-visible:ring-2 focus-visible:ring-fg-brand-primary
    `,
    inputField: `
      flex h-7 flex-1 items-center gap-xxs rounded-sm border border-secondary
      bg-primary px-sm text-xs text-primary
      [&:has(:focus)]:border-fg-brand-primary [&:has(:focus)]:outline
      [&:has(:focus)]:outline-fg-brand-primary
    `,
    inputLiteral: `text-placeholder select-none`,
    inputRow: `flex items-center gap-xs`,
    inputSegment: `
      rounded-sm px-xxs text-xs text-primary tabular-nums caret-transparent
      outline-none
      focus:bg-brand-solid focus:text-primary-on-brand
      data-placeholder:text-placeholder
      data-placeholder:focus:text-primary-on-brand
    `,
    pickerCell: `relative flex-1 p-0 text-center text-xs`,
    pickerCellTrigger: `
      inline-flex h-9 w-full items-center justify-center rounded-lg text-xs
      font-normal text-secondary transition-colors duration-100 outline-none
      hover:bg-primary-hover
      focus-visible:ring-2 focus-visible:ring-fg-brand-primary
      data-disabled:pointer-events-none data-disabled:text-disabled
      data-disabled:opacity-50
      data-selected:bg-brand-solid data-selected:text-primary-on-brand
      data-selected:hover:bg-brand-solid-hover
      data-unavailable:pointer-events-none data-unavailable:text-disabled
      data-unavailable:line-through
    `,
    pickerGrid: `w-full border-collapse select-none`,
    pickerGridBody: `flex flex-col gap-xs`,
    pickerGridRow: `flex gap-xs`,
    pickerPopover: `
      z-50 w-72 origin-(--reka-popover-content-transform-origin) rounded-2xl
      border border-secondary bg-primary p-xl shadow-lg
      will-change-[transform,opacity]
    `,
    todayIndicator: `
      absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-lg
      bg-brand-solid
      group-data-selected/cell:bg-white
    `,
    trigger: `
      flex size-full min-w-0 cursor-pointer items-center bg-transparent text-xs
      text-primary outline-none
      disabled:cursor-not-allowed disabled:text-disabled
      data-placeholder:text-placeholder
    `,
  },
  variants: {
    size: {
      md: {
        trigger: 'gap-sm px-md',
      },
      sm: {
        trigger: 'gap-xxs px-sm',
      },
    },
  },
})

export type DatePickerStyle = ReturnType<typeof createDatePickerStyle>
