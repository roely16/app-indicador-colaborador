<template>
    <div>
        <v-row class="mt-4">
            <v-col cols="4">
                <v-text-field
                    v-model="busqueda"
                    outlined
                    single-line
                    label="Buscar..."
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    autocomplete="off"
                ></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-autocomplete
                    v-model="criterio"
                    :items="criterios"
                    item-text="nombre"
                    item-value="id"
                    outlined
                    single-line
                    label="Módulo"
                    hide-details
                    prepend-inner-icon="mdi-table-edit"
                    @change="detalle_criterio()"
                ></v-autocomplete>
            </v-col>
            <v-spacer></v-spacer>
            <v-col v-if="criterio" align="end" cols="4" md="2">
                <v-btn @click="mostrar_modal()" color="teal darken-1" elevation="2" dark fab>
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>

        <v-row v-if="criterio">
            <v-col>
                <v-chip label outlined color="deep-orange darken-1" dark small>ISO: {{ criterio_obj.valor }}%</v-chip>

                <v-chip v-if="criterio_obj.valor_no_iso" class="ml-2" label outlined color="blue" dark small>NO ISO: {{ criterio_obj.valor_no_iso }}%</v-chip>

            </v-col>
        </v-row>

        <v-row v-if="criterio" class="mt-4">
            <v-col>
                <v-data-table
                    :headers="headers"
                    :items="items"
                    :items-per-page="5"
                    hide-default-footer
                    :page.sync="page"
					@page-count="pageCount = $event"
                >

                    <template v-slot:[`item.asesor`] = "{ item }">
                        <v-chip v-if="item.valor" label outlined color="deep-orange darken-1" dark small>
                            {{ item.valor }}%
                        </v-chip>

                        <v-chip class="ml-2" v-if="item.valor_no_iso" label outlined color="blue" dark small>
                            {{ item.valor_no_iso }}%
                        </v-chip>

                    </template>

                    <template v-slot:[`item.colaborador`] = "{ item }">

                        <v-chip v-if="item.valor_p" label outlined color="deep-orange darken-1" dark small>
                            {{ item.valor_p }}%
                        </v-chip>

                        <v-chip class="ml-2" v-if="item.valor_no_iso_p" label outlined color="blue" dark small>
                            {{ item.valor_no_iso_p }}%
                        </v-chip>

                    </template>

                    <template v-slot:[`item.action`]="{ item }">
                        <v-btn @click="mostrar_editar(item.id)" x-small icon color="blue accent-4">
                            <v-icon>
                                mdi-pencil
                            </v-icon>
                        </v-btn>

                        <v-btn @click="eliminar(item.id)" class="ml-2" x-small icon color="red accent-4">
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

        <v-row v-if="!criterio" class="mt-10" align="center" justify="center">
            <v-col cols="12">
                <v-row justify="center">
                    <v-col cols="2">
                        <v-img src="@/assets/img/info.png"></v-img>
                    </v-col>
                </v-row>
            </v-col>
            <v-col class="text-center" cols="4">
               <p class="overline">
                   Debe de seleccionar primero un módulo.
               </p>
            </v-col>
        </v-row>

        <Modal ref="modal" :title="title" :width="width">
            <template #form>
                <FormMantenimiento @update="detalle_criterio" @closeModal="close_modal" :id_item="id_item" :criterio="criterio_obj" ref="form"></FormMantenimiento>
            </template>
        </Modal>
    </div>
</template>

<script>

    import request from '@/functions/request.js'
    import alert from '@/functions/alert.js'

    import Modal from '@/components/Modal'
    import FormMantenimiento from '@/components/configuracion/FormMantenimiento'

    export default {
        components: {
            Modal,
            FormMantenimiento
        },
        data () {
            return {
                title: null,
                width: null,
                page: 1,
				pageCount: 0,
                criterios: [],
                criterio: null,
                busqueda: null,
                headers: [],
                items: [],
                criterio_obj: {},
                id_item: null
            }
        },
        methods: {

            obtener_criterios(){

                const data = {
                    url: 'obtener_criterios',
                    data: null
                }

                request.post(data)
                .then((response) => {
                    this.criterios = response.data
                })

            },
            detalle_criterio(){

                const data = {
                    url: 'detalle_criterio',
                    data: {
                        id_criterio: this.criterio
                    }
                }

                request.post(data)
                .then((response) => {

                    this.items = response.data.items
                    this.headers = response.data.headers
                    this.criterio_obj = response.data.criterio

                })

            },
            mostrar_modal(){

                this.title = "Agregar Item",
                this.width = "800"
                this.$refs.modal.show()
                .then(() => {

                    this.$refs.form.clear()

                })

            },
            mostrar_editar(id){

                this.id_item = id
                this.title = "Editar Item"
                this.width = "800"
                this.$refs.modal.show()

            },
            eliminar(id){

                const alert_msg = {
                    title: "¿Está seguro?",
                    message: "Una vez eliminado no se podrá recuperar",
                    type: "warning",
                    confirm_text: "ELIMINAR!",
                    cancel_text: "Cancelar"
                }

                alert.show_confirm(alert_msg)
                .then((result) => {
                    
                    if (result.isConfirmed) {
                        
                        const data = {
                            url: 'eliminar_item_criterio',
                            data: {
                                id: id
                            }
                        }

                        request.post(data)
                        .then((response) => {
                            
                            if (response.data.status == 200) {
                                
                                alert.show(response.data)
                                .then(() => {

                                    this.detalle_criterio()

                                })

                            }

                        })

                    }

                })

            },
            close_modal(){

                this.$refs.modal.close()

            }   

        },
        mounted(){

            this.obtener_criterios()

        }
    }
</script>

<style>

</style>