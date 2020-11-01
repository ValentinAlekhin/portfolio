<template>
  <div>
    <header class="header">
      <div class="header__logo">
        <router-link to="/" v-html="logo" />
      </div>

      <nav class="header__nav">
        <router-link
          to="/projects"
          class="nav__link"
          active-class="active"
          exact
        >
          Projects
        </router-link>
      </nav>
    </header>

    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      logo: /*html*/ `
        <h1 class="logo__title">
          <span class="colored left"><</span>
          <span class="main">Alekhin</span>  
          <span class="colored right">/></span>
        </h1>
        `,
    }
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

$gray_text: #8a8b8d;
$accent_color: #64c1af;

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: #fff;
}

a {
  text-decoration: none;
}

body {
  background: #25272c;
  font-family: 'Roboto Mono', monospace;
}

.header {
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-left: 40px;
  padding-right: 40px;

  &__logo {
    .logo__title {
      font-size: 30px;
      letter-spacing: 1px;

      .colored {
        color: $accent_color;
      }

      .left {
        margin-right: -15px;
      }
      .right {
        margin-left: -15px;
      }
    }
  }

  &__nav {
    .nav__link {
      color: $gray_text;
      transition: all 0.2s;

      &:hover {
        color: $accent_color;
      }

      &.active {
        color: $accent_color;
      }
    }
  }
}
</style>
