<template>
  <div class="projects_page">
    <div class="container">
      <ProjectCard v-for="(proj, i) in projects" :key="i" :project="proj" />
    </div>
  </div>
</template>

<script>
import ProjectCard from '../components/ProjectCard'

export default {
  components: {
    ProjectCard,
  },

  data() {
    return {}
  },

  computed: {
    projects() {
      return this.$store.getters.projects
    },
  },
}
</script>

<style lang="scss" scoped></style>
