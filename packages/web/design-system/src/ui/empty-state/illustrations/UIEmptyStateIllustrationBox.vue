<script setup lang="ts">
import { useId } from 'vue'

const id = useId()
const filterId = `${id}-f`
const paint0Id = `${id}-p0`
const clipId = `${id}-c`
</script>

<template>
  <svg
    width="152"
    height="133"
    viewBox="0 0 152 133"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="76"
      cy="59.0915"
      r="52"
      fill="#EEF2F6"
    />
    <circle
      cx="21"
      cy="26.0915"
      r="5"
      fill="#EEF2F6"
    />
    <circle
      cx="18"
      cy="110.091"
      r="7"
      fill="#EEF2F6"
    />
    <circle
      cx="145"
      cy="42.0915"
      r="7"
      fill="#EEF2F6"
    />
    <circle
      cx="134"
      cy="15.0915"
      r="4"
      fill="#EEF2F6"
    />
    <g :filter="`url(#${filterId})`">
      <path
        d="M76.0006 91.2813L118 72.6227V19.4665L76.3298 1.09149L34 19.4665V72.6227L76.0006 91.2813Z"
        fill="#F8FAFC"
      />
      <path
        d="M118.5 72.9479L118.203 73.0798L76.2031 91.738L76.001 91.8288L75.7979 91.738L33.7969 73.0798L33.5 72.9479V19.1384L33.8008 19.0075L76.1309 0.632507L76.3311 0.545593L76.5312 0.63446L118.202 19.0095L118.5 19.1403V72.9479Z"
        stroke="black"
        stroke-opacity="0.08"
      />
      <path
        d="M76 37.1544V91.3259L34 72.6227V19.4665L76 37.1544Z"
        fill="#E3E8EF"
      />
      <path
        :fill="`url(#${paint0Id})`"
        d="M76.0008 37.1852V91.3259L118 72.6227V19.4665L76.0008 37.1852Z"
      />
      <path
        d="M76 37.1852L118 19.4665L76.3298 1.09149L34 19.4665L76 37.1852Z"
        fill="#F8FAFC"
      />
      <path
        d="M50.0781 12.4858L91.6722 30.5901L92.0523 43.8613L103.759 39.031L103.405 25.6761L60.4847 7.97345L50.0781 12.4858Z"
        fill="#E3E8EF"
      />
    </g>
    <foreignObject
      x="48"
      y="68.0915"
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
        d="M56 96.0915C56 85.0458 64.9543 76.0915 76 76.0915C87.0457 76.0915 96 85.0458 96 96.0915C96 107.137 87.0457 116.091 76 116.091C64.9543 116.091 56 107.137 56 96.0915Z"
        fill="black"
        fill-opacity="0.2"
      />
      <path
        d="M72.6667 99.4248L76 96.0915M76 96.0915L79.3333 99.4248M76 96.0915V103.591M82.6667 100.044C83.6846 99.2032 84.3333 97.9314 84.3333 96.5082C84.3333 93.9769 82.2813 91.9248 79.75 91.9248C79.5679 91.9248 79.3976 91.8298 79.3051 91.6729C78.2184 89.8289 76.212 88.5915 73.9167 88.5915C70.4649 88.5915 67.6667 91.3897 67.6667 94.8415C67.6667 96.5632 68.3629 98.1224 69.4891 99.2528"
        stroke="white"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <filter
        :id="filterId"
        x="13"
        y="0"
        width="126"
        height="132.376"
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
        transform="translate(-48 -68.0915)"
      >
        <path d="M56 96.0915C56 85.0458 64.9543 76.0915 76 76.0915C87.0457 76.0915 96 85.0458 96 96.0915C96 107.137 87.0457 116.091 76 116.091C64.9543 116.091 56 107.137 56 96.0915Z" />
      </clipPath>
      <linearGradient
        :id="paint0Id"
        x1="97"
        y1="19.4665"
        x2="128.011"
        y2="74.0281"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#EEF2F6" />
        <stop
          offset="1"
          stop-color="#E3E8EF"
        />
      </linearGradient>
    </defs>
  </svg>
</template>
