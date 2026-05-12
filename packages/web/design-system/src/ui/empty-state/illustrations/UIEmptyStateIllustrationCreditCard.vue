<script setup lang="ts">
import { useId } from 'vue'

const id = useId()
const filterId = `${id}-f`
const paint0Id = `${id}-p0`
const clipId = `${id}-c`
const clip1Id = `${id}-c1`
</script>

<template>
  <svg
    width="156"
    height="125"
    viewBox="0 0 156 125"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="78.5"
      cy="52"
      r="52"
      fill="#EEF2F6"
    />
    <g :filter="`url(#${filterId})`">
      <path
        :fill="`url(#${paint0Id})`"
        d="M20.5 18C20.5 14.6863 23.1863 12 26.5 12H129.5C132.814 12 135.5 14.6863 135.5 18V78C135.5 81.3137 132.814 84 129.5 84H26.5C23.1863 84 20.5 81.3137 20.5 78V18Z"
      />
      <path
        d="M129.5 11.75C132.952 11.75 135.75 14.5482 135.75 18V78C135.75 81.4518 132.952 84.25 129.5 84.25H26.5C23.0482 84.25 20.25 81.4518 20.25 78V18C20.25 14.5482 23.0482 11.75 26.5 11.75H129.5Z"
        stroke="black"
        stroke-opacity="0.08"
        stroke-width="0.5"
      />
      <path
        d="M30.5 28C30.5 26.8954 31.3954 26 32.5 26H48.5C49.6046 26 50.5 26.8954 50.5 28V39C50.5 40.1046 49.6046 41 48.5 41H32.5C31.3954 41 30.5 40.1046 30.5 39V28Z"
        fill="#E3E8EF"
      />
      <circle
        cx="117.167"
        cy="32.3335"
        r="8.33333"
        fill="#CDD5DF"
      />
      <circle
        cx="107.167"
        cy="32.3333"
        r="8.33333"
        fill="#E3E8EF"
      />
      <path
        d="M30.5 73.6667C30.5 72.7462 31.2462 72 32.1667 72H48.8333C49.7538 72 50.5 72.7462 50.5 73.6667C50.5 74.5871 49.7538 75.3333 48.8333 75.3333H32.1667C31.2462 75.3333 30.5 74.5871 30.5 73.6667Z"
        fill="#CDD5DF"
      />
      <path
        d="M55.5 73.6667C55.5 72.7462 56.2462 72 57.1667 72H73.8333C74.7538 72 75.5 72.7462 75.5 73.6667C75.5 74.5871 74.7538 75.3333 73.8333 75.3333H57.1667C56.2462 75.3333 55.5 74.5871 55.5 73.6667Z"
        fill="#CDD5DF"
      />
      <path
        d="M80.5 73.6667C80.5 72.7462 81.2462 72 82.1667 72H98.8333C99.7538 72 100.5 72.7462 100.5 73.6667C100.5 74.5871 99.7538 75.3333 98.8333 75.3333H82.1667C81.2462 75.3333 80.5 74.5871 80.5 73.6667Z"
        fill="#CDD5DF"
      />
      <path
        d="M105.5 73.6667C105.5 72.7462 106.246 72 107.167 72H123.833C124.754 72 125.5 72.7462 125.5 73.6667C125.5 74.5871 124.754 75.3333 123.833 75.3333H107.167C106.246 75.3333 105.5 74.5871 105.5 73.6667Z"
        fill="#CDD5DF"
      />
    </g>
    <circle
      cx="23.5"
      cy="5"
      r="5"
      fill="#EEF2F6"
    />
    <circle
      cx="20.5"
      cy="109"
      r="7"
      fill="#EEF2F6"
    />
    <circle
      cx="147.5"
      cy="35"
      r="7"
      fill="#EEF2F6"
    />
    <circle
      cx="136.5"
      cy="8"
      r="4"
      fill="#EEF2F6"
    />
    <foreignObject
      x="50.5"
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
        d="M58.5 90C58.5 78.9543 67.4543 70 78.5 70C89.5457 70 98.5 78.9543 98.5 90C98.5 101.046 89.5457 110 78.5 110C67.4543 110 58.5 101.046 58.5 90Z"
        fill="black"
        fill-opacity="0.2"
      />
      <g :clip-path="`url(#${clip1Id})`">
        <path
          d="M78.5 86.6666V90M78.5 93.3333H78.5083M86.8333 90C86.8333 94.6023 83.1024 98.3333 78.5 98.3333C73.8976 98.3333 70.1667 94.6023 70.1667 90C70.1667 85.3976 73.8976 81.6666 78.5 81.6666C83.1024 81.6666 86.8333 85.3976 86.8333 90Z"
          stroke="white"
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </g>
    <defs>
      <filter
        :id="filterId"
        x="0"
        y="11.5"
        width="156"
        height="113"
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
        transform="translate(-50.5 -62)"
      >
        <path d="M58.5 90C58.5 78.9543 67.4543 70 78.5 70C89.5457 70 98.5 78.9543 98.5 90C98.5 101.046 89.5457 110 78.5 110C67.4543 110 58.5 101.046 58.5 90Z" />
      </clipPath>
      <linearGradient
        :id="paint0Id"
        x1="24.5049"
        y1="83.1477"
        x2="22.4135"
        y2="17.2505"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#EEF2F6" />
        <stop
          offset="1"
          stop-color="#F8FAFC"
        />
      </linearGradient>
      <clipPath :id="clip1Id">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(68.5 80)"
        />
      </clipPath>
    </defs>
  </svg>
</template>
