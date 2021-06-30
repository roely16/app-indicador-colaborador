import request from '@/functions/request'

const state = {
    areas: [],
    sin_asignar: [],
    search: null
}

const mutations = {
    setAreas(state, payload){
        state.areas = payload
    },
    setSearch(state, payload){
        state.search = payload
    },
    setSinAsignar(state, payload){
        state.sin_asignar = payload
    }
}

const actions = {

    getAreas(){

        const data = {
            url: 'obtener_perfiles',
            data: null
        }

        request.post(data)
        .then((response) => {
            this.commit('setAreas', response.data.areas)
            this.commit('setSinAsignar', response.data.sin_asignar)
        })

    },
    setSearch(state, payload){
        this.commit('setSearch', payload)
    }

}

const getters = {
    getAreas: state => state.areas,
    getSearch: state => state.search,
    getSinAsignar: state => state.sin_asignar
}

export default {
    state,
    mutations,
    actions,
    getters
}