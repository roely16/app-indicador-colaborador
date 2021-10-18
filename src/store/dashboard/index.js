import request from '@/functions/request'

const namespaced = true

const state = {
    dashboard: null
}

const mutations = {

    setDashboard(state, payload){
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
        .then((response) => {
            console.log(response.data)
        })

    }

}

export default {
    namespaced,
    state, 
    mutations,
    actions
}