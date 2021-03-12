<template>
    <div>
        <v-row class="mt-4">
            <v-col cols="4">
                <v-text-field
                    v-model="busqueda"
                    outlined
                    label="Buscar..."
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    autocomplete="off"
                ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col align="end" cols="4" md="2">
                <v-btn @click="mostrar_modal()" color="teal darken-1" elevation="2" dark fab>
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row class="mt-4">
            <v-col>
                <v-data-table
                    :headers="headers"
                    :items="items"
                    :items-per-page="5"
                    hide-default-footer
                    :page.sync="page"
					@page-count="pageCount = $event"
                >

                     <template v-slot:[`item.action`]="{ item }">
                        <v-btn @click="mostrar_editar(item)" x-small icon color="blue accent-4">
                            <v-icon>
                                mdi-pencil
                            </v-icon>
                        </v-btn>

                        <v-btn @click="eliminar(item)" class="ml-2" x-small icon color="red accent-4">
                            <v-icon>
                                mdi-delete
                            </v-icon>
                        </v-btn>

                    </template>

                </v-data-table>

                <v-pagination
					class="mt-4 mb-4"
					v-model="page"
					:length="pageCount"
				></v-pagination>

            </v-col>
        </v-row>

        <Modal @closeModal="clear" ref="modal" :title="title" :width="width">
            <template #form>
                <v-container>
                    <v-row>
                        <v-col>
                            <v-card outlined>
                                <v-card-text>
                                    <Filtro ref="filtro" :prop_nit="nit" :prop_codarea="codarea" @getCodarea="(value) => { codarea = value }" @getNit="(value) => { nit = value }"></Filtro>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
                
                <FormPermisos @updateTable="obtener_permisos" @closeModal="close_modal" :prop_codarea="codarea" :prop_nit="nit" ref="form"></FormPermisos>
            </template>
        </Modal>

    </div>
</template>

<script>

    import Modal from '@/components/Modal'
    import FormPermisos from '@/components/configuracion/FormPermisos'
    import Filtro from '@/components/Filtro.vue'

    import request from '@/functions/request'
    import alert from '@/functions/alert'

    export default {
        components: {
            Modal,
            FormPermisos,
            Filtro
        },
        data () {
            return {
                busqueda: null,
                title: null,
                width: null,
                headers: [],
                items: [],
                page: 1,
				pageCount: 0,
                nit: null,
                codarea: null
            }
        },
        methods: {

            mostrar_modal(){

                this.title = "Habilitación de Permisos"
                this.width = "900"
                this.$refs.modal.show()

            },
            obtener_permisos(){

                const data = {
                    url: 'permisos_habilitados',
                    data: null
                }

                request.post(data)
                .then((response) => {
                    
                    this.items = response.data.items
                    this.headers = response.data.headers

                })

            },
            mostrar_editar(item){

                this.title = "Editar Permisos"
                this.width = "900"

                this.nit = item.id_persona
                this.codarea = item.codarea
               
                this.$refs.modal.show()
                .then(() => {

                    this.$refs.filtro.set(item)

                })
                

            },
            eliminar(item){

                const alert_msg = {
                    title: "¿Está seguro?",
                    message: "Una vez eliminados no se podrán recuperar",
                    type: "warning",
                    confirm_text: "ELIMINAR!",
                    cancel_text: "Cancelar"
                }

                alert.show_confirm(alert_msg)
                .then((result) => {
                    
                    if (result.isConfirmed) {
                        
                        const data = {
                            url: 'eliminar_permisos',
                            data: {
                                id_persona: item.id_persona
                            }
                        }

                        request.post(data)
                        .then((response) => {
                            
                            alert.show(response.data).
                            then(() => {

                                this.obtener_permisos()

                            })

                        })


                    }

                })

            },
            close_modal(){

                this.$refs.modal.close()

            },
            clear(){

               this.nit = null
               this.codarea = null

                const data = {
                    id_persona: null,
                    codarea: null
                }

               this.$refs.filtro.set(data)

            }

        },
        mounted(){

            this.obtener_permisos()

        }
    }
</script>

<style>

</style>