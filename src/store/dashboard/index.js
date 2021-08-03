const namespaced = true

const state = {
    dashboard: null
}

const mutations = {

    setDashboard(state, payload){
        state.dashboard = payload
    }

}

const actions = {}

export default {
    namespaced,
    state, 
    mutations,
    actions
}