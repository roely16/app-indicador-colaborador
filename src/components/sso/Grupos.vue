<template>
    <div>
        <v-card outlined min-height="500">

            <v-card-text class="pb-0 mb-0">
                <v-btn icon>
                    <v-icon>
                        mdi-magnify
                    </v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>
                        mdi-refresh
                    </v-icon>
                </v-btn>
                <v-btn @click="mostrar_modal()" icon>
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </v-card-text>

            <v-card-text class="mt-2 pt-0">

                <v-card elevation="1" class="mb-2" v-for="(grupo, index) in grupos" :key="index">
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <span class="overline">
                                    {{ grupo.nombre }}
                                </span>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col align="end">
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
                                <v-btn @click="grupo.expand = !grupo.expand" small icon>
                                    <v-icon>
                                        {{ !grupo.expand ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row v-if="grupo.expand">
                            <v-col cols="12">
                                <Alert v-if="grupo.integrantes.length <= 0" margin_top="mt-1" msg="El grupo no tiene integrantes."></Alert>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <Alert v-if="grupos.length <= 0" msg="No existe ningun grupo."></Alert>
            </v-card-text>
        </v-card>

        <Modal ref="modal" :width="width" :title="title">
            <template #form>
                <Form @updateTable="obtener_grupos" @closeModal="close_modal()" ref="form"></Form>
            </template>
        </Modal>
    </div>
</template>

<script>

    import Alert from '@/components/AlertSeleccion'

    import Modal from '@/components/Modal'
    import Form from '@/components/sso/Form'

    import request from '@/functions/request'

    export default {
        components: {
            Alert,
            Modal,
            Form
        },
        data(){
            return{

                grupos: [],
                width: null,
                title: null

            }
        },
        methods: {

            mostrar_modal(){

                this.width = "500"
                this.title = "Crear Grupo"
                this.$refs.modal.show()

            },
            close_modal(){

                this.$refs.modal.close()

            },
            obtener_grupos(){

                const data = {
                    url: 'obtener_grupos',
                    data: null
                }

                request.post(data)
                .then((response) => {
                    this.grupos = response.data
                    console.log(response.data)
                })

            }

        },
        created(){

            this.obtener_grupos()

        }
    }
</script>

<style>

</style>