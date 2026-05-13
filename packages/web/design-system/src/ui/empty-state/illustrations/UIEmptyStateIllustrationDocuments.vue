<script setup lang="ts">
import { useId } from 'vue'

const id = useId()
const filter0Id = `${id}-f0`
const filter1Id = `${id}-f1`
const filter2Id = `${id}-f2`
const paint0Id = `${id}-p0`
const paint1Id = `${id}-p1`
const paint2Id = `${id}-p2`
const clipId = `${id}-c`
</script>

<template>
  <svg
    width="161"
    height="120"
    viewBox="0 0 161 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="81.9647"
      cy="52"
      r="52"
      fill="#EEF2F6"
    />
    <g :filter="`url(#${filter0Id})`">
      <path
        :fill="`url(#${paint0Id})`"
        d="M47.6914 79.1102L80.9299 63.6108C82.5987 62.8326 83.3207 60.8489 82.5425 59.1801L62.9132 17.0849L49.6211 12.2469L22.4259 24.9282C20.7571 25.7064 20.0351 27.6901 20.8133 29.359L43.2607 77.4975C44.0389 79.1663 46.0225 79.8883 47.6914 79.1102Z"
      />
      <path
        d="M82.7692 59.0745C83.6056 60.8685 82.8295 63.0009 81.0357 63.8374L47.797 79.3368C46.0031 80.1733 43.8707 79.3971 43.0342 77.6033L20.5867 29.4646L20.5131 29.2952C19.7999 27.5384 20.5824 25.5121 22.3202 24.7017L49.6095 11.9765L63.096 16.8852L82.7692 59.0745Z"
        stroke="black"
        stroke-opacity="0.08"
        stroke-width="0.5"
      />
      <path
        d="M49.6216 12.2471L62.9137 17.085L53.8487 21.3121L49.6216 12.2471Z"
        fill="#E3E8EF"
      />
    </g>
    <g :filter="`url(#${filter1Id})`">
      <path
        :fill="`url(#${paint1Id})`"
        d="M63.5809 67.7831H100.256C102.097 67.7831 103.59 66.2904 103.59 64.4491V18.0022L93.5874 8H63.5809C61.7395 8 60.2468 9.49271 60.2468 11.3341V64.4491C60.2468 66.2904 61.7395 67.7831 63.5809 67.7831Z"
      />
      <path
        d="M103.84 64.4492C103.839 66.4285 102.235 68.0332 100.256 68.0332H63.5808C61.6015 68.0332 59.9969 66.4285 59.9968 64.4492V11.334L60.0017 11.1494C60.0978 9.25583 61.6633 7.75004 63.5808 7.75H93.6911L103.84 17.8984V64.4492Z"
        stroke="black"
        stroke-opacity="0.08"
        stroke-width="0.5"
      />
      <path
        d="M93.5873 8L103.589 18.0022H93.5873V8Z"
        fill="#E3E8EF"
      />
    </g>
    <g :filter="`url(#${filter2Id})`">
      <path
        :fill="`url(#${paint2Id})`"
        d="M82.4392 63.5909L115.678 79.0903C117.347 79.8685 119.33 79.1465 120.108 77.4777L139.738 35.3825L134.9 22.0903L107.705 9.40903C106.036 8.63085 104.052 9.35286 103.274 11.0217L80.8266 59.1602C80.0484 60.8291 80.7704 62.8128 82.4392 63.5909Z"
      />
      <path
        d="M120.335 77.5835C119.498 79.3773 117.366 80.1535 115.572 79.317L82.3335 63.8176C80.5396 62.981 79.7635 60.8486 80.6 59.0547L103.047 10.916L103.13 10.7507C104.017 9.0752 106.072 8.37211 107.81 9.18243L135.1 21.9076L140.008 35.3941L120.335 77.5835Z"
        stroke="black"
        stroke-opacity="0.08"
        stroke-width="0.5"
      />
      <path
        d="M134.9 22.0903L139.738 35.3825L130.673 31.1554L134.9 22.0903Z"
        fill="#E3E8EF"
      />
    </g>
    <circle
      cx="26.9647"
      cy="11"
      r="5"
      fill="#EEF2F6"
    />
    <circle
      cx="23.9647"
      cy="109"
      r="7"
      fill="#EEF2F6"
    />
    <circle
      cx="150.965"
      cy="35"
      r="7"
      fill="#EEF2F6"
    />
    <circle
      cx="139.965"
      cy="8"
      r="4"
      fill="#EEF2F6"
    />
    <foreignObject
      x="53.9647"
      y="62"
      width="56"
      height="56"
    >
      <div
        :style="`backdrop-filter:blur(4px);clip-path:url(#${clipId});height:100%;width:100%`"
        xmlns="http://www.w3.org/1999/xhtml"
      />
    </foreignObject>
    <g>
      <path
        d="M61.9647 90C61.9647 78.9543 70.919 70 81.9647 70C93.0104 70 101.965 78.9543 101.965 90C101.965 101.046 93.0104 110 81.9647 110C70.919 110 61.9647 101.046 61.9647 90Z"
        fill="black"
        fill-opacity="0.2"
      />
      <path
        d="M78.6314 93.3333L81.9647 90M81.9647 90L85.298 93.3333M81.9647 90V97.5M88.6314 93.9524C89.6493 93.1117 90.298 91.8399 90.298 90.4167C90.298 87.8854 88.246 85.8333 85.7147 85.8333C85.5326 85.8333 85.3623 85.7383 85.2698 85.5814C84.1831 83.7374 82.1767 82.5 79.8814 82.5C76.4296 82.5 73.6314 85.2982 73.6314 88.75C73.6314 90.4718 74.3276 92.0309 75.4538 93.1613"
        stroke="white"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <filter
        :id="filter0Id"
        x="-0.595741"
        y="8.0199"
        width="104.547"
        height="112.499"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood
          flood-opacity="0"
          result="BackgroundImageFix"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="1.5"
          operator="erode"
          in="SourceAlpha"
          result="effect1_dropShadow"
        />
        <feOffset dy="3" />
        <feGaussianBlur stdDeviation="1.5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.211765 0 0 0 0 0.254902 0 0 0 0 0.321569 0 0 0 0.04 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="4"
          operator="erode"
          in="SourceAlpha"
          result="effect2_dropShadow"
        />
        <feOffset dy="8" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.211765 0 0 0 0 0.254902 0 0 0 0 0.321569 0 0 0 0.03 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow"
          result="effect2_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="4"
          operator="erode"
          in="SourceAlpha"
          result="effect3_dropShadow"
        />
        <feOffset dy="20" />
        <feGaussianBlur stdDeviation="12" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.211765 0 0 0 0 0.254902 0 0 0 0 0.321569 0 0 0 0.08 0"
        />
        <feBlend
          mode="normal"
          in2="effect2_dropShadow"
          result="effect3_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect3_dropShadow"
          result="shape"
        />
      </filter>
      <filter
        :id="filter1Id"
        x="39.7468"
        y="7.5"
        width="84.3428"
        height="100.783"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood
          flood-opacity="0"
          result="BackgroundImageFix"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="1.5"
          operator="erode"
          in="SourceAlpha"
          result="effect1_dropShadow"
        />
        <feOffset dy="3" />
        <feGaussianBlur stdDeviation="1.5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.211765 0 0 0 0 0.254902 0 0 0 0 0.321569 0 0 0 0.04 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="4"
          operator="erode"
          in="SourceAlpha"
          result="effect2_dropShadow"
        />
        <feOffset dy="8" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.211765 0 0 0 0 0.254902 0 0 0 0 0.321569 0 0 0 0.03 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow"
          result="effect2_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="4"
          operator="erode"
          in="SourceAlpha"
          result="effect3_dropShadow"
        />
        <feOffset dy="20" />
        <feGaussianBlur stdDeviation="12" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.211765 0 0 0 0 0.254902 0 0 0 0 0.321569 0 0 0 0.08 0"
        />
        <feBlend
          mode="normal"
          in2="effect2_dropShadow"
          result="effect3_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect3_dropShadow"
          result="shape"
        />
      </filter>
      <filter
        :id="filter2Id"
        x="59.4176"
        y="8"
        width="104.547"
        height="112.499"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood
          flood-opacity="0"
          result="BackgroundImageFix"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="1.5"
          operator="erode"
          in="SourceAlpha"
          result="effect1_dropShadow"
        />
        <feOffset dy="3" />
        <feGaussianBlur stdDeviation="1.5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.211765 0 0 0 0 0.254902 0 0 0 0 0.321569 0 0 0 0.04 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="4"
          operator="erode"
          in="SourceAlpha"
          result="effect2_dropShadow"
        />
        <feOffset dy="8" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.211765 0 0 0 0 0.254902 0 0 0 0 0.321569 0 0 0 0.03 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow"
          result="effect2_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="4"
          operator="erode"
          in="SourceAlpha"
          result="effect3_dropShadow"
        />
        <feOffset dy="20" />
        <feGaussianBlur stdDeviation="12" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.211765 0 0 0 0 0.254902 0 0 0 0 0.321569 0 0 0 0.08 0"
        />
        <feBlend
          mode="normal"
          in2="effect2_dropShadow"
          result="effect3_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect3_dropShadow"
          result="shape"
        />
      </filter>
      <clipPath
        :id="clipId"
        transform="translate(-53.9647 -62)"
      >
        <path d="M61.9647 90C61.9647 78.9543 70.919 70 81.9647 70C93.0104 70 101.965 78.9543 101.965 90C101.965 101.046 93.0104 110 81.9647 110C70.919 110 61.9647 101.046 61.9647 90Z" />
      </clipPath>
      <linearGradient
        :id="paint0Id"
        x1="45.7386"
        y1="79.2399"
        x2="19.2501"
        y2="31.4527"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#EEF2F6" />
        <stop
          offset="1"
          stop-color="#F8FAFC"
        />
      </linearGradient>
      <linearGradient
        :id="paint1Id"
        x1="61.7562"
        y1="67.0755"
        x2="57.9453"
        y2="12.571"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#EEF2F6" />
        <stop
          offset="1"
          stop-color="#F8FAFC"
        />
      </linearGradient>
      <linearGradient
        :id="paint2Id"
        x1="81.0846"
        y1="62.1785"
        x2="100.665"
        y2="11.17"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#EEF2F6" />
        <stop
          offset="1"
          stop-color="#F8FAFC"
        />
      </linearGradient>
    </defs>
  </svg>
</template>
