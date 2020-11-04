import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projects: [
      {
        title: 'Ника Дмитриева NEW',
        description:
          'Этой мой самый свежий проект. Состоит из сервера и двух клиентов, один для администрирования, другой уже для посетителей. Сейчас готовы формы регистрации и добавления новой серии. Демо версию можно увидеть по ссылке внизу. Вместо взаимодействия с сервером стоят setTimeout обернутые в Promise. Логин и пароль любые.',
        skills: [
          'Vue',
          'Vuex',
          'Vuetify',
          'SCSS',
          'Node',
          'Express',
          'Mongo',
          'Docker',
        ],
        images: [
          require('../images/nika-new/1.jpg'),
          require('../images/nika-new/2.jpg'),
          require('../images/nika-new/3.jpg'),
        ],
        code: 'https://github.com/ValentinAlekhin/nikadmitrieva-new',
        site: 'https://valentinalekhin.github.io/nikadmitrieva-new/',
      },
      {
        title: 'Ника Дмитриева',
        description:
          'Это сайт-портфолио для моей девушки, она фотограф. React и Redux явно избыточны для него, но мне хотелось попрактиковаться. К тому же это не просто статический сайт, его можно редактировать, нажав дважды в футере на надпись "© 2020 НИКА ДМИТРИЕВА". Откроется модальное окно регистрации администратора, после входа станут доступны элементы интерфейса для редактирования контента.',
        skills: [
          'React',
          'Redux',
          'SCSS',
          'Node',
          'Express',
          'Mongo',
          'Docker',
        ],
        images: [
          require('../images/nikadmitrieva/1.jpg'),
          require('../images/nikadmitrieva/2.jpg'),
          require('../images/nikadmitrieva/3.jpg'),
          require('../images/nikadmitrieva/4.jpg'),
        ],
        code: 'https://github.com/ValentinAlekhin/nikadmitrieva-client',
        site: 'http://95.217.163.118/',
      },
      {
        title: 'Renovation',
        description:
          'Приложение помогает найти дату сноса дома по программе реновации, просто вписав адрес. Идея пришла после того, как на Mos.ru появился список в виде огромного и не особо читаемого PDF файла, который пришлось распарсить в JSON для работы программы.',
        skills: ['JavaScript', 'WebPack', 'SCSS'],
        images: [
          require('../images/renovation/1.png'),
          require('../images/renovation/2.png'),
          require('../images/renovation/3.png'),
        ],
        code: 'https://github.com/ValentinAlekhin/renovation',
        site: 'https://valentinalekhin.github.io/renovation/',
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
