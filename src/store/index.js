import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import competencias from './competencias/index.js'
import perfiles from './perfiles/index.js'

export default new Vuex.Store({
	modules: {
		competencias: competencias,
		perfiles: perfiles
	},
	state: {
		fecha: new Date().toISOString().substr(0, 7),
		criterio: {}
	},
	mutations: {

		setFecha(state, payload){
		
			state.fecha = payload

		},
		setCriterio(state, payload){
			state.criterio = payload
		}
		
	},
	actions: {
	},
	getters: {

		getFecha: state => state.fecha,
		getCriterio: state => state.criterio

	}
})
