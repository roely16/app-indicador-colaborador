import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

import Home from '../views/Home.vue'

import Productividad from '../views/Productividad.vue'
import ISO_9001 from '../views/ISO.vue'
import CincoS from '../views/5S.vue'
import OficinaVerde from '../views/OficinaVerde'

import Dashboard from '../views/Dashboard'

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
				path: '/home/dashboard',
				name: 'dashboard',
				component: Dashboard
			}
		]
	}
]

const router = new VueRouter({
	routes
})

export default router
