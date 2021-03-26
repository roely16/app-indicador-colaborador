<template>
    <div>
        <v-card style="overflow-y: scroll;" min-height="700" max-height="700" outlined>
            <v-card-text>
                <v-row>
                    <v-col>
                        <span class="overline">Actividades</span>
                    </v-col>
                    <v-col align="end">
                        <v-btn @click="obtener_actividades()" icon>
                            <v-icon>
                                mdi-reload
                            </v-icon>
                        </v-btn>
                        <v-btn @click="modal_actividad()" icon>
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
            <v-card-text v-if="actividades.length > 0">
                <v-card :color="actividad.check ? 'grey lighten-1' : null" class="mb-2" v-for="(actividad, index) in actividades" :key="index">
                    <v-card-text>
                        <v-row align="center">
                            <v-col style="cursor: pointer" @click="select_actividad(actividad)" cols="8">
                                <span class="overline">
                                    {{ actividad.nombre }}
                                </span>
                                <br>
                                <span>
                                    <small>
                                        <strong>
                                            Fecha de Cumplimiento: {{ actividad.fecha_cumplimiento }}
                                        </strong>
                                    </small>
                                </span>
                            </v-col>
                            <v-col align="end">
                                <v-btn @click="actividad.calificar = !actividad.calificar" color="teal darken-4" x-small icon>
                                    <v-icon>
                                        mdi-format-list-checks
                                    </v-icon>
                                </v-btn>
                                <v-btn color="blue accent-4" x-small icon>
                                    <v-icon>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                                 <v-btn color="red accent-4" x-small icon>
                                    <v-icon>
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                                <v-btn @click="actividad.expand = !actividad.expand" small icon>
                                    <v-icon>
                                        {{ !actividad.expand ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <!-- Responsables -->
                    <v-card-text v-if="actividad.expand">
                        <v-row>
                            <v-col cols="12">
                                <v-card outlined v-for="(responsable, key) in actividad.responsables" :key="key" class="mb-2">
                                    <v-card-text class="pt-2 pb-2">
                                        <v-row dense align="center">
                                            <v-col cols="1" class="mr-4">
                                                <v-badge
                                                    avatar
                                                    overlap
                                                    :icon="responsable.cumplio == 'S' ? 'mdi-check' : responsable.cumplio == 'N' ? 'mdi-close-circle' : null"
                                                    :color="responsable.cumplio == 'S' ? 'green' : responsable.cumplio == 'N' ? 'red' : null"
                                                >
                                                    <v-avatar size="40">
                                                        <v-img src="@/assets/img/avatar.png"></v-img>
                                                    </v-avatar>
                                                </v-badge>
                                            </v-col>
                                            <v-col cols="8">
                                                <span>
                                                    {{ responsable.nombre }} {{ responsable.apellido }}
                                                </span>
                                            </v-col>
                                            <v-col align="end">
                                                <v-btn @click="calificar_responsable('S', responsable.nit, actividad.id)" v-if="actividad.calificar" color="green darken-4" x-small icon>
                                                    <v-icon>
                                                        mdi-check
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn @click="calificar_responsable('N', responsable.nit, actividad.id)" v-if="actividad.calificar" color="orange accent-4" class="mr-4" x-small icon>
                                                    <v-icon>
                                                        mdi-close-circle
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn color="red accent-4" x-small icon>
                                                    <v-icon>
                                                        mdi-delete
                                                    </v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-card-text>
        </v-card>

        <Modal :title="title" :width="width" ref="modal">
            <template #form>
                <FormActividad @updateData="obtener_actividades" @closeModal="close_modal()" :id_grupo="id_grupo" ref="form"></FormActividad>
            </template>
        </Modal>
    </div>
</template>

<script>

    /* eslint-disable no-unused-vars */

    import MsgAlert from '@/components/AlertSeleccion'
    
    import request from '@/functions/request'

    import Modal from '@/components/Modal'
    import FormActividad from '@/components/sso/FormActividad'

    export default {
        props: {
            id_grupo: Number
        },
        components: {
            MsgAlert,
            Modal,
            FormActividad
        },
        data(){
            return{
                actividades: [],
                title: null,
                width: null
            }
        },
        methods: {

            obtener_actividades(){

                const data = {
                    url: 'actividades_grupo',
                    data: {
                        id_grupo: this.id_grupo
                    }
                }

                request.post(data)
                .then((response) => {
                    
                    this.actividades = response.data

                })

            },
            modal_actividad(){

                this.title = "Agregar Actividad"
                this.width = "500"
                this.$refs.modal.show()

            },
            close_modal(){

                this.$refs.modal.close()

            },
            select_actividad(actividad_){

                this.actividades.forEach(actividad => {
                    
                    if (actividad.id != actividad_.id) {
                        
                        actividad.check = false

                    }

                });

                actividad_.check = !actividad_.check

                if (actividad_.check) {
                    
                    // Enviar a la lista de integrantes
                    this.$emit('actividadCheck', actividad_.id)

                }else{

                    this.$emit('actividadCheck', null)

                }

            },
            calificar_responsable(result, nit, id_actividad){

                const data = {
                    url: 'calificar_responsable',
                    data: {
                        cumplio: result,
                        nit: nit,
                        id_actividad: id_actividad
                    }
                }

                request.post(data)
                .then((response) => {
                    console.log(response.data)

                    this.obtener_actividades()
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