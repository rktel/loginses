// CSS
import 'vuetify/dist/vuetify.min.css'

// LIB VUE
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueMeteorTracker from 'vue-meteor-tracker'

// USE PLUGINS
Vue.use(VueMeteorTracker)
Vue.use(Vuetify)

// IMPORT MAIN VIEW
import App from '../imports/view/App.vue'

// IMPORT router 
import router from '../imports/api/routes'

// IMPORT store
import store from '../imports/api/store'

// START METEOR CLIENT
Meteor.startup(() => {
    new Vue({
        render: h => h(App),
        router,
        store
    }).$mount('app')
})

