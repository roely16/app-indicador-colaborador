import request from '@/functions/request.js'
import alert from '@/functions/alert.js'

//import axios from 'axios'

const state = {

    edit: true,
    id_evaluacion: null,
    items: [],
    headers: [],
    id_seguimiento: null,
    show_edit: false,
    id_actividad: null,
    actividad: {
        descripcion: null,
        inicio: null,
        fin: null,
        observaciones: null,
        archivos: [],
        files: [],
        id_seguimiento: null
    },
    archivos_seleccionados: []

}

const mutations = {

    setEdit(state, payload){
        state.edit = payload
    },
    setIdEvaluacion(state, payload){
        state.id_evaluacion = payload
    },
    setItems(state, payload){
        state.items = payload
    },
    setHeaders(state, payload){
        state.headers = payload
    },
    setSeguimiento(state, payload){
        state.id_seguimiento = payload
    },
    setShowEdit(state, payload){
        state.show_edit = payload
    },
    setIdActividad(state, payload){
        state.id_actividad = payload
    },
    setActividad(state, payload){
        state.actividad = payload
    },
    setArchivosSeleccionados(state, payload){
        state.archivos_seleccionados.push(payload)
    },
    removeArchivoSeleccionado(state, payload){

        for( var i = 0; i < state.archivos_seleccionados.length; i++){ 
                                   
            if ( state.archivos_seleccionados[i] === payload) { 
                state.archivos_seleccionados.splice(i, 1); 
                i--; 
            }
        }
    },
    clearArchivoSeleccionado(state){
        state.archivos_seleccionados = []
    },  
    setArchivo(state, payload){

        state.actividad.archivos.push(payload)

    },
    clearFiles(state){
        state.actividad.files = []
    }

}

const actions = {

    getSeguimiento(){

        const data = {
            url: 'obtener_seguimiento',
            data: {
                id: this.getters.getIdEvaluacion
            }
        }

        request.post(data)
        .then((response) => {
            this.commit('setItems', response.data.items)
            this.commit('setHeaders', response.data.headers)
        })

    },
    registrarActividad(state, payload){

        const data = {
            url: 'registrar_actividad_seguimiento',
            data: payload
        }

        request.post(data)
        .then((response) => {

            if (response.data.status == 200) {
                
                this.dispatch('getSeguimiento')

                // Si existen archivos subirlos

                if (payload.files.length > 0) {
                    
                    const data = {
                        id_actividad: response.data.data.id,
                        archivos: payload.files
                    }

                    this.dispatch('registrarArchivos', data)

                }

                const data = {
                    title: 'Excelente!',
                    message: 'La actividad a sido registrada exitosamente.',
                    type: 'success'
                }

                alert.show(data)

            }
            

        })

    },
    registrarArchivos(state, payload){

        payload.archivos.forEach(archivo => {
            
            let formData = new FormData();

            formData.append('file', archivo)
            formData.append('id_actividad', payload.id_actividad)

            const data = {
                url: 'subir_archivos_actividad',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            request.post(data)
            .then((response) => {

                if (response.data) {
                    
                    this.commit('setArchivo', response.data)
                }

            })


        });
        
    },
    detalleActividad(state, payload){

        const data = {
            url: 'detalle_actividad_seguimiento',
            data: {
                id: payload
            }
        }

        request.post(data)
        .then((response) => {
            
            this.commit('setActividad', response.data)

        })

    },
    clearActividad(){

        const actividad = {
            descripcion: null,
            inicio: null,
            fin: null,
            observaciones: null,
            archivos: [],
            files: [],
            id_seguimiento: null
        }

        this.commit('setActividad', actividad)

    },
    editarActividad(){

        const actividad = this.getters.getActividad

        const data = {
            url: 'editar_actividad_seguimiento',
            data: actividad
        }

        request.post(data)
        .then((response) => {

            if (response.data.status == 200) {
                
                this.dispatch('getSeguimiento')

                this.dispatch('detalleActividad', actividad.id)

                // Si existen archivos subirlos
                if (actividad.files.length > 0) {
                    
                    const data = {
                        id_actividad: actividad.id,
                        archivos: actividad.files
                    }

                    this.dispatch('registrarArchivos', data)
            
                }

                this.commit('clearFiles')

            }
        })

    },
    eliminar_archivo(){

        const data = {
            url: 'eliminar_archivos_actividad',
            data: {
                archivos: this.getters.getArchivosSeleccionados
            }
        }

        request.post(data)
        .then(() => {
            
            this.commit('clearArchivoSeleccionado')
            this.dispatch('detalleActividad', this.getters.getActividad.id)
            
        })

    },
    descargar_archivo(){

        const archivos_select = this.getters.getArchivosSeleccionados

        const actividad = this.getters.getActividad

        archivos_select.forEach(archivo_ => {
            
            const result = actividad.archivos.filter( archivo =>  archivo.id == archivo_)

            if (result) {
                
                const file = result[0]

                var link = document.createElement("a")

                link.setAttribute("download", file.nombre);
                link.href = process.env.VUE_APP_API_URL + file.path
                link.target = '_blank'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link);

            }

        });

    },
    eliminarActividad(state, payload){

        const data = {
            title: '¿Está seguro?',
            message: 'Una vez eliminada no se podrá recuperar!',
            type: 'warning',
            confirm_text: 'ELIMINAR!',
            cancel_text: 'CANCELAR'
        }

        alert.show_confirm(data)
        .then((result) => {

            if (result.isConfirmed) {
                
                console.log('eliminar');

                const data_request = {
                    url: 'eliminar_actividad_seguimiento',
                    data: {
                        id: payload
                    }
                }

                request.post(data_request)
                .then((response) => {
                    console.log(response.data)

                    this.dispatch('getSeguimiento')
                })

            }

        })
    },
    cumplimientoActividad(state, payload){

        const data = {
            url: 'cumplimiento_actividad',
            data: {
                id: payload.id,
                cumplio: !payload.cumplio ? 'S' : null
            }
        }

        request.post(data)
        .then((response) => {
            console.log(response.data)

            this.dispatch('getSeguimiento')
        })

    }

}

const getters = {

    getEdit: state => state.edit,
    getIdEvaluacion: state => state.id_evaluacion,
    getItems: state => state.items,
    getHeaders: state => state.headers,
    getIdSeguimiento: state => state.id_seguimiento,
    getActividad: state => state.actividad,
    getArchivosSeleccionados: state => state.archivos_seleccionados

}

export default {
    state,
    mutations,
    actions,
    getters
}