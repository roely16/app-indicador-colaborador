import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fecha: new Date().toISOString().substr(0, 7)
  },
  mutations: {

    setFecha(state, payload){
      
      state.fecha = payload

    }

  },
  actions: {
  },
  getters: {

    getFecha: state => state.fecha

  }
})
