<template>
  <div class="home__page container">
    <div class="hello_container">
      <div class="hi">
        <span>HI I'M</span>
        <div class="line" />
      </div>
      <h2 class="name">Valentin</h2>
      <p class="job">Junior Frontend Developer</p>
    </div>
    <div class="social">
      <SocialLink v-for="(link, i) in links" :key="i" :social="link" />
    </div>
  </div>
</template>

<script>
import SocialLink from '../components/SocialLink'

export default {
  name: 'Home',
  components: {
    SocialLink,
  },

  data() {
    return {
      links: [
        {
          type: 'telegram',
          href: 'https://telegram.me/alekhin_valentin',
        },
        {
          type: 'gmail',
          href: '',
        },
        {
          type: 'github',
          href: 'https://github.com/ValentinAlekhin',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/style.scss';

.home__page {
  .hello_container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .hi {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 300;
      font-size: 1.5rem;

      span {
        opacity: 0.5;
      }

      .line {
        background: $accent_color;
        height: 5px;
        width: 50%;

        @include lg {
          width: 60%;
        }

        @include xl {
          width: 70%;
        }
      }
    }

    .name {
      text-transform: uppercase;
      font-size: calc(40px + 28 * (100vw - 320px) / 1120);
    }

    .job {
      text-align: right;
      color: $accent_color;
    }
  }

  .social {
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
