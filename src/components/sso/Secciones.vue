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
                        <v-card class="mb-2" elevation="1" v-for="(seccion, index) in secciones" :key="index">
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
                                        <v-list-item
                                            v-for="empleado in seccion.empleados"
                                            :key="empleado.nit"
                                            draggable
                                            @dragstart='startDrag($event, empleado)'
                                        >

                                            <v-list-item-avatar>
                                                <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
                                            </v-list-item-avatar>
                                            <v-list-item-content>
                                                <v-list-item-title>{{ empleado.nombre }} {{ empleado.apellido }}</v-list-item-title>
                                            </v-list-item-content>
                                            
                                        </v-list-item>
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
                    console.log(response.data)
                    this.secciones = response.data
                })

            },
            // eslint-disable-next-line no-unused-vars
            startDrag(event, item){

                this.$emit('dragItem', item)

            }

        },
        created(){

            this.obtener_secciones()

        }

    }
</script>

<style>

</style>