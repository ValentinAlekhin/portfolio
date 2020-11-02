<template>
  <div>
    <header class="header container">
      <div class="header__logo">
        <router-link to="/">
          <h1 class="logo__title">
            <span class="colored"><</span>
            <span class="main">Alekhin</span>
            <span class="colored">/></span>
          </h1>
        </router-link>
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
import './scss/style.scss'

export default {
  data() {
    return {}
  },
}
</script>

<style lang="scss">
@import './scss/style.scss';

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
