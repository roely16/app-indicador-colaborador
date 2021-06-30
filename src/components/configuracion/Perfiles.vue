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
                <Agrupacion @showEdit="((value) => { mostrar_editar(value) })" @showDelete="(value) => { eliminar(value) }"></Agrupacion>
            </v-col>
        </v-row>

        <Modal :fullscreen="fullscreen" :title="title" ref="modal">
			<template #form>
				<Form :id_perfil="id_perfil" ref="form" @closeModal="close_modal"></Form>
			</template>
		</Modal>

    </div>
</template>

<script>

    import request from '@/functions/request'

    //import Alert from '@/components/AlertSeleccion'

    import Modal from '@/components/Modal'
    import Form from '@/components/perfiles/Form'

    import sw_alert from '@/functions/alert'

    import Agrupacion from '@/components/perfiles/Agrupacion'

    export default {

        components: {
            //Alert,
            Modal,
            Form,
            Agrupacion
        },
        data(){
            return{
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
            mostrar_editar(id){

                this.title = "Editar Perfil"
                this.fullscreen = true
                this.id_perfil = id
				this.$refs.modal.show()

            },
            eliminar(id){

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
                                id: id
                            }
                        }

                        request.post(data)
                        .then((response) => {
                            
                            if (response.data.status == 200) {
                                
                                sw_alert.show(response.data)
                                .then(() => {

                                    this.$store.dispatch('getAreas')

                                })

                            }

                        })

                    }

                })

            }

        },
        computed: {

            busqueda: {

                get: function(){
                    return this.$store.getters.getSearch
                },
                set: function(val){
                    this.$store.dispatch('setSearch', val)
                }

            }

        }
    }
</script>

<style>

</style>