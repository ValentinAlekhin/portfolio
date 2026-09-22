<script setup lang="ts">
defineProps<{
  variant: 'website' | 'shop' | 'service' | 'automation'
}>()
</script>

<template>
  <svg class="service-diagram" viewBox="0 0 240 160" fill="none" aria-hidden="true">
    <path class="service-diagram__guides" d="M0 40H240M0 80H240M0 120H240M40 0V160M80 0V160M120 0V160M160 0V160M200 0V160" />
    <g v-if="variant !== 'automation'">
      <rect class="service-diagram__surface" x="20" y="18" width="200" height="124" rx="2" />
      <path d="M20 38H220M32 28H34M40 28H42M48 28H50" />
    </g>
    <g v-if="variant === 'website'">
      <path d="M34 54H62M152 54H170M178 54H206M34 75H115M34 85H96" />
      <path class="service-diagram__muted" d="M34 101H106M34 108H88" />
      <rect class="service-diagram__fill" x="34" y="119" width="42" height="10" />
      <rect class="service-diagram__tint" x="137" y="69" width="69" height="60" />
      <path d="M137 113L158 91L178 108L187 100L206 118" />
      <circle cx="190" cy="83" r="5" />
    </g>
    <g v-else-if="variant === 'shop'">
      <path d="M34 54H83M184 49H189L193 60H206L209 52H191" />
      <g v-for="offset in [0, 60, 120]" :key="offset" :transform="`translate(${offset} 0)`">
        <rect class="service-diagram__tint" x="34" y="71" width="50" height="40" />
        <path d="M51 84H67L64 103H54Z" />
        <path class="service-diagram__muted" d="M34 122H62M34 130H50" />
        <path d="M73 123H81M77 119V127" />
      </g>
    </g>
    <g v-else-if="variant === 'service'">
      <path class="service-diagram__muted" d="M73 38V142M32 77H59M32 90H54M32 103H61" />
      <circle cx="45" cy="57" r="7" />
      <rect class="service-diagram__tint" x="88" y="53" width="51" height="27" />
      <rect class="service-diagram__tint" x="151" y="53" width="54" height="27" />
      <path d="M99 67H117M162 67H184M88 95H205M88 113H205M88 131H205" />
      <path class="service-diagram__muted" d="M96 104H135M96 122H151" />
      <path d="M184 102L188 106L197 98M184 120L188 124L197 116" />
    </g>
    <g v-else>
      <path class="service-diagram__connection" d="M58 80H89M151 80H180M120 57V28H180M120 103V132H180" />
      <rect class="service-diagram__surface" x="14" y="59" width="44" height="42" rx="2" />
      <rect class="service-diagram__tint" x="89" y="57" width="62" height="46" rx="2" />
      <rect class="service-diagram__surface" x="180" y="10" width="46" height="36" rx="2" />
      <rect class="service-diagram__surface" x="180" y="62" width="46" height="36" rx="2" />
      <rect class="service-diagram__surface" x="180" y="114" width="46" height="36" rx="2" />
      <path d="M25 72H47M25 80H43M25 88H39M108 80L116 88L132 72M192 25H214M192 32H207M193 80L200 87L213 73M192 128H214M192 136H207" />
      <circle class="service-diagram__fill" cx="73" cy="80" r="3" />
      <circle class="service-diagram__fill" cx="165" cy="80" r="3" />
    </g>
    <path class="service-diagram__registration" d="M4 10V4H10M230 4H236V10M4 150V156H10M230 156H236V150" />
  </svg>
</template>

<style scoped lang="scss">
.service-diagram { display: block; width: 100%; overflow: visible; color: var(--color-accent); stroke: currentColor; stroke-width: 1.25; stroke-linecap: square; }
.service-diagram__guides { stroke: var(--color-line); opacity: 0.5; stroke-width: 0.5; }
.service-diagram__surface { fill: var(--color-bg); }
.service-diagram__tint { fill: color-mix(in srgb, var(--color-accent) 9%, var(--color-bg)); }
.service-diagram__fill { fill: currentColor; stroke: none; }
.service-diagram__muted { stroke: var(--color-text-muted); }
.service-diagram__registration { stroke: var(--color-control-border); }
.service-diagram__connection { stroke-dasharray: 3 4; }
</style>
