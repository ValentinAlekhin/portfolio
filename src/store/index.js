import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projects: [
      {
        title: 'Nika',
        description:
          'hisdfhbghjsdvjsaidurgh awsiughbsa aswiruefh ioa fhsiaodbvoia iaw erbgoiasgbd oia oiawboif baoiw rgb',
        skills: ['js', 'react', 'redux'],
        images: [
          'https://mms.businesswire.com/media/20200902005256/en/761650/5/postman-logo-vert-2018.jpg',
          'https://mms.businesswire.com/media/20200902005256/en/761650/5/postman-logo-vert-2018.jpg',
          'https://mms.businesswire.com/media/20200902005256/en/761650/5/postman-logo-vert-2018.jpg',
        ],
        code: 'https://google.com',
        site: 'https://google.com',
      },
      {
        title: 'Nika',
        description:
          'hisdfhbghjsdvjsaidurgh awsiughbsa aswiruefh ioa fhsiaodbvoia iaw erbgoiasgbd oia oiawboif baoiw rgb',
        skills: ['js', 'react', 'redux', 'js', 'react', 'redux'],
        images: [
          'https://mms.businesswire.com/media/20200902005256/en/761650/5/postman-logo-vert-2018.jpg',
          'https://mms.businesswire.com/media/20200902005256/en/761650/5/postman-logo-vert-2018.jpg',
          'https://mms.businesswire.com/media/20200902005256/en/761650/5/postman-logo-vert-2018.jpg',
        ],
        code: 'https://google.com',
        site: 'https://google.com',
      },
      {
        title: 'Nika',
        description:
          'hisdfhbghjsdvjsaidurgh awsiughbsa aswiruefh ioa fhsiaodbvoia iaw erbgoiasgbd oia oiawboif baoiw rgb',
        skills: ['js', 'react', 'redux'],
        images: [
          'https://mms.businesswire.com/media/20200902005256/en/761650/5/postman-logo-vert-2018.jpg',
          'https://mms.businesswire.com/media/20200902005256/en/761650/5/postman-logo-vert-2018.jpg',
          'https://mms.businesswire.com/media/20200902005256/en/761650/5/postman-logo-vert-2018.jpg',
        ],
        code: 'https://google.com',
        site: 'https://google.com',
      },
    ],
  },
  mutations: {},
  actions: {},
  getters: {
    projects(state) {
      return state.projects
    },
  },
  modules: {},
})
