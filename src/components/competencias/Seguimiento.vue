<template>
    <div>
        <v-row>
            <v-col>
                <v-card outlined min-height="700">

                    <v-card-text>

                        <v-data-table single-expand show-expand hide-default-footer :items="items" :headers="headers">

                            <template v-slot:[`item.data-table-expand`]="{ item, expand, isExpanded }">
                                <v-btn @click="() => {

                                    expand(!isExpanded)

                                    setSeguimiento(item, isExpanded)

                                }" icon>
                                    <v-icon>
                                        mdi-chevron-down
                                    </v-icon>
                                </v-btn>
                            </template>

                            <template v-slot:[`item.resultado`]="{ item }">

                                <v-chip small label color="warning">{{ item.resultado }}</v-chip>

                            </template>

                            <template v-slot:[`item.meta`]="{ item }">

                                <v-chip small label color="success">{{ item.meta }}</v-chip>

                            </template>

                            <template v-slot:[`item.tipo`]="{ item }">
                                <v-chip :color="item.tipo == 'C' ? 'error' : 'warning'" small label>
                                    {{ item.tipo == 'C' ? 'CORRECTIVAS' : 'PREVENTIVAS' }}
                                </v-chip>
                            </template>

                            <template v-slot:expanded-item="{ headers, item }">
                                
                                <td :colspan="headers.length">
                                    <v-row class="mt-2 ml-2 mr-2 mb-2">
                                        <v-col>
                                            <v-card outlined>

                                                <v-card-text>
                                                    <v-row justify="end">
                                                        <v-col align="end" cols="4">
                                                            <v-btn @click="modal_actividad()" color="primary" icon small>
                                                                <v-icon>
                                                                    mdi-plus-circle
                                                                </v-icon>
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                                <v-card-text class="pt-0">

                                                    <v-row>
                                                        <v-col cols="6">
                                                            <span class="overline">Actividad</span>
                                                        </v-col>
                                                        <v-col cols="2">
                                                            <span class="overline">Inicio</span>
                                                        </v-col>
                                                        <v-col cols="2">
                                                            <span class="overline">Fin</span>
                                                        </v-col>
                                                        <v-col cols="2" align="end">
                                                            <span class="overline">Acción</span>
                                                        </v-col>
                                                    </v-row>

                                                </v-card-text>

                                                <v-divider></v-divider>

                                                <v-card-text v-if="item.actividades.length > 0">
                                                    
                                                    <v-row v-for="(actividad, i) in item.actividades" :key="i">
                                                        <v-col cols="6">
                                                            {{ actividad.descripcion }}
                                                        </v-col>
                                                        <v-col cols="2">
                                                            {{ actividad.fecha_inicio }}
                                                        </v-col>
                                                        <v-col cols="2">
                                                            {{ actividad.fecha_fin }}
                                                        </v-col>
                                                        <v-col align="end" cols="2">
                                                            <v-btn @click="modal_editar(actividad)" color="primary" icon x-small>
                                                                <v-icon>
                                                                    mdi-pencil
                                                                </v-icon>
                                                            </v-btn>
                                                            <v-btn @click="mostrar_eliminar(actividad)" color="error" icon x-small>
                                                                <v-icon>
                                                                    mdi-delete
                                                                </v-icon>
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>

                                                <v-card-text v-if="item.actividades.length <= 0">
                                                    <Alert msg="Aún no se han registrado actividades"></Alert>
                                                </v-card-text>
                                                
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </td>
                                
                            </template>

                        </v-data-table>

                    </v-card-text>

                </v-card>
            </v-col>
        </v-row>

        <Modal :width="width" :title="title" ref="modal">
            <template #form>
                <FormActividad></FormActividad>
            </template>
        </Modal>
    </div>
</template>

<script>

    import Modal from '@/components/Modal'
    import FormActividad from '@/components/competencias/FormActividad'

    import Alert from '@/components/AlertSeleccion.vue'

    export default {
        components: {
            Modal,
            FormActividad,
            Alert
        },
        data(){
            return{
                title: null,
                width: null
            }
        },
        computed: {

            items(){
                return this.$store.getters.getItems
            },
            headers(){
                return this.$store.getters.getHeaders
            }

        },
        methods: {

            modal_actividad(){

                this.title = "Agregar Actividad"
                this.width = 1200
                this.$store.dispatch('clearActividad')
                this.$store.commit('clearArchivoSeleccionado')
                this.$refs.modal.show()

            },
            setSeguimiento(item, isExpanded){

                this.$store.commit('setSeguimiento', !isExpanded ? item.id : null)

            },
            modal_editar(item){

                this.title = "Editar Actividad"
                this.width = 1200
                this.$store.dispatch('detalleActividad', item.id)
                this.$store.commit('clearArchivoSeleccionado')
                this.$refs.modal.show();

            },
            mostrar_eliminar(actividad){
                this.$store.dispatch('eliminarActividad', actividad.id)
            }

        },
        mounted(){

            this.$store.dispatch('getSeguimiento')

        }
    }
</script>