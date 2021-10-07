import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import competencias from './competencias/index.js'
import perfiles from './perfiles/index.js'
import permisos from './permisos/index.js'
import notificaciones from './notificaciones/index'
import dashboard from './dashboard/index'
import filtro from './filtro/index'
import sgs from './sgs/index'

export default new Vuex.Store({
	modules: {
		competencias: competencias,
		perfiles: perfiles,
		permisos: permisos,
		notificaciones: notificaciones,
		dashboard: dashboard,
		filtro: filtro,
		sgs: sgs
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
