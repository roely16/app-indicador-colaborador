
import verificar_permisos from '@/functions/verificar_permisos'

const state = {
    permisos: {}
}

const mutations = {
    setPermisos(state, payload){
        state.permisos = payload
    }
}

const actions = {
    
    verificar(state, payload){

        verificar_permisos.check(payload)
        .then((response) => {
            this.commit('setPermisos', response.data)
        })

    }
    
}

const getters = {
    getAdmin: state => state.permisos.admin
}

export default {
    state,
    mutations,
    actions,
    getters
} 