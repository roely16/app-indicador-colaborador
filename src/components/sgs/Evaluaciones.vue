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
               <v-card elevation="1" outlined>
                   <v-card-title>
                       {{ evaluacion.nombre }}
                   </v-card-title>
                   <v-card-subtitle>
                       {{ evaluacion.descripcion }}
                   </v-card-subtitle>

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
                                <v-btn small icon color="blue accent-4">
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
                <FormEvaluacion v-if="content == 'form'" @closeModal="close_modal" />
                <DetalleEvaluacion v-else-if="content == 'detalle'" />
            </template>
        </Modal>
    </div>
</template>

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
                'eliminar_evaluacion'
            ]),
            ...mapActions('detalle_evaluacion_sgs', [
                'obtener_actividades'
            ]),
            ...mapMutations('detalle_evaluacion_sgs', [
                'set_id_evaluacion',
                'clearSelection'
            ]),
            show_modal(){

                this.title = "Crear Evaluación"
                this.width = 500
                this.content = 'form'
                this.fullscreen = false
                 
                this.$refs.modal.show()

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