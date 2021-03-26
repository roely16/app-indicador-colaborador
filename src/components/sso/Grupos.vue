<template>
    <div>
        <v-card outlined min-height="650">

            <v-card-text class="pb-0 mb-0">
                <v-row>
                    <v-col cols="7">
                        <span class="overline">Grupos</span>
                    </v-col>
                    <v-col cols="5" align="end">
                        <v-btn icon>
                            <v-icon>
                                mdi-magnify
                            </v-icon>
                        </v-btn>
                        <v-btn @click="obtener_grupos()" icon>
                            <v-icon>
                                mdi-refresh
                            </v-icon>
                        </v-btn>
                        <v-btn @click="mostrar_modal()" icon>
                            <v-icon>
                                mdi-plus
                            </v-icon>
                        </v-btn>
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
                                <v-btn @click="mostrar_editar(grupo)" class="mr-1" color="blue accent-4" x-small icon>
                                    <v-icon>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                                 <v-btn :loading="grupo.deleting" @click="eliminar(grupo)" class="mr-1" color="red accent-4" x-small icon>
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
                                
                                <v-divider class="mb-2"></v-divider>

                                <v-row dense>
                                    <v-col class="text-right">
                                        <v-scroll-x-transition>
                                            <v-btn  v-if="grupo.tree_select.length > 0" color="red accent-4" dark @click="eliminar_integrantes(grupo)" x-small :loading="grupo.deleting_integrante">ELIMINAR</v-btn>
                                        </v-scroll-x-transition>
                                    </v-col>
                                </v-row>

                                <Alert v-if="grupo.secciones.length <= 0" margin_top="mt-1" msg="El grupo no tiene integrantes."></Alert>

                                <v-treeview v-model="grupo.tree_select" shaped hoverable selectable :items="grupo.secciones"></v-treeview>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <Alert v-if="grupos.length <= 0" msg="No existe ningun grupo."></Alert>
            </v-card-text>
        </v-card>

        <Modal ref="modal" :width="width" :title="title">
            <template #form>
                <Form :id_grupo="id_grupo" @updateTable="obtener_grupos" @closeModal="close_modal()" ref="form"></Form>
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
                id_grupo: null,
                tree_select: null

            }
        },
        methods: {

            mostrar_modal(){

                this.width = "500"
                this.title = "Crear Grupo"
                this.id_grupo = null
                this.$refs.modal.show()
                .then(() => {
                    this.$refs.form.clear()
                })
                

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

                            let seccion = grupo.secciones.filter(seccion => seccion.id == response.data.data.id)

                            if (seccion.length > 0) {
                                
                                // Actualizar la sección completa
                                seccion[0].children = response.data.data.children

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

                            let seccion = grupo.secciones.filter(seccion => seccion.id == response.data.data.id)

                            if (seccion.length > 0) {
                                
                                // Actualizar la sección completa
                                seccion[0].children = response.data.data.children

                            }else{

                                // Agregar toda la sección
                                grupo.secciones.push(response.data.data)

                            }

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
            modal_detalle_grupo(grupo){

                this.title = grupo.nombre
                this.width = "500"
                this.id_grupo = grupo.id

                this.$refs.modal_detalle_grupo.show()

            },
            mostrar_editar(grupo){

                this.id_grupo = grupo.id

                this.width = "500"
                this.title = "Editar Grupo"
                this.$refs.modal.show()

            },
            eliminar(grupo){

                const config_alert = {
                    title: '¿Está seguro?',
                    message: 'El grupo será eliminado junto con los integrantes y actividades registradas',
                    placeholder: 'Ingreser ELIMINAR para confirmar',
                    type: 'warning',
                    confirm_text: 'ACEPTAR',
                    cancel_text: 'CANCELAR',
                    word_validation: 'ELIMINAR'
                }

                alert_sw.show_confirm_input(config_alert)
                .then((result) => {

                    if (result.isConfirmed) {
                        
                        grupo.deleting = true

                        const data = {
                            url: 'eliminar_grupo',
                            data: {
                                id_grupo: grupo.id
                            }
                        }

                        request.post(data)
                        .then((response) => {

                            if (response.data.status == 200) {
                                
                                alert_sw.show(response.data)
                                .then(() => {

                                    this.obtener_grupos()

                                })

                            }

                        })

                    }
                })

            },
            eliminar_integrantes(grupo){

                const config_alert = {
                    title: '¿Está seguro?',
                    message: 'Las personas serán eliminadas del grupo junto con sus respectivas actividades asignadas',
                    placeholder: 'Ingreser ELIMINAR para confirmar',
                    type: 'warning',
                    confirm_text: 'ACEPTAR',
                    cancel_text: 'CANCELAR',
                    word_validation: 'ELIMINAR'
                }

                alert_sw.show_confirm_input(config_alert)
                .then((result) => {

                    if (result.isConfirmed) {

                        grupo.deleting_integrante = true

                        const data = {
                            url: 'eliminar_integrantes',
                            data: {
                                id_grupo: grupo.id,
                                integrantes: grupo.tree_select
                            }
                        }

                        request.post(data)
                        .then((response) => {
                            console.log(response.data)
                            grupo.deleting_integrante = false
                            this.obtener_grupos()
                        })

                    }

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