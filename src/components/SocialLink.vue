<template>
  <a
    :href="social.href"
    target="_blank"
    rel="noopener noreferrer"
    v-if="social.type === 'telegram'"
    class="social_link"
  >
    <svg
      class="social_ico"
      id="Bold"
      enable-background="new 0 0 24 24"
      height="512"
      viewBox="0 0 24 24"
      width="512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m12 24c6.629 0 12-5.371 12-12s-5.371-12-12-12-12 5.371-12 12 5.371 12 12 12zm-6.509-12.26 11.57-4.461c.537-.194 1.006.131.832.943l.001-.001-1.97 9.281c-.146.658-.537.818-1.084.508l-3-2.211-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953z"
      />
    </svg>
  </a>

  <a
    :href="social.href"
    target="_blank"
    rel="noopener noreferrer"
    v-else-if="social.type === 'github'"
    class="social_link"
  >
    <svg
      class="social_ico"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
      style="enable-background:new 0 0 512 512;"
      xml:space="preserve"
    >
      <g>
        <g>
          <path
            d="M255.968,5.329C114.624,5.329,0,120.401,0,262.353c0,113.536,73.344,209.856,175.104,243.872
			c12.8,2.368,17.472-5.568,17.472-12.384c0-6.112-0.224-22.272-0.352-43.712c-71.2,15.52-86.24-34.464-86.24-34.464
			c-11.616-29.696-28.416-37.6-28.416-37.6c-23.264-15.936,1.728-15.616,1.728-15.616c25.696,1.824,39.2,26.496,39.2,26.496
			c22.848,39.264,59.936,27.936,74.528,21.344c2.304-16.608,8.928-27.936,16.256-34.368
			c-56.832-6.496-116.608-28.544-116.608-127.008c0-28.064,9.984-51.008,26.368-68.992c-2.656-6.496-11.424-32.64,2.496-68
			c0,0,21.504-6.912,70.4,26.336c20.416-5.696,42.304-8.544,64.096-8.64c21.728,0.128,43.648,2.944,64.096,8.672
			c48.864-33.248,70.336-26.336,70.336-26.336c13.952,35.392,5.184,61.504,2.56,68c16.416,17.984,26.304,40.928,26.304,68.992
			c0,98.72-59.84,120.448-116.864,126.816c9.184,7.936,17.376,23.616,17.376,47.584c0,34.368-0.32,62.08-0.32,70.496
			c0,6.88,4.608,14.88,17.6,12.352C438.72,472.145,512,375.857,512,262.353C512,120.401,397.376,5.329,255.968,5.329z"
          />
        </g>
      </g>
    </svg>
  </a>

  <a
    href="mailto:headbangernetwork@gmail.com"
    target="_blank"
    rel="noopener noreferrer"
    v-else-if="social.type === 'gmail'"
    class="social_link"
  >
    <svg
      class="social_ico"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
      style="enable-background:new 0 0 512 512;"
      xml:space="preserve"
    >
      <g>
        <g>
          <path
            d="M464,64h-16H64H48C21.504,64,0,85.504,0,112v16v256v16c0,26.496,21.504,48,48,48h16h384h16c26.496,0,48-21.504,48-48v-16
			V128v-16C512,85.504,490.496,64,464,64z M407.488,96L256,215.616L104.512,96H407.488z M448,416H64V148.672l192,147.68L448,148.64
			V416z"
          />
        </g>
      </g>
    </svg>
  </a>
</template>

<script>
export default {
  props: ['social'],
}
</script>

<style lang="scss" scoped>
@import '../scss/style.scss';

.social_link {
  .social_ico {
    width: 25px;
    height: 25px;
    fill: #fff;
    opacity: 0.5;
    transform: all 0.3s;

    &:hover {
      fill: $accent_color;
      opacity: 1;
    }
  }
}
</style>
