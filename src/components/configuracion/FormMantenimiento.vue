<template>
    <div>
        <v-container>
            <v-form>
                <v-row class="mt-2">
                    <v-col cols="12">
                        <v-text-field hide-details outlined label="Descripción" autocomplete="off"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-if="criterio.valor" hide-details outlined type="number" label="Ponderación" autocomplete="off"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-if="criterio.valor_iso" hide-details outlined type="number" label="ISO" autocomplete="off"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-switch
                            hide-details
                            label="Asesor"
                        ></v-switch>
                        <v-switch
                            hide-details
                            label="Prestador de Servicios"
                        ></v-switch>
                    </v-col>
                </v-row>
                <v-row class="mt-4">
                    <v-col class="text-center">
                        <v-btn @click="$emit('closeModal')" large dark>
                            CANCELAR
                        </v-btn>
                        <v-btn type="submit" large color="primary" class="ml-2">
                            REGISTRAR
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </div>
</template>

<script>
    export default {
        props: {
            criterio: Object,
            id_item: String
        },
        data(){
            return{

            }
        },
        methods: {

            obtener_detalle(){

            },
            registrar(){

            },
            editar(){

            }

        },
        mounted(){

            console.log(this.criterio)

        }
    }
</script>

<style>

</style>