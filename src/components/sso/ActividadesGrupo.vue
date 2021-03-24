<template>
    <div>
        <v-card min-height="500" max-height="500" outlined>
            <v-card-text>
                <v-row>
                    <v-col>
                        <span class="overline">Integrantes</span>
                    </v-col>
                    <v-col align="end">
                        <v-btn icon>
                            <v-icon>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-text v-if="actividades.length <= 0">
                <MsgAlert msg="Aún no se han registrado actividades"></MsgAlert>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

    import MsgAlert from '@/components/AlertSeleccion'
    
    import request from '@/functions/request'

    export default {
        components: {
            MsgAlert
        },
        data(){
            return{
                actividades: []
            }
        },
        methods: {

            obtener_actividades(){

                const data = {
                    url: 'actividades_grupo',
                    data: null
                }

                request.post(data)
                .then((response) => {
                    console.log(response.data)
                })

            }

        },
        created(){

            this.obtener_actividades()

        }
    }
</script>

<style>

</style>