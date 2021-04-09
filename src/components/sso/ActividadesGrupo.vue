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

                                <!-- Botones para calificar -->
                                <v-btn @click="calificacion_masiva('S', actividad)" v-if="actividad.calificar" color="green darken-4" x-small icon>
                                    <v-icon>
                                        mdi-check
                                    </v-icon>
                                </v-btn>
                                <v-btn @click="calificacion_masiva('N', actividad)" v-if="actividad.calificar" color="orange accent-4" class="mr-4" x-small icon>
                                    <v-icon>
                                        mdi-close-circle
                                    </v-icon>
                                </v-btn>

                                

                                <v-btn v-if="actividad.responsables.length > 0" @click="() => {
                                    actividad.calificar = !actividad.calificar
                                    actividad.expand = actividad.calificar    
                                }" :color="!actividad.calificar ? 'teal darken-4' : 'secondary'" x-small icon>
                                    <v-icon>
                                        {{ actividad.calificar ? 'mdi-cancel' : 'mdi-format-list-checks' }}
                                    </v-icon>
                                </v-btn>
                                <v-btn @click="mostrar_editar(actividad)" color="blue accent-4" x-small icon>
                                    <v-icon>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                                 <v-btn @click="eliminar_actividad(actividad)" color="red accent-4" x-small icon>
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
                        <v-row v-if="actividad.responsables.length > 0">
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
                                                <v-btn @click="calificar_responsable('S', responsable.nit, actividad.id, responsable)" v-if="actividad.calificar" color="green darken-4" x-small icon>
                                                    <v-icon>
                                                        mdi-check
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn @click="calificar_responsable('N', responsable.nit, actividad.id)" v-if="actividad.calificar" color="orange accent-4" class="mr-4" x-small icon>
                                                    <v-icon>
                                                        mdi-close-circle
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn @click="eliminar_responsable_actividad(responsable.nit, actividad.id)" color="red accent-4" x-small icon>
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

                        <v-row v-if="actividad.responsables.length <= 0">
                            <v-col>
                                <MsgAlert msg="La actividad no tiene asignados participantes"></MsgAlert>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-card-text>
        </v-card>

        <Modal :title="title" :width="width" ref="modal">
            <template #form>
                <FormActividad :id_actividad="id_actividad" @updateData="obtener_actividades" @closeModal="close_modal()" :id_grupo="id_grupo" ref="form"></FormActividad>
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

    import alert from '@/functions/alert'

    export default {
        props: {
            id_grupo: Number,
            data_actividad: {
                type: Object,
                default: null
            }
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
                width: null,
                id_actividad: null,
                bk_responsable: null
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
                this.id_actividad = null
                
                this.$refs.modal.show()
                .then(() => {

                    this.$refs.form.clear()

                })

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
            calificar_responsable(result, nit, id_actividad, responsable){

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
                    
                    let result = this.actividades.filter( actividad => actividad.id == id_actividad )

                    if (result.length > 0) {
                                                
                        // Buscar al responsable
                        let res = result[0].responsables.filter(responsable => responsable.nit == response.data.responsable.nit)

                        res[0].cumplio = response.data.responsable.cumplio

                    }

                })

            },
            eliminar_actividad(actividad){

                const config_alert = {
                    title: '¿Está seguro?',
                    message: 'La actividad será eliminada junto con las personas asignadas',
                    type: 'warning',
                    confirm_text: 'ACEPTAR',
                    cancel_text: 'CANCELAR',
                }

                alert.show_confirm(config_alert)
                .then((result) => {

                    if (result.isConfirmed) {
                        
                        const data = {
                            url: 'eliminar_actividad',
                            data: {
                                id_actividad: actividad.id
                            }
                        }

                        request.post(data)
                        .then((response) => {
                            console.log(response.data)

                            if (response.data.status == 200) {
                                
                                alert.show(response.data)
                                .then(() => {
                                    this.obtener_actividades()
                                })

                            }
                        })

                    }

                })
            },
            mostrar_editar(actividad){

                this.id_actividad = actividad.id

                this.title = "Editar Actividad"
                this.width = "500"
                this.$refs.modal.show()

            },
            calificacion_masiva(result, actividad){

                actividad.responsables.forEach(responsable => {
                    
                    this.calificar_responsable(result, responsable.nit, actividad.id)

                });

            },
            eliminar_responsable_actividad(nit, id_actividad){

                const config_alert = {
                    title: '¿Está seguro?',
                    message: 'La persona será eliminada de la actividad',
                    type: 'warning',
                    confirm_text: 'ACEPTAR',
                    cancel_text: 'CANCELAR',
                }

                alert.show_confirm(config_alert)
                .then((result) => {

                    if (result.isConfirmed) {
                        
                        const data = {
                            url: 'eliminar_responsable_actividad',
                            data: {
                                id_actividad: id_actividad,
                                nit: nit
                            }
                        }

                        request.post(data)
                        .then((response) => {

                            if (response.data.status == 200) {
                                
                                // Eliminar al responsable de la actividad
                                let act = this.actividades.filter(actividad => actividad.id == response.data.data.id_actividad)

                                console.log(act)

                                if (act.length > 0) {
                                    
                                    // Borrar al responsable de la actividad
                                    let filter = act[0].responsables.filter( responsable => responsable.nit != response.data.data.responsable );

                                    act[0].responsables = filter

                                    console.log(filter);

                                }

                            }

                        })

                    }

                })

            }

        },
        watch: {

            id_grupo: function(){
                
                this.obtener_actividades()

            },
            data_actividad: function(val){

                console.log(val)

                if (val) {
                    
                    let act = this.actividades.filter(actividad => actividad.id == val.id_actividad)

                    if (act.length > 0) {
                        
                        console.log(act);

                        val.personas.forEach(responsable => {
                            
                            act[0].responsables.push(responsable[0])

                        });

                    }

                }

            }

        },
        created(){

            this.obtener_actividades()

        }
    }
</script>

<style>

</style>