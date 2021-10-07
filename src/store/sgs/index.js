import request from '@/functions/request'

const namespaced = true;

const state = {
    actividades: {
        items: [],
        headers: []
    },
    actividad: {
        nombre: null,
        descripcion: null
    }
}

const mutations = {

    setActividades(state, payload){
        state.actividades.items = payload.items
        state.actividades.headers = payload.headers
    },
    addActividad(state, payload){
        state.actividades.items.unshift(payload)
    },
    removeActividad(state, payload){
        let result = state.actividades.items.filter(actividad => actividad.id != payload.id)
        state.actividades.items = result
    },
    setActividad(state, payload){
        state.actividad = payload
    },
    updateActividad(state, payload){
        let result = state.actividades.items.filter(actividad => actividad.id == payload.id)

        if (result.length > 0) {
            
            result = result[0]

            result.nombre = payload.nombre
            result.descripcion = payload.descripcion
            result.updated_at = payload.updated_at

        }
        
    },
    cleanActividad(state){
        state.actividad = {
            nombre: null,
            descripcion: null
        }
    }

}

const actions = {

    obtener_actividades({commit}){

        const data = {
            url: 'sgs_obtener_actividades',
            data: null
        }

        request.post(data)
        .then((response) => {
            commit('setActividades', response.data)
        })
    },
    async registrar_actividad({commit}, payload){

        const data = {
            url: 'sgs_registrar_actividad',
            data: payload
        }

        await request.post(data)
        .then((response) => {
            if (response.data.status == 200) {
                commit('addActividad', response.data.actividad)
            }
        })

    },
    eliminar_actividad({commit}, payload){

        const data = {
            url: 'sgs_eliminar_actividad',
            data: {
                id: payload
            }
        }

        request.post(data)
        .then((response) => {
            if(response.data.status == 200){
                commit('removeActividad', response.data.actividad)
            }
        })

    },
    async detalle_actividad({commit}, payload){

        const data = {
            url: 'sgs_detalle_actividad',
            data: {
                id: payload
            }
        }

        await request.post(data)
        .then((response) => {
            if(response.data.status == 200){
                commit('setActividad', response.data.actividad)
            }
        })

    },
    async editar_actividad({commit, state}){

        const data = {
            url: 'sgs_editar_actividad',
            data: state.actividad
        }

        await request.post(data)
        .then((response) => {
            if(response.data.status == 200){
                commit('updateActividad', response.data.actividad)
            }
        })

    }

}

const getters = {}

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
}