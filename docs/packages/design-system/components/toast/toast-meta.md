<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "description": "",
    "name": "toast",
    "required": true,
    "type": "Toast"
  }
]

const eventsData = [
  {
    "description": "",
    "name": "closeToast",
    "type": "[]"
  }
]

export default {
  setup() {
    return {
      propsData,
      eventsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<EmitsTable :data="eventsData" />