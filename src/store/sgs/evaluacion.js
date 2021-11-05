import request from '@/functions/request'

import alert from '@/functions/alert.js'

const namespaced = true

const state = {
    evaluaciones: [],
    evaluacion: {
        nombre: null,
        descripcion: null,
        mes: null
    }
}

const mutations = {

    set_evaluaciones(state, payload){
        state.evaluaciones = payload
    },
    add_evaluacion(state, payload){
        state.evaluaciones.unshift(payload)
    },
    remove_evaluacion(state, payload){
        let result = state.evaluaciones.filter(evaluacion => evaluacion.id != payload)
        state.evaluaciones = result
    },
    set_evaluacion(state, payload){
        state.evaluacion = payload
    },
    clear_evaluacion(state){
        state.evaluacion = {
            nombre: null,
            descripcion: null,
            mes: null
        }
    }

}

const actions = {

    obtener_evaluaciones({commit}){

        const data = {
            url: 'sgs_obtener_evaluaciones',
            data: state.evaluacion
        }

        request.post(data)
        .then((response) => {
            commit('set_evaluaciones', response.data)
        })

    },
    async registrar_evaluacion({commit, state}){

        const data = {
            url: 'sgs_registrar_evaluacion',
            data: state.evaluacion
        }

        await request.post(data)
        .then((response) => {
            if (response.data.status == 200) {
                commit('add_evaluacion', response.data.evaluacion)
            }
        })

    },
    eliminar_evaluacion({commit}, payload){

        const data = {
            url: 'sgs_eliminar_evaluacion',
            data: {
                id: payload
            }
        }

        request.post(data)
        .then((response) => {
            if (response.data.status == 200) {
                commit('remove_evaluacion', payload)
            }
        })

    },
    async detalle_evaluacion({commit}, payload){

        const data = {
            url: 'sgs_detalle_evaluacion',
            data: {
                id: payload
            }
        }

        await request.post(data)
        .then((response) => {
            commit('set_evaluacion', response.data.evaluacion)
        })

    },
    async editar_evaluacion({state, dispatch}){

        const data = {
            url: 'sgs_editar_evaluacion',
            data: state.evaluacion
        }

        await request.post(data)
        .then((response) => {
            if(response.data.status == 200){

                const data = {
                    title: 'Excelente!',
                    message: 'La evaluación a sido actualizada exitosamente.',
                    type: 'success'
                }

                alert.show(data)

                dispatch('obtener_evaluaciones')
            }
        })

    }

}

const getters = {}

export default{
    namespaced,
    state,
    mutations,
    actions,
    getters
}