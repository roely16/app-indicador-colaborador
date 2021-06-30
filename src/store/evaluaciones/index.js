const state = {

    fecha: new Date().toISOString().substr(0, 7),
    criterio: {}

}

const mutations = {

    setFecha(state, payload){
      
        state.fecha = payload

    },
    setCriterio(state, payload){

        state.criterio = payload

    }

}

const actions = {}

const getters = {

    getFecha: state => state.fecha,
    getCriterio: state => state.criterio
    
}

export default {
    state,
    mutations,
    actions,
    getters
}