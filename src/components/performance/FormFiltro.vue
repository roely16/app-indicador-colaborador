<template>
    <div>

        <v-container>
            <v-form class="mt-2">
                <v-row>
                    <v-col cols="12">
                        <v-select label="Sección" outlined hide-details></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-select :items="temporadas" item-text="nombre" item-value="temporadaid" label="Temporada" outlined hide-details></v-select>
                    </v-col>
                </v-row>
                <v-row class="mt-4">
                    <v-col class="text-center">
                        <v-btn @click="$emit('closeModal')" large dark>
                            CANCELAR
                        </v-btn>
                        <v-btn type="submit" large color="primary" class="ml-2">
                            ACEPTAR
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>

    </div>
</template>

<script>

    import request from '@/functions/request'

    export default {

        data(){
            return{
                secciones: [],
                temporadas: []
            }
        },
        methods: {

            obtener_temporadas(){

                const data = {
                    url: 'obtener_temporadas',
                    data: null
                }

                request.post(data)
                .then((response) => {
                    this.temporadas = response.data
                })

            },
            obtener_areas(){



            }

        },
        created(){

            this.obtener_temporadas()

            this.obtener_areas()

        }

    }
</script>

<style>

</style>