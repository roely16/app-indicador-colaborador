import request from '@/functions/request'

import alert from '@/functions/alert.js'

const namespaced = true

const state = {
    actividades: [],
    actividad: {},
    colaboradores: [],
    id_evaluacion: null,
    actividades_disponibles: [],
    actividad_select: null,
    responsables: [],
    search_colaborador: '',
    search_responsable: null
}

const mutations = {

    set_colaboradores(state, payload){
        state.colaboradores = payload
    },
    set_id_evaluacion(state, payload){
        state.id_evaluacion = payload
    },
    set_actividades_disponibles(state, payload){
        state.actividades_disponibles = payload
    },
    set_actividades(state, payload){
        state.actividades = payload
    },
    set_actividad_seleccionada(state, payload){

        state.actividades.forEach(actividad => {

            if(actividad.id == payload){

                actividad.check = !actividad.check
                state.actividad_select = actividad

            }else{

                actividad.check = false

            }

        });

    },
    check_seccion(state, payload){

        let result = state.colaboradores.filter(area => area.codarea == payload.codarea)

        if (result) {
            result = result[0]
            result.check = !result.check

            // Marcar o desmarcar todos los empleados
            result.empleados.forEach(empleado => {
                empleado.check = result.check
            });

        }

    },
    check_colaborador(state, payload){

        let result = state.colaboradores.filter(area => area.codarea == payload.codarea)

        if (result) {
            
            result = result[0]

            let empleado = result.empleados.filter(empleado => empleado.nit == payload.empleado)

            empleado = empleado[0]
            empleado.check = !empleado.check

        }
    },
    set_responsables(state, payload){
        state.responsables = payload
    },
    checkSeccionResponsable(state, payload){

        let result = state.responsables.filter(area => area.codarea == payload.codarea)

        if (result) {
            result = result[0]
            result.check = !result.check

            // Marcar o desmarcar todos los empleados
            result.empleados.forEach(empleado => {
                empleado.check = result.check
            });
        }
        
    },
    checkResponsable(state, payload){

        let result = state.responsables.filter(area => area.codarea == payload.codarea)

        if (result) {
            
            result = result[0]

            let empleado = result.empleados.filter(empleado => empleado.nit == payload.empleado)

            empleado = empleado[0]
            empleado.check = !empleado.check

        }

    },
    actualizarResponsable(state, payload){

        state.responsables.forEach(area => {
            
            let result = area.empleados.filter(empleado => empleado.nit == payload.empleado)
            
            if (result.length > 0) {
                
                result[0].realizada = payload.realizada

                return

            }

        });
    },
    clearSelection(state){
        state.actividad_select = null
        state.colaboradores = []
        state.responsables = []
    },
    set_search_colaborador(state, payload){
        state.search_colaborador = payload
    },
    set_search_responsable(state, payload){
        state.search_responsable = payload
    }
}

const actions = {

    obtener_areas({commit}, payload){

        const data = {
            url: 'sgs_colaboradores_disponibles',
            data: {
                id_actividad: payload
            }
        }

        request.post(data)
        .then((response) => {
            commit('set_colaboradores', response.data)
        })

    },
    agregar_actividades({state, getters, dispatch}){

        const data = {
            url: 'sgs_agregar_actividad_eva',
            data: {
                id_evaluacion: state.id_evaluacion,
                actividades: getters.actividades_seleccionadas_get
            }
        }

        request.post(data)
        .then((response) => {
            console.log(response.data)
            dispatch('obtener_actividades_disponibles')
            dispatch('obtener_actividades')
        })

    },
    obtener_actividades_disponibles({commit, state}){

        const data = {
            url: 'sgs_actividades_disponibles',
            data: {
                id_evaluacion: state.id_evaluacion
            }
        }

        request.post(data)
        .then((response) => {
            // console.log(response.data)
            commit('set_actividades_disponibles', response.data)
        })

    },
    obtener_actividades({commit}){

        const data = {
            url: 'sgs_actividades_evaluacion',
            data: {
                id_evaluacion: state.id_evaluacion
            }
        }

        request.post(data)
        .then((response) => {
            commit('set_actividades', response.data)
        })

    },
    obtener_responsables({commit, dispatch}, payload){

        if (!payload.not_reload) {
            
            commit('set_actividad_seleccionada', payload.id)

            let result = state.actividades.filter(actividad => actividad.id == payload.id)

            if (!result[0].check) {
                
                commit('clearSelection')

                return

            }

        }

        const data = {
            url: 'sgs_responsables_actividad',
            data: {
                id_actividad: payload.id
            }
        }

        request.post(data)
        .then((response) => {
            commit('set_responsables', response.data)
        })

        dispatch('obtener_areas', payload.id)

    },
    agregar_responsables({state, getters, dispatch}){

        const data = {
            url: 'sgs_asignar_responsables',
            data: {
                actividad: state.actividad_select.id,
                responsables: getters.colaboradores_marcados
            }
        }

        request.post(data)
        .then((response) => {
            if(response.data.status == 200){
                dispatch('obtener_responsables', {id: state.actividad_select.id, not_reload: true})
            }
        })

    },
    actualizar_cumplimiento({commit, state}, payload){

        const data = {
            url: 'sgs_actualizar_cumplimiento',
            data: {
                realizada: payload.realizada,
                responsable: payload.empleado,
                actividad: state.actividad_select.id
            }
        }

        request.post(data)
        .then((response) => {
            if(response.data.status == 200){
                commit('actualizarResponsable', payload)
            }
        })

    },
    actualizar_porcentaje(state, payload){

        const data = {
            url: 'sgs_actualizar_porcentaje',
            data: {
                id: payload.id,
                porcentaje: payload.porcentaje
            }
        }

        request.post(data)
        .then((response) => {
            console.log(response.data)
        })

    },
    eliminar_responsables({state, getters, dispatch}){

        const data = {
            url: 'sgs_eliminar_responsables',
            data: {
                actividad: state.actividad_select.id,
                responsables: getters.responsables_marcados
            }
        }

        request.post(data)
        .then((response) => {
            if (response.data.status == 200) {
                dispatch('obtener_responsables', {id: state.actividad_select.id, not_reload: true})
            }
        })

    },
    eliminar_actividad({state, dispatch}){

        const data_alert = {
            title: '¿Está seguro?',
            message: 'Una vez eliminada no se podrá recuperar!',
            type: 'warning',
            confirm_text: 'ELIMINAR',
            cancel_text: 'Cancelar'
        }

        alert.show_confirm(data_alert)
        .then((result) => {
            if (result.isConfirmed) {

                const data = {
                    url: 'sgs_eliminar_actividad_evaluacion',
                    data: {
                        id: state.actividad_select.id
                    }
                }

                request.post(data)
                .then(() => {
                    dispatch('obtener_actividades')
                    dispatch('obtener_responsables', {id: state.actividad_select.id, not_reload: true})
                })

            }
        })

    }
}

const getters = {
    actividades_seleccionadas_get: state => {
        return state.actividades_disponibles.filter(actividad => actividad.check)
    },
    colaboradores_marcados: state => {

        let empleados_select = []

        state.colaboradores.forEach(area => {
            
            area.empleados.forEach(empleado => {
                
                if (empleado.check) {
                    empleados_select.push(empleado.nit)
                }

            });

        });

        return empleados_select
    },
    responsables_marcados: state => {

        let empleados_select = []

        state.responsables.forEach(area => {
            
            area.empleados.forEach(empleado => {
                
                if (empleado.check) {
                    empleados_select.push(empleado.nit)
                }

            });

        });

        return empleados_select
    },
    // filter_colaboradores: state => {

    //     let data_filter = []

    //     state.colaboradores.forEach(area => {
            
    //         if (area.descripcion.normalize('NFD').toUpperCase().replace(/[\u0300-\u036f]/g, "").includes(state.search_colaborador.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase())) {

    //             data_filter.push(area)

    //         }else{

    //             let data_empleados = []

    //             /** Buscar en a lista de colaboradores */
    //             area.empleados.forEach(empleado => {
                    
    //                 let temp_emp = JSON.parse(JSON.stringify(empleado))

    //                 let name = temp_emp.nombre + ' ' + temp_emp.apellido

    //                 if (name.normalize('NFD').toUpperCase().replace(/[\u0300-\u036f]/g, "").includes(state.search_colaborador.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase())) {
                        
    //                     data_empleados.push(temp_emp)

    //                 }

    //             });

    //             /** Verificar si al menos un empleado coincidio con la búsqueda */
    //             if (data_empleados.length > 0) {
                    
    //                 area.empleados = data_empleados
    //                 data_filter.push(area)

    //             }
    //         }
            
    //     });



    //     return data_filter
    // }
}

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
}