<template>
    <div>
        <v-card outlined min-height="500">

            <v-card-text class="pb-0 mb-0">
                <v-row>
                    <v-col cols="4">
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
                    </v-col>
                    <v-spacer></v-spacer>

                    <v-col align="end">
                        <v-scroll-x-transition>
                            <v-icon
                                v-if="saved"
                                color="success"
                            >
                                mdi-check
                            </v-icon>
                        </v-scroll-x-transition>
                    </v-col>

                </v-row>
                
            </v-card-text>

            <v-card-text class="mt-2 pt-0">
                <v-card @drop='onDrop($event, grupo)' @dragover.prevent="dragOver(grupo)" @dragleave.prevent="dragLeave(grupo)" @dragend.prevent="dragLeave(grupo)"  @dragenter.prevent :color="grupo.color_card" class="mb-2" v-for="(grupo, index) in grupos" :key="index">
                    <v-card-text>
                        <v-row>
                            <v-col cols="8">
                                <span class="overline">
                                    {{ grupo.nombre }}
                                </span>
                            </v-col>
                            <v-col align="end">
                                 <v-btn @click="modal_detalle_grupo(grupo)" class="mr-1" color="green darken-4" x-small icon>
                                    <v-icon>
                                        mdi-account-details
                                    </v-icon>
                                </v-btn>
                                <v-btn class="mr-1" color="blue accent-4" x-small icon>
                                    <v-icon>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                                 <v-btn class="mr-1" color="red accent-4" x-small icon>
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
                                <Alert v-if="grupo.secciones.length <= 0" margin_top="mt-1" msg="El grupo no tiene integrantes."></Alert>

                                <v-treeview selectable item-text="nombre" item-children="integrantes" :items="grupo.secciones"></v-treeview>
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

        <Modal :fullscreen="true" ref="modal_detalle_grupo" :width="width" :title="title">
            <template #form>
                <FormGrupo :id_grupo="id_grupo" @closeModal="close_modal()" ref="form_grupo"></FormGrupo>
            </template>
        </Modal>

    </div>
</template>

<script>

    import Alert from '@/components/AlertSeleccion'

    import Modal from '@/components/Modal'
    import Form from '@/components/sso/Form'
    import FormGrupo from '@/components/sso/FormGrupo'

    import request from '@/functions/request'
    // eslint-disable-next-line no-unused-vars
    import alert_sw from '@/functions/alert'

    export default {
        props: {
            item: Object,
            seccion: Object
        },
        components: {
            Alert,
            Modal,
            Form,
            FormGrupo
        },
        data(){
            return{

                grupos: [],
                width: null,
                title: null,
                color_card: null,
                saved: false,
                id_grupo: null

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

                })

            },
            // eslint-disable-next-line no-unused-vars
            onDrop (evt, grupo) {
                
                grupo.expand = true
                
                if (this.item) {
                    
                    const integrante = {
                        id_persona: this.item.nit,
                        id_grupo: grupo.id
                    }

                    const data = {
                        url: 'agregar_integrante',
                        data: integrante
                    }

                    request.post(data)
                    .then((response) => {

                        grupo.color_card = null

                        if (response.data.status != 200) {
                            
                            alert_sw.show(response.data)

                        }else{

                            this.saved = true

                            setTimeout(() => this.saved = false, 2000)

                            let seccion = grupo.secciones.filter(seccion => seccion.codarea == response.data.data.codarea)

                            console.log(seccion)

                            if (seccion.length > 0) {
                                
                                // Actualizar la sección completa
                                seccion[0].integrantes = response.data.data.integrantes

                            }else{

                                // Agregar toda la sección
                                grupo.secciones.push(response.data.data)

                            }

                        }

                    })

                }else{

                    const data = {
                        url: 'agregar_seccion',
                        data: {
                            empleados: this.seccion.empleados,
                            id_grupo: grupo.id
                        }
                    }

                    request.post(data)
                    .then((response) => {

                        grupo.color_card = null

                        if (response.data.status != 200) {
                            
                            alert_sw.show(response.data)

                        }else{

                            this.saved = true

                            setTimeout(() => this.saved = false, 2000)

                            //this.obtener_grupos()

                        }

                    })

                }
               
            },
            dragOver(grupo){

                grupo.color_card = "grey lighten-2"
                //grupo.expand = true

            },
            dragLeave(grupo){

                grupo.color_card = null

            },
            selectGrupo(){



            },
            modal_detalle_grupo(grupo){

                this.title = grupo.nombre
                this.width = "500"
                this.id_grupo = grupo.id

                this.$refs.modal_detalle_grupo.show()

            }

        },
        created(){

            this.obtener_grupos()

        }
    }
</script>

<style>

</style>