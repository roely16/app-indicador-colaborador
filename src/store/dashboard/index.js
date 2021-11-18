import request from '@/functions/request'

const namespaced = true

const state = {
    dashboard: []
}

const mutations = {

    setDashboard(state, payload){
        state.dashboard = payload
    },
    updateDashboardAnual(state, payload){
        state.dashboard = payload
    }

}

const actions = {

    async updateDashboard(state, payload){
        
        let values = null 
        
        if (payload.nit) {
            
            values = {
                date: payload.date,
                nit: payload.nit
            }

        }else {

            values = {
                date: payload.date,
                codarea: payload.codarea
            }

        }
        
        const data = {
            url: 'evaluacion_job',
            data: values
        }

        await request.post(data)
        .then(() => {
            //console.log(response.data)
        })

    },
    fetchAnualDashboard({state, commit}){

        const data = {
            url: 'puntaje_anual',
            data: {
                areas: state.dashboard
            }
        }

        request.post(data)
        .then((response) => {
            //console.log(response.data)
            commit('setDashboard', response.data)
        })

        //commit('setDashboard', [])

    }

}

export default {
    namespaced,
    state, 
    mutations,
    actions
}