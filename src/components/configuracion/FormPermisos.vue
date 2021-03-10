<template>
    <div>
        <v-container>
            <v-form @submit.prevent="registrar()">
                {{ prop_nit }}
                <v-row>
                    <v-col>
                        <v-card outlined>
                            <v-card-text>
                                <Filtro 
                                    @change_data="(data) => {
                                        codarea = data.codarea
                                        nit = data.nit
                                    }" 
                                    ref="filtro"
                                    :prop_codarea="prop_codarea"
                                    :prop_nit="prop_nit"
                                ></Filtro>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row v-if="nit">
                    <v-col cols="12" md="4" sm="6" v-for="(item, i) in menu" :key="i">
                        <v-card
                            :color="item.color"
                            dark
                        >
                            <div class="d-flex flex-no-wrap justify-space-between">
                                <div>
                                    <v-card-title
                                        class="overline pb-0"
                                        v-text="item.nombre"
                                    ></v-card-title>
                                    <v-divider class="mt-0 pt-0" dark></v-divider>
                                    <v-card-subtitle class="pb-0">
                                        <v-checkbox
                                            v-model="item.acceso"
                                            class="mt-0"
                                            dense
                                            hide-details
                                            label="Acceso"
                                        ></v-checkbox>
                                        <v-checkbox
                                            :disabled="!item.acceso"
                                            v-model="item.escritura"
                                            class="mt-0"
                                            dense
                                            hide-details
                                            label="Escritura"
                                        ></v-checkbox>
                                        <v-checkbox
                                            :disabled="!item.acceso"
                                            v-model="item.secciones"
                                            class="mt-0 mb-2"
                                            dense
                                            hide-details
                                            label="Secciones"
                                        ></v-checkbox>
                                    </v-card-subtitle>

                                </div>

                                <v-avatar
                                    class="ma-3"
                                    size="75"
                                    tile
                                >
                                    <v-img :src="require('@/assets/img/' + item.icono)"></v-img>
                                </v-avatar>
                            </div>
                        </v-card>

                    </v-col>
                </v-row>

                <AlertSeleccion v-if="!nit" msg="Debe de seleccionar primero a un colaborador."></AlertSeleccion>

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

    import Filtro from '@/components/Filtro'

    import request from '@/functions/request'
    import alert from '@/functions/alert'

    import AlertSeleccion from '@/components/AlertSeleccion'

    export default {
        props: {
            prop_nit: {
                type: String,
                default: null
            },
            prop_codarea: String
        },  
        components: {
            Filtro,
            AlertSeleccion
        },
        data(){
            return{
                menu: [],
                codarea: null,
                nit: null
            }
        },
        methods: {

            obtener_permisos(){
                
                const data = {
                    url: 'obtener_permisos_usuario',
                    data: {
                        nit: this.nit
                    }
                }
                
                console.log(data)
                
                request.post(data)
                .then((response) => {
                    this.menu = response.data
                })

            },
            registrar(){

                const permisos = {
                    permisos: this.menu,
                    nit: this.nit,
                    codarea: this.codarea
                }

                const data = {
                    url: 'registrar_permisos',
                    data: permisos
                }

                request.post(data)
                .then((response) => {
                    
                    if (response.data) {

                        alert.show(response.data)

                    }
                    console.log(response.data)
                })

            },
            clear(){

                this.codarea = null
                this.nit = null

            }

        },
        computed: {

            permisos_habilitados: function(){
                
                const accesos = this.menu.filter(item => item.acceso)

                if (accesos.length > 0) {
                    
                    return true

                }

                return false

            },
            disabled_filtro: function(){

                return true

            }

        },
        watch: {
            nit: function(){

                this.obtener_permisos()

            },
            prop_nit: function(val){
                                
                this.nit = val

            }
        },
        mounted(){

            if (this.prop_nit) {
                
                this.nit = this.prop_nit

            }

        }
    }
</script>

<style>

</style>