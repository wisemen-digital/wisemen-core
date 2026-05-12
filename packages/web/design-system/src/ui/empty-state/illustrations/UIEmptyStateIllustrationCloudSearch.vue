<script setup lang="ts">
import { useId } from 'vue'

const id = useId()
const filterId = `${id}-f`
const paint0Id = `${id}-p0`
const paint1Id = `${id}-p1`
const paint2Id = `${id}-p2`
const clipId = `${id}-c`
</script>

<template>
  <svg
    width="154"
    height="121"
    viewBox="0 0 154 121"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="77"
      cy="52"
      r="52"
      fill="#EEF2F6"
    />
    <g :filter="`url(#${filterId})`">
      <path
        d="M78.6 16C67.8273 16 58.2978 21.3233 52.4987 29.4829C50.605 29.0363 48.6301 28.8 46.6 28.8C32.4615 28.8 21 40.2615 21 54.4C21 68.5385 32.4615 80 46.6 80L110.6 80C122.971 80 133 69.9712 133 57.6C133 45.2288 122.971 35.2 110.6 35.2C109.721 35.2 108.854 35.2506 108.002 35.349C103.098 23.9677 91.7797 16 78.6 16Z"
        fill="#F8FAFC"
      />
      <path
        d="M78.5996 15.5C91.8552 15.5 103.255 23.4366 108.312 34.8145C109.064 34.7397 109.827 34.7002 110.6 34.7002C123.247 34.7002 133.5 44.9525 133.5 57.5996C133.5 70.0492 123.565 80.1785 111.191 80.4922L110.6 80.5H46.5996C32.1853 80.4998 20.5002 68.8147 20.5 54.4004C20.5 39.9859 32.1852 28.3 46.5996 28.2998C48.5525 28.2998 50.4558 28.5168 52.2871 28.9238C58.1932 20.7911 67.7778 15.5001 78.5996 15.5Z"
        stroke="black"
        stroke-opacity="0.08"
      />
      <ellipse
        :fill="`url(#${paint0Id})`"
        cx="46.6"
        cy="54.4"
        rx="25.6"
        ry="25.6"
      />
      <circle
        :fill="`url(#${paint1Id})`"
        cx="78.6"
        cy="48"
        r="32"
      />
      <ellipse
        :fill="`url(#${paint2Id})`"
        cx="110.6"
        cy="57.6"
        rx="22.4"
        ry="22.4"
      />
    </g>
    <circle
      cx="22"
      cy="19"
      r="5"
      fill="#EEF2F6"
    />
    <circle
      cx="19"
      cy="109"
      r="7"
      fill="#EEF2F6"
    />
    <circle
      cx="146"
      cy="35"
      r="7"
      fill="#EEF2F6"
    />
    <circle
      cx="135"
      cy="8"
      r="4"
      fill="#EEF2F6"
    />
    <foreignObject
      x="49"
      y="58"
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
        d="M57 86C57 74.9543 65.9543 66 77 66C88.0457 66 97 74.9543 97 86C97 97.0457 88.0457 106 77 106C65.9543 106 57 97.0457 57 86Z"
        fill="black"
        fill-opacity="0.2"
      />
      <path
        d="M84.5 93.5L81.5834 90.5833M83.6667 85.5833C83.6667 89.4954 80.4954 92.6667 76.5833 92.6667C72.6713 92.6667 69.5 89.4954 69.5 85.5833C69.5 81.6713 72.6713 78.5 76.5833 78.5C80.4954 78.5 83.6667 81.6713 83.6667 85.5833Z"
        stroke="white"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <filter
        :id="filterId"
        x="0"
        y="15"
        width="154"
        height="106"
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
          result="effect1_dropShadow_1182_1994"
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
          result="effect1_dropShadow_1182_1994"
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
          result="effect2_dropShadow_1182_1994"
        />
        <feOffset dy="8" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.211765 0 0 0 0 0.254902 0 0 0 0 0.321569 0 0 0 0.03 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_1182_1994"
          result="effect2_dropShadow_1182_1994"
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
          result="effect3_dropShadow_1182_1994"
        />
        <feOffset dy="20" />
        <feGaussianBlur stdDeviation="12" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.211765 0 0 0 0 0.254902 0 0 0 0 0.321569 0 0 0 0.08 0"
        />
        <feBlend
          mode="normal"
          in2="effect2_dropShadow_1182_1994"
          result="effect3_dropShadow_1182_1994"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect3_dropShadow_1182_1994"
          result="shape"
        />
      </filter>
      <clipPath
        :id="clipId"
        transform="translate(-49 -58)"
      >
        <path d="M57 86C57 74.9543 65.9543 66 77 66C88.0457 66 97 74.9543 97 86C97 97.0457 88.0457 106 77 106C65.9543 106 57 97.0457 57 86Z" />
      </clipPath>
      <linearGradient
        :id="paint0Id"
        x1="26.9429"
        y1="37.4857"
        x2="72.2"
        y2="79.9999"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#E3E8EF" />
        <stop
          offset="0.350715"
          stop-color="#F8FAFC"
        />
      </linearGradient>
      <linearGradient
        :id="paint1Id"
        x1="54.0286"
        y1="26.8571"
        x2="110.6"
        y2="80"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#E3E8EF" />
        <stop
          offset="0.350715"
          stop-color="#F8FAFC"
        />
      </linearGradient>
      <linearGradient
        :id="paint2Id"
        x1="93.4"
        y1="42.8"
        x2="133"
        y2="80"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#E3E8EF" />
        <stop
          offset="0.350715"
          stop-color="#F8FAFC"
        />
      </linearGradient>
    </defs>
  </svg>
</template>
