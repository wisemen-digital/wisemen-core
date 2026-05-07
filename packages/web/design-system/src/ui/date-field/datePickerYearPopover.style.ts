import { tv } from '@/styles/tailwindVariants.lib'

export const datePickerYearPopoverStyle = tv({
  slots: {
    header: `flex w-full items-center justify-between`,
    heading: `text-sm font-semibold text-primary`,
    headingTrigger: `
      cursor-pointer rounded-sm px-xxs text-sm font-semibold text-primary
      transition-colors outline-none
      hover:bg-secondary-hover
      focus-visible:ring-2 focus-visible:ring-fg-brand-primary
    `,
    pickerCell: `relative flex-1 p-0 text-center text-xs`,
    pickerCellTrigger: `
      inline-flex h-9 w-full items-center justify-center rounded-lg text-xs
      font-normal text-secondary transition-colors duration-100 outline-none
      hover:bg-secondary-hover
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
  },
})()
