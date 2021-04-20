import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

import Home from '../views/Home.vue'

import Productividad from '../views/Productividad.vue'
import ISO_9001 from '../views/ISO.vue'
import CincoS from '../views/5S.vue'
import OficinaVerde from '../views/OficinaVerde'
import Convivencia from '../views/Convivencia.vue'
import SSO from '../views/SSO.vue'
import Performance from '../views/Performance'
import Competencias from '../views/Competencias.vue'

import Dashboard from '../views/Dashboard'
import Configuracion from '../views/Configuracion'

import TestIndividual from '../views/TestIndividual'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'login',
		component: Login
	},
	{
		path: '/home',
		name: 'home',
		component: Home,
		children: [
			{
				path: '/home/productividad',
				name: 'productividad',
				component: Productividad
			},
			{
				path: '/home/iso',
				name: 'iso',
				component: ISO_9001
			},
			{
				path: '/home/5s',
				name: 'cinco_s',
				component: CincoS
			},
			{
				path: '/home/oficina_verde',
				name: 'oficina_verde',
				component: OficinaVerde
			},
			{
				path: '/home/convivencia',
				name: 'convivencia',
				component: Convivencia
			},
			{
				path: '/home/sso',
				name: 'sso',
				component: SSO
			},
			{
				path: '/home/performance',
				name: 'performance',
				component: Performance
			},
			{
				path: '/home/competencias',
				name: 'competencias',
				component: Competencias
			},
			{
				path: '/home/dashboard',
				name: 'dashboard',
				component: Dashboard
			},
			{
				path: '/home/configuracion',
				name: 'configuracion',
				component: Configuracion
			},
			{
				path: '/home/test_individual',
				name: 'test_individual',
				component: TestIndividual
			}
		]
	}
]

const router = new VueRouter({
	routes
})

export default router
