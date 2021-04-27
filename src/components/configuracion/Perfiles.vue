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
                    :search="busqueda"
                >   

                    <template slot="no-data">
						
						<Alert msg="No hay datos disponibles"></Alert>

					</template>

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
                    v-if="items.length > 0"
					class="mt-4 mb-4"
					v-model="page"
					:length="pageCount"
				></v-pagination>

            </v-col>
        </v-row>

        <Modal :fullscreen="fullscreen" :title="title" ref="modal">
			<template #form>
				<Form :id_perfil="id_perfil" ref="form" @update="obtener_perfiles" @closeModal="close_modal"></Form>
			</template>
		</Modal>

    </div>
</template>

<script>

    import request from '@/functions/request'

    import Alert from '@/components/AlertSeleccion'

    import Modal from '@/components/Modal'
    import Form from '@/components/perfiles/Form'

    import sw_alert from '@/functions/alert'

    export default {

        components: {
            Alert,
            Modal,
            Form
        },
        data(){
            return{
                busqueda: null,
                title: null,
                width: null,
                headers: [],
                items: [],
                page: 1,
				pageCount: 0,
                nit: null,
                codarea: null,
                fullscreen: false,
                id_perfil: null,
            }
        },
        methods: {

            obtener_perfiles(){

                const data = {
                    url: 'obtener_perfiles',
                    data: null
                }

                request.post(data)
                .then((response) => {
                    console.log(response.data)

                    this.headers = response.data.headers
                    this.items = response.data.items

                })

            },
            mostrar_modal(){

                this.title = "Generar Perfil"
                this.fullscreen = true
                this.id_perfil = null
				this.$refs.modal.show()
                .then(() => {
                    this.$refs.form.clear()
                })

            },
            close_modal(){
                
                this.$refs.modal.close()

            },
            mostrar_editar(item){

                this.title = "Editar Perfil"
                this.fullscreen = true
                this.id_perfil = item.id
				this.$refs.modal.show()

            },
            eliminar(item){

                const data = {
                    title: '¿Está seguro?',
                    message: "Una vez eliminado no se podrá recuperar!",
                    type: 'warning',
                    confirm_text: 'ELIMINAR',
                    cancel_text: 'Cancelar'
                }

                sw_alert.show_confirm(data)
                .then((result) => {

                    if (result.isConfirmed) {
                        
                        const data = {
                            url: 'eliminar_perfil',
                            data: {
                                id: item.id
                            }
                        }

                        request.post(data)
                        .then((response) => {
                            
                            if (response.data.status == 200) {
                                
                                sw_alert.show(response.data)
                                .then(() => {

                                    this.obtener_perfiles()

                                })

                            }

                        })

                    }

                })

            }

        },
        mounted(){

            this.obtener_perfiles()

        }

    }
</script>

<style>

</style>