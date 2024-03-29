<template>
    <div>
        <v-row class="mt-4">
            <v-col cols="4">
                <v-text-field prepend-inner-icon="mdi-magnify" outlined hide-details placeholder="Buscar..."></v-text-field>
            </v-col>
            <v-col align="end">
                <v-btn @click="show_modal()" color="teal darken-1" elevation="2" dark fab>
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row class="mb-4">
            <v-col cols="4" v-for="(evaluacion, key) in evaluaciones" :key="key">
                <v-card class="d-flex flex-column" min-height="180" color="blue-grey lighten-5" outlined>
                    <v-card-title>
                        {{ evaluacion.nombre }}
                    </v-card-title>
                    <v-card-subtitle class="text">
                        <span v-if="evaluacion.descripcion">
                            {{ evaluacion.descripcion }}
                        </span>
                        <v-chip label else>SIN DESCRIPCIÓN</v-chip>
                    </v-card-subtitle>
                    <v-spacer></v-spacer>
                    <v-divider class="mx-4"></v-divider>
                    <v-card-actions>
                            <v-row
                                align="center"
                                justify="end"
                            >
                                <v-col>
                                    <v-btn
                                        color="orange"
                                        text
                                        @click="mostrar_detalle(evaluacion)"
                                    >
                                        Detalles
                                    </v-btn>
                                </v-col>
                                <v-col align="end">
                                    <v-btn @click="obtener_detalle(evaluacion.id)" small icon color="blue accent-4">
                                        <v-icon>
                                            mdi-pencil
                                        </v-icon>
                                    </v-btn>

                                    <v-btn @click="check_eliminar(evaluacion.id)" class="ml-2" small icon color="red accent-4">
                                        <v-icon>
                                            mdi-delete
                                        </v-icon>
                                    </v-btn>
                                </v-col>
                            
                            </v-row>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <Modal 
            :title="title"
            :width="width"
            ref="modal"
            :fullscreen="fullscreen"
        >
            <template #form>
                <FormEvaluacion ref="form" v-if="content == 'form'" @closeModal="close_modal" />
                <DetalleEvaluacion v-else-if="content == 'detalle'" />
            </template>
        </Modal>
    </div>
</template>

<style>
    .text {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* number of lines to show */
                line-clamp: 2; 
        -webkit-box-orient: vertical;
    }
</style>

<script>

    import Modal from '@/components/Modal'
    import FormEvaluacion from '@/components/sgs/FormEvaluacion'
    import DetalleEvaluacion from '@/components/sgs/DetalleEvaluacion'

    import { mapActions, mapState, mapMutations } from 'vuex'
    
    import sw_alert from '@/functions/alert'

    export default{
        components: {
            Modal,
            FormEvaluacion,
            DetalleEvaluacion
        },
        data(){
            return{
                title: null,
                width: null,
                content: null,
                fullscreen: false
            }
        },
        methods: {
            ...mapActions('evaluacion_sgs', [
                'obtener_evaluaciones',
                'eliminar_evaluacion',
                'detalle_evaluacion'
            ]),
            ...mapActions('detalle_evaluacion_sgs', [
                'obtener_actividades'
            ]),
            ...mapMutations('detalle_evaluacion_sgs', [
                'set_id_evaluacion',
                'clearSelection',
            ]),
            ...mapMutations('evaluacion_sgs', [
                'clear_evaluacion'
            ]),
            show_modal(){

                this.clear_evaluacion()

                this.title = "Crear Evaluación"
                this.width = 500
                this.content = 'form'
                this.fullscreen = false
                 
                this.$refs.modal.show()
                .then(() => {
                    this.$refs.form.reset_validation()
                })

            },
            close_modal(){

                this.$refs.modal.close()

            },
            check_eliminar(id){

                const data_alert = {
					title: '¿Está seguro?',
					message: 'Una vez eliminada no se podrá recuperar!',
					type: 'warning',
					confirm_text: 'ELIMINAR',
					cancel_text: 'Cancelar'
				}

                sw_alert.show_confirm(data_alert)
				.then((result) => {
                    if (result.isConfirmed) {
                        this.eliminar_evaluacion(id)
                    }
                })

            },
            mostrar_detalle(evaluacion){

                this.title = evaluacion.nombre
                this.content = 'detalle'
                this.fullscreen = true

                this.set_id_evaluacion(evaluacion.id)

                this.obtener_actividades()
                this.clearSelection()
                
                this.$refs.modal.show()

            },
            obtener_detalle(id){

                this.detalle_evaluacion(id)
                .then(() => {

                    this.title = "Editar Evaluación " + id
                    this.width = 500
                    this.content = 'form'
                    this.fullscreen = false

                    this.$refs.modal.show()
                    
                })

            }
        },
        computed: {
            ...mapState('evaluacion_sgs', {
                evaluaciones: state => state.evaluaciones
            })
        },
        mounted(){

            this.obtener_evaluaciones()

        }
    }
</script>