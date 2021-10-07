
import request from '@/functions/request.js'

var func = {

    async check(url){

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