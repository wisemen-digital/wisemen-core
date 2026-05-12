<script setup lang="ts">
import { useId } from 'vue'

const id = useId()
const filterId = `${id}-f`
const paint0Id = `${id}-p0`
const paint1Id = `${id}-p1`
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
      cx="78.3462"
      cy="52"
      r="52"
      fill="#EEF2F6"
    />
    <g :filter="`url(#${filterId})`">
      <path
        :fill="`url(#${paint0Id})`"
        d="M20.3462 16.1538C20.3462 13.8597 22.2059 12 24.5 12H131.115C133.409 12 135.269 13.8597 135.269 16.1538V79.8462C135.269 82.1403 133.409 84 131.115 84H24.5C22.2059 84 20.3462 82.1403 20.3462 79.8462V16.1538Z"
      />
      <path
        d="M131.116 11.8271C133.505 11.8273 135.442 13.7647 135.442 16.1543V79.8457C135.442 82.2353 133.505 84.1727 131.116 84.1729H24.5005C22.1108 84.1729 20.1733 82.2354 20.1733 79.8457V16.1543C20.1733 13.7646 22.1108 11.8271 24.5005 11.8271H131.116Z"
        stroke="black"
        stroke-opacity="0.08"
        stroke-width="0.346154"
      />
      <path
        :fill="`url(#${paint1Id})`"
        d="M20.3462 16.1538C20.3462 13.8597 22.2059 12 24.5 12H131.115C133.409 12 135.269 13.8597 135.269 16.1538V28.6154H20.3462V16.1538Z"
      />
      <path
        d="M30.0385 34.8462C30.0385 34.0815 30.6584 33.4615 31.4231 33.4615H36.9615C37.7262 33.4615 38.3461 34.0815 38.3461 34.8462V40.3846C38.3461 41.1493 37.7262 41.7692 36.9615 41.7692H31.4231C30.6584 41.7692 30.0385 41.1493 30.0385 40.3846V34.8462Z"
        fill="#E3E8EF"
      />
      <path
        d="M54.2692 47.3077C54.2692 46.543 54.8891 45.9231 55.6538 45.9231H61.1923C61.957 45.9231 62.5769 46.543 62.5769 47.3077V52.8462C62.5769 53.6109 61.957 54.2308 61.1923 54.2308H55.6538C54.8891 54.2308 54.2692 53.6109 54.2692 52.8462V47.3077Z"
        fill="#E3E8EF"
      />
      <path
        d="M58.4231 57V62.1923"
        stroke="#E3E8EF"
        stroke-width="1.38462"
        stroke-linecap="round"
      />
      <path
        d="M54.2692 66.6924C54.2692 65.9277 54.8891 65.3077 55.6538 65.3077H61.1923C61.957 65.3077 62.5769 65.9277 62.5769 66.6924V72.2308C62.5769 72.9955 61.957 73.6154 61.1923 73.6154H55.6538C54.8891 73.6154 54.2692 72.9955 54.2692 72.2308V66.6924Z"
        fill="#E3E8EF"
      />
      <path
        d="M42.5 37.9051C42.5 36.9804 43.2497 36.2307 44.1744 36.2307L76.8346 36.2307C77.7593 36.2307 78.509 36.9804 78.509 37.9051C78.509 38.8299 77.7593 39.5796 76.8346 39.5796H44.1744C43.2497 39.5796 42.5 38.8299 42.5 37.9051Z"
        fill="#E3E8EF"
      />
      <path
        d="M69.5 50.3667C69.5 49.4419 70.2497 48.6923 71.1744 48.6923L120.45 48.6923C121.375 48.6923 122.124 49.4419 122.124 50.3667C122.124 51.2914 121.375 52.0411 120.45 52.0411H71.1744C70.2497 52.0411 69.5 51.2914 69.5 50.3667Z"
        fill="#E3E8EF"
      />
      <path
        d="M30.0948 50.3666C30.0948 49.4418 30.8445 48.6921 31.7692 48.6921L46.0179 48.6922C46.9426 48.6922 47.6923 49.4419 47.6923 50.3666C47.6923 51.2914 46.9426 52.0411 46.0179 52.0411L31.7692 52.041C30.8445 52.041 30.0948 51.2913 30.0948 50.3666Z"
        fill="#E3E8EF"
      />
      <path
        d="M69.5 69.7513C69.5 68.8266 70.2497 68.0769 71.1744 68.0769L120.45 68.0769C121.375 68.0769 122.124 68.8266 122.124 69.7513C122.124 70.6761 121.375 71.4257 120.45 71.4257H71.1744C70.2497 71.4257 69.5 70.6761 69.5 69.7513Z"
        fill="#E3E8EF"
      />
      <path
        d="M30.0868 21.2898C30.0868 20.365 30.8365 19.6154 31.7612 19.6154L64.4214 19.6154C65.3461 19.6154 66.0958 20.365 66.0958 21.2898C66.0958 22.2145 65.3461 22.9642 64.4214 22.9642H31.7612C30.8365 22.9642 30.0868 22.2145 30.0868 21.2898Z"
        fill="#CDD5DF"
      />
      <path
        d="M104.518 21.2898C104.518 20.365 105.268 19.6154 106.192 19.6154L123.912 19.6154C124.836 19.6154 125.586 20.365 125.586 21.2898C125.586 22.2145 124.836 22.9642 123.912 22.9642H106.192C105.268 22.9642 104.518 22.2145 104.518 21.2898Z"
        fill="#CDD5DF"
      />
    </g>
    <circle
      cx="23.3462"
      cy="5"
      r="5"
      fill="#EEF2F6"
    />
    <circle
      cx="20.3462"
      cy="109"
      r="7"
      fill="#EEF2F6"
    />
    <circle
      cx="147.346"
      cy="35"
      r="7"
      fill="#EEF2F6"
    />
    <circle
      cx="136.346"
      cy="8"
      r="4"
      fill="#EEF2F6"
    />
    <foreignObject
      x="50.3462"
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
        d="M58.3462 90C58.3462 78.9543 67.3005 70 78.3462 70C89.3918 70 98.3462 78.9543 98.3462 90C98.3462 101.046 89.3918 110 78.3462 110C67.3005 110 58.3462 101.046 58.3462 90Z"
        fill="black"
        fill-opacity="0.2"
      />
      <g :clip-path="`url(#${clip1Id})`">
        <path
          d="M78.3462 86.6666V90M78.3462 93.3333H78.3545M86.6795 90C86.6795 94.6023 82.9485 98.3333 78.3462 98.3333C73.7438 98.3333 70.0128 94.6023 70.0128 90C70.0128 85.3976 73.7438 81.6666 78.3462 81.6666C82.9485 81.6666 86.6795 85.3976 86.6795 90Z"
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
        y="11.6538"
        width="155.615"
        height="112.692"
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
        transform="translate(-50.3462 -62)"
      >
        <path d="M58.3462 90C58.3462 78.9543 67.3005 70 78.3462 70C89.3918 70 98.3462 78.9543 98.3462 90C98.3462 101.046 89.3918 110 78.3462 110C67.3005 110 58.3462 101.046 58.3462 90Z" />
      </clipPath>
      <linearGradient
        :id="paint0Id"
        x1="24.3483"
        y1="83.1477"
        x2="22.2555"
        y2="17.2506"
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
        x1="24.3483"
        y1="28.4187"
        x2="24.2368"
        y2="13.1972"
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
          transform="translate(68.3462 80)"
        />
      </clipPath>
    </defs>
  </svg>
</template>
