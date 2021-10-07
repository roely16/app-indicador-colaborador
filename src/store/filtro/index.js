
const namespaced = true

const state = {
    areas_select: [], 
    date: new Date().toISOString().substr(0, 7)
}

const mutations = {

    setSelect(state, payload){
        state.areas_select = payload
    },
    setDate(state, payload){
        state.date = payload
    }

}

const actions = {}

const getters = {

    getAreas: state => state.areas_select,
    getDate: state => state.date

}

export default {
    state,
    namespaced,
    mutations,
    actions, 
    getters
}