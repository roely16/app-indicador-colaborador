
import verificar_permisos from '@/functions/verificar_permisos'

const namespaced = true

const state = {
    permisos: {}
}

const mutations = {
    setPermisos(state, payload){
        state.permisos = payload
    }
}

const actions = {
    
    verificar({commit}, payload){

        verificar_permisos.check(payload)
        .then((response) => {
            commit('setPermisos', response.data)
        })

    }
    
}

const getters = {
    getAdmin: state => state.permisos.admin
}

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
} 