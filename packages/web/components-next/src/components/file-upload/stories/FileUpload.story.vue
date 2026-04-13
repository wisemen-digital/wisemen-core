<!-- <script setup lang="ts">
import { ref } from 'vue'

import type { FileInfo } from '@/components/file-upload/fileUpload.type'
import FileUploadItem from '@/components/file-upload/parts/FileUploadItem.vue'
import FileUploadItemRemove from '@/components/file-upload/parts/FileUploadItemRemove.vue'
import FileUploadItemReplace from '@/components/file-upload/parts/FileUploadItemReplace.vue'
import FileUploadRoot from '@/components/file-upload/parts/FileUploadRoot.vue'
import FileUploadTrigger from '@/components/file-upload/parts/FileUploadTrigger.vue'

const value = ref<FileInfo[]>([])

function fakeGetFileInfo(name: string, mimeType: string): Promise<FileInfo> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        uuid: `${Math.random()}`,
        name,
        blurHash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
        mimeType,
        order: 0,
        url: '',
      })
    }, 200)
  })
}
</script>

<template>
  <Story title="File upload">
    <FileUploadRoot
      v-slot="{ items }"
      v-model="value"
      :accept="['image/*']"
      :get-file-info="fakeGetFileInfo"
    >
      <div>
        <FileUploadItem
          v-for="item of items"
          :key="item.key"
          :item="item"
        >
          <div class="flex">
            <img
              :src="item.url"
              class="size-8"
              alt=""
            >

            <div class="max-w-40 truncate">
              {{ item.name }}
            </div>

            - {{ item.status }}

            <FileUploadItemRemove>
              <button>remove</button>
            </FileUploadItemRemove>

            <FileUploadItemReplace>
              replace
            </FileUploadItemReplace>
          </div>
        </FileUploadItem>
      </div>

      <div>
        <FileUploadTrigger>
          <button>hier</button>
        </FileUploadTrigger>
      </div>
    </FileUploadRoot>
  </Story>
</template> -->

<template>
  <div>
    broken
  </div>
</template>
