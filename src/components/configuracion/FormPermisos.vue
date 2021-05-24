<template>
    <div>
        <v-container>
            <v-form @submit.prevent="registrar()">
                <v-row v-if="prop_nit">
                    <v-col cols="12" md="4" sm="6" v-for="(item, i) in menu" :key="i">
                        <v-card
                            :color="item.color"
                            dark
                            min-height="215"
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
                                            v-if="item.menu_acceso"
                                        ></v-checkbox>
                                        <v-checkbox
                                            :disabled="!item.acceso"
                                            v-model="item.escritura"
                                            class="mt-0"
                                            dense
                                            hide-details
                                            label="Escritura"
                                            v-if="item.menu_escritura"
                                        ></v-checkbox>
                                        <v-checkbox
                                            :disabled="!item.acceso"
                                            v-model="item.secciones"
                                            class="mt-0"
                                            dense
                                            hide-details
                                            label="Secciones"
                                            v-if="item.menu_secciones"
                                        ></v-checkbox>
                                        <v-checkbox
                                            :disabled="!item.acceso"
                                            v-model="item.admin"
                                            class="mt-0"
                                            dense
                                            hide-details
                                            label="Administrador"
                                            v-if="item.menu_admin"
                                        ></v-checkbox>
                                        <v-checkbox
                                            :disabled="!item.acceso"
                                            v-model="item.conf"
                                            class="mt-0 mb-2"
                                            dense
                                            hide-details
                                            label="Configuración"
                                            v-if="item.menu_conf"
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

                <AlertSeleccion v-if="!prop_nit" msg="Debe de seleccionar primero a un colaborador."></AlertSeleccion>

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

    // import Filtro from '@/components/Filtro'

    import request from '@/functions/request'
    import alert from '@/functions/alert'

    import AlertSeleccion from '@/components/AlertSeleccion'

    export default {
        props: {
            prop_nit: {
                type: String
            },
            prop_codarea: String
        },  
        components: {
            // Filtro,
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
                        nit: this.prop_nit
                    }
                }
                
                request.post(data)
                .then((response) => {
                    this.menu = response.data
                })

            },
            registrar(){

                const permisos = {
                    permisos: this.menu,
                    nit: this.prop_nit,
                    codarea: this.prop_codarea
                }

                const data = {
                    url: 'registrar_permisos',
                    data: permisos
                }

                request.post(data)
                .then((response) => {
                    
                    if (response.data) {

                        alert.show(response.data).
                        then(() => {

                            this.$emit('updateTable')

                        })

                    }
                })

            },
            clear(){

                this.codarea = null
                this.nit = null

            },

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
            prop_nit: function(val){
                
                if (val) {

                    this.obtener_permisos()    

                }
                

            }
        },
        created(){

            if (this.prop_nit) {
                
                this.obtener_permisos()

            }

        }
    }
</script>

<style>

</style>