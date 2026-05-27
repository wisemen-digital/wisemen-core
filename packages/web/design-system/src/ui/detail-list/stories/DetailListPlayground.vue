<script setup lang="ts">
import {
  Building01Icon,
  CircleIcon,
  FramerIcon,
  InfoSquareIcon,
  Lock01Icon,
  MarkerPin06Icon,
  SunIcon,
  Users02Icon,
} from '@wisemen/vue-core-icons'

import { UIBadgeGroup } from '@/ui/badge'
import {
  UIDetailList,
  UIDetailListGroup,
  UIDetailListGroupItem,
  UIDetailListGroupItemLabel,
  UIDetailListGroupItemValueBadge,
  UIDetailListGroupItemValueText,
  UIDetailListGroupSeparator,
} from '@/ui/detail-list'
</script>

<template>
  <UIDetailList class="max-w-84">
    <UIDetailListGroup label="User">
      <UIDetailListGroupItem>
        <UIDetailListGroupItemLabel label="Name" />
        <UIDetailListGroupItemValueText
          :avatar="{
            name: 'Marcus Hale',
          }"
          text="Marcus Hale"
        />
      </UIDetailListGroupItem>

      <UIDetailListGroupItem>
        <UIDetailListGroupItemLabel label="Role" />
        <UIDetailListGroupItemValueText
          :icon="Lock01Icon"
          text="Admin"
        />
      </UIDetailListGroupItem>

      <UIDetailListGroupItem>
        <UIDetailListGroupItemLabel label="Hobbies" />
        <UIBadgeGroup>
          <UIDetailListGroupItemValueBadge
            :icon="SunIcon"
            label="Hobby horsing"
            color="brand"
          />
          <UIDetailListGroupItemValueBadge
            :icon="CircleIcon"
            label="Football"
            color="brand"
          />
          <UIDetailListGroupItemValueBadge
            :icon="FramerIcon"
            label="Farm animals"
            color="brand"
          />
        </UIBadgeGroup>
      </UIDetailListGroupItem>

      <UIDetailListGroupItem orientation="vertical">
        <UIDetailListGroupItemLabel label="Bio" />
        <UIDetailListGroupItemValueText
          text="Marcus Hale spent twelve years as a maritime lawyer in Oslo before deciding, at 38, that he'd rather grow olives."
        />
      </UIDetailListGroupItem>
    </UIDetailListGroup>

    <UIDetailListGroupSeparator />

    <UIDetailListGroup
      :collapse-options="{
        badge: {
          label: 'Wisemen',
          icon: Building01Icon,
        },
        isCollapsible: true,
        isOpenByDefault: true,
      }"
      label="Company"
    >
      <UIDetailListGroupItem>
        <UIDetailListGroupItemLabel
          :icon="Building01Icon"
          label="Name"
        />
        <UIDetailListGroupItemValueText text="Wisemen" />
      </UIDetailListGroupItem>

      <UIDetailListGroupItem>
        <UIDetailListGroupItemLabel
          :icon="MarkerPin06Icon"
          label="Address"
        />
        <UIDetailListGroupItemValueText text="Watertorenstraat 2, 3590 Diepenbeek, Belgium" />
      </UIDetailListGroupItem>

      <UIDetailListGroupItem>
        <UIDetailListGroupItemLabel
          :icon="Users02Icon"
          label="Employees"
        />
        <UIDetailListGroupItemValueText text="120" />
      </UIDetailListGroupItem>
    </UIDetailListGroup>

    <UIDetailListGroupSeparator />

    <UIDetailListGroup>
      <UIDetailListGroupItem>
        <UIDetailListGroupItemValueText
          :icon="InfoSquareIcon"
          variant="error"
          text="This company has been deactivated."
        />
      </UIDetailListGroupItem>
    </UIDetailListGroup>
  </UIDetailList>
</template>
