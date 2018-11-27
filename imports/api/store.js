import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    userProfile: {}
}

const getters = {}

const mutations = {

    setUserProfile: (state, userProfile) => {
        state.userProfile = userProfile
    }
}

const actions = {}

const store = new Vuex.Store({
    state, getters, mutations, actions
})

export default store