<template>
  <div class="project_card">
    <h2 class="project_card__title">{{ project.title }}</h2>
    <div class="wrapper">
      <div class="about_wrapper">
        <p class="description">{{ project.description }}</p>

        <div class="skill">
          <span class="skill__title">Skills</span>
          <ul class="skill__list">
            <li
              class="skill__list__item"
              v-for="(skill, i) in project.skills"
              :key="i"
            >
              {{ skill }}
            </li>
          </ul>
        </div>
        <a
          class="link"
          v-if="project.code"
          :href="project.code"
          target="_blank"
          rel="noopener noreferrer"
          v-text="'GitHub'"
        />
        <a
          class="link"
          v-if="project.site"
          :href="project.site"
          target="_blank"
          rel="noopener noreferrer"
          v-text="'Site'"
        />
      </div>
      <div class="slider_warapper">
        <Hooper style="height: 300px">
          <Slide v-for="(img, i) in project.images" :key="i">
            <div class="img_container">
              <img :src="img" :alt="project.title" class="slider_img" />
            </div>
            <HooperPagination slot="hooper-addons"></HooperPagination>
          </Slide>
        </Hooper>
      </div>
    </div>
  </div>
</template>

<script>
import { Hooper, Slide, Pagination as HooperPagination } from 'hooper'
import 'hooper/dist/hooper.css'

export default {
  components: {
    Hooper,
    Slide,
    HooperPagination,
  },

  props: ['project'],

  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/style.scss';

$card_color: #202020;

.project_card {
  margin-bottom: 1rem;
  &__title {
    font-size: calc(32px + 28 * (100vw - 320px) / 1120);
    margin-bottom: 4rem;
    margin-top: 4rem;
  }

  .wrapper {
    background: $card_color;
    display: flex;
    flex-direction: column-reverse;
    grid-gap: 4%;
    padding: 0 5% 4rem;

    @include md {
      grid-template-columns: repeat(2, 48%);
      display: grid;
    }

    .about_wrapper {
      padding-top: 4rem;

      .skill {
        margin-top: 3rem;
        margin-bottom: 3rem;

        &__title {
          color: $accent_color;
        }

        &__list {
          display: flex;
          margin-top: 1rem;
          &__item {
            border-radius: 10px;
            background-color: #1b191a;
            letter-spacing: 2.2px;
            color: #fff;
            padding: 7px;
            margin-right: 10px;
            margin-bottom: 10px;
            font-size: 0.75rem;
          }
        }
      }

      .link {
        margin-right: 3rem;
        padding: 0.75rem 1rem;
        border-bottom: 2px solid $accent_color;
      }
    }

    .slider_warapper {
      padding-top: 4rem;

      .img_container {
        overflow: hidden;

        .slider_img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
