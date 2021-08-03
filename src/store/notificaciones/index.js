import alert from '@/functions/alert.js'
import request from '@/functions/request.js'

const namespaced = true

const state = {

    notificaciones: [],
    notificacion: {},
    loading: false
}

const mutations = {

    setNotificaciones(state, payload){
        state.notificaciones = payload
    },
    setNotificacion(state, payload){
        state.notificacion = payload
    },
    removeNotification(state, payload){
        state.notificaciones.splice(payload, 1)
    },
    setLoading(state, payload){
        state.loading = payload
    }

}

const actions = {

    getNotificaciones({commit}){

        commit('setLoading', true)

        const usuario = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

        const data = {
            url: 'obtener_notificaciones',
            data: {
                nit: usuario.nit
            }
        }

        request.post(data)
        .then((response) => {

            commit('setLoading', false)
            commit('setNotificaciones', response.data)

        })

    },
    clearNotificacion({commit, state, dispatch}, payload){

        const data = {
            url: 'eliminar_notificacion', 
            data: {
                id: state.notificaciones[payload].id
            }
        }

        request.post(data)
        .then((response) => {
            console.log(response.data)
            dispatch('getNotificaciones')
        })

        commit('removeNotification', payload)

    },
    mostrarDetalles(state, payload){
        
        const data = {
            title: payload.title,
            message: payload.subtitle
        }

        alert.show(data)

    }

}

export default {
    namespaced,
    state,
    mutations,
    actions
}