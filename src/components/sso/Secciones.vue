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
            </v-card-text>
            <v-card-text  style="overflow-y: scroll;" class="mt-0 pt-0">
                
                    <v-list max-height="600">
                        <v-card :draggable="seccion.drag" :color="seccion.color_card" @dragstart='seccion.drag ? startDragSeccion($event, seccion) : null' @dragend.prevent="dragLeave(seccion)" hover class="mb-2" elevation="1" v-for="(seccion, index) in secciones" :key="index">
                            <v-card-text>
                                <v-row dense>
                                    <v-col cols="10">
                                        <span class="overline">{{ seccion.descripcion }}</span>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col align="end">
                                        <v-btn @click="seccion.expand = !seccion.expand" small icon>
                                            <v-icon>
                                                {{ !seccion.expand ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                                            </v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row v-if="seccion.expand">
                                    <v-col>
                                        <v-card style="cursor: pointer" :hover="empleado.hover" :color="empleado.color_card" outlined v-for="empleado in seccion.empleados" :key="empleado.nit" class="mb-2" draggable @dragstart='startDrag($event, empleado, seccion)' @dragend.prevent="dragLeave(empleado)">
                                            <v-card-text class="pt-2 pb-2">
                                                <v-row dense align="center">
                                                    <v-col cols="1" class="mr-4">
                                                        <v-avatar size="40">
                                                            <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
                                                        </v-avatar>
                                                    </v-col>
                                                    <v-col>
                                                        <span>
                                                            {{ empleado.nombre }} {{ empleado.apellido }}
                                                        </span>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-list>
            </v-card-text>

        </v-card>
    </div>
</template>

<script>
    import request from '@/functions/request'

    export default {
        components: {
        },
        data(){
            return{
                secciones: [],
                select_empleado: null
            }
        },
        methods: {

            obtener_secciones(){

                const data = {
                    url: 'obtener_areas_colaboradores',
                    data: null
                }

                request.post(data)
                .then((response) => {
                    this.secciones = response.data
                })

            },
            // eslint-disable-next-line no-unused-vars
            startDrag(event, item, seccion){

                seccion.drag = false

                item.color_card = "grey lighten-2"
                this.$emit('dragItem', item)

            },
            dragLeave(empleado){

                empleado.color_card = null
                empleado.drag = true

            },
            startDragSeccion(event, item){

                item.color_card = "grey lighten-2"
                this.$emit('dragSeccion', item)

            }

        },
        created(){

            this.obtener_secciones()

        }

    }
</script>

<style>

</style>