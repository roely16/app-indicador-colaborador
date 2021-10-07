<template>
    <div>
        <v-row class="mt-4">
            <v-col cols="4">
                <v-text-field prepend-inner-icon="mdi-magnify" outlined hide-details placeholder="Buscar..."></v-text-field>
            </v-col>
            <v-col align="end">
                <v-btn color="teal darken-1" elevation="2" @click="mostrar_modal()" dark fab>
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-data-table
                    :headers="headers"
                    :items="items"
                    :items-per-page="5"
                    class="elevation-1"
                    hide-default-footer
                >

                    <template v-slot:[`item.action`]="{ item }">
						<v-btn @click="obtener_actividad(item.id)" x-small icon color="blue accent-4">
							<v-icon>
								mdi-pencil
							</v-icon>
						</v-btn>

						<v-btn @click="check_eliminar(item.id)" class="ml-2" x-small icon color="red accent-4">
							<v-icon>
								mdi-delete
							</v-icon>
						</v-btn>

					</template>

                </v-data-table>
            </v-col>
        </v-row>

        <Modal
            ref="modal"
            :title="title"
            :width="width"
        >
        
            <template #form>
                <FormActividad ref="form" @closeModal="close_modal" />
            </template>
        </Modal>
    </div>
</template>

<script>

    import { mapActions, mapState, mapMutations } from 'vuex'
    import Modal from '@/components/Modal.vue'
    import FormActividad from '@/components/sgs/FormActividad.vue'
    import sw_alert from '@/functions/alert'

    export default{
        components: {
            Modal,
            FormActividad
        },
        data(){
            return{
                title: null,
                width: null
            }
        },
        computed: {
            ...mapState('sgs', {
                headers: state => state.actividades.headers,
                items: state => state.actividades.items,
                actividad: state => state.actividad
            })
        },
        methods: {
            ...mapActions('sgs', [
                'obtener_actividades',
                'eliminar_actividad',
                'detalle_actividad'
            ]),
            ...mapMutations('sgs', [
                'cleanActividad'
            ]),
            mostrar_modal(){

                this.title = "Agregar Actividad"
                this.width = 500

                this.cleanActividad()

                this.$refs.modal.show()
                .then(() =>  this.$refs.form.resetValidation())
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
                        this.eliminar_actividad(id)
                    }
                })
            },
            obtener_actividad(id){

                this.detalle_actividad(id)
                .then(() => {

                    if(this.actividad.id){
                        this.title = "Editar Actividad"
                        this.width = 500

                        this.$refs.modal.show()
                    }

                })

            }
        },
        mounted(){
            this.obtener_actividades()
        }
    }
</script>