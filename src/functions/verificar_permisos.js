
import request from '@/functions/request.js'

var func = {

    async check(url){

        // const result = axios.post(process.env.VUE_APP_API_URL + data.url, data.data, data.headers)
        
        // if (result) {

        //     return result
        // }

        const usuario = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

        const peticion = {
            url: 'verificar_permisos',
            data: {
                url: url,
                id_persona: usuario.nit
            }
        }

        const result = request.post(peticion)

        return result

    },

}

export default func