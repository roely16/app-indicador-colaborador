<template>
    <div>

        <v-expansion-panels :elevation="0" class="mb-4 elevation-0">
            <v-expansion-panel
                v-for="(area,i) in sin_asignar"
                :key="i"
                focusable
                :elevation="0"
                class="elevation-0"
            >
                <v-expansion-panel-header>
                    <v-row align="center">
                        <v-col cols="12">
                            <span class="overline">
                                {{ area.descripcion }}
                            </span>
                        </v-col>
                        
                    </v-row>
                    
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                    
                    <v-card outlined>
                        
                        <v-card-text>

                            <v-row>
                                <v-col>
                                    <v-chip label small color="success">Asesor: {{ area.jefe ? area.jefe.nombre + ' ' + area.jefe.apellido : 'No Disponible' }}</v-chip>
                                     <v-chip class="ml-2" label small color="error">
                                        Perfiles: {{ area.perfiles.length }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-text>

                            <v-row>
                                <v-col cols="6">
                                    <span class="overline font-weight-bold">Nombre</span>
                                </v-col>
                                <v-col align="center" cols="4">
                                    <span class="overline font-weight-bold">No. de Colaboradores</span>
                                </v-col>
                                <v-col align="end" cols="2">
                                    <span class="overline font-weight-bold">Acción</span>
                                </v-col>
                            </v-row>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-text v-if="area.perfiles.length > 0">
                            <v-row v-for="(perfil, key) in area.perfiles" :key="key">
                                <v-col cols="6">
                                    {{ perfil.nombre }}
                                </v-col>
                                <v-col align="center" cols="4">
                                    <v-chip label small>
                                        {{ perfil.colaboradores }}
                                    </v-chip>
                                </v-col>
                                <v-col align="end" cols="2">
                                    <v-btn @click="show_edit(perfil.id)" color="primary" icon x-small>
                                        <v-icon>
                                            mdi-pencil
                                        </v-icon>
                                    </v-btn>

                                    <v-btn @click="show_delete(perfil.id)" class="ml-2" color="error" icon x-small>
                                        <v-icon>
                                            mdi-delete
                                        </v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>

                        <v-card-text v-if="area.perfiles.length <= 0">
                            <Alert msg="Aún no se han registrado perfiles"></Alert>
                        </v-card-text>
                    </v-card>
                    
                </v-expansion-panel-content>

            </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels>
            <v-expansion-panel
                v-for="(area,i) in areas_paginate"
                :key="i"
                focusable
            >
                <v-expansion-panel-header>
                    <v-row align="center">
                        <v-col cols="12">
                            <span class="overline">
                                {{ area.descripcion }}
                            </span>
                        </v-col>
                        
                    </v-row>
                    
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    
                    <v-card outlined>
                        
                        <v-card-text>

                            <v-row>
                                <v-col>
                                    <v-chip label small color="success">Asesor: {{ area.jefe ? area.jefe.nombre + ' ' + area.jefe.apellido : 'No Disponible' }}</v-chip>
                                     <v-chip class="ml-2" label small color="error">
                                        Perfiles: {{ area.perfiles.length }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-text>

                            <v-row>
                                <v-col cols="6">
                                    <span class="overline font-weight-bold">Nombre</span>
                                </v-col>
                                <v-col align="center" cols="4">
                                    <span class="overline font-weight-bold">No. de Colaboradores</span>
                                </v-col>
                                <v-col align="end" cols="2">
                                    <span class="overline font-weight-bold">Acción</span>
                                </v-col>
                            </v-row>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-text v-if="area.perfiles.length > 0">
                            <v-row v-for="(perfil, key) in area.perfiles" :key="key">
                                <v-col cols="6">
                                    {{ perfil.nombre }}
                                </v-col>
                                <v-col align="center" cols="4">
                                    <v-chip label small>
                                        {{ perfil.colaboradores }}
                                    </v-chip>
                                </v-col>
                                <v-col align="end" cols="2">
                                    <v-btn @click="show_edit(perfil.id)" color="primary" icon x-small>
                                        <v-icon>
                                            mdi-pencil
                                        </v-icon>
                                    </v-btn>

                                    <v-btn @click="show_delete(perfil.id)" class="ml-2" color="error" icon x-small>
                                        <v-icon>
                                            mdi-delete
                                        </v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>

                        <v-card-text v-if="area.perfiles.length <= 0">
                            <Alert msg="Aún no se han registrado perfiles"></Alert>
                        </v-card-text>
                    </v-card>
                    
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-pagination
            class="mt-4"
            v-model="page"
            :length="pageLength"
            :total-visible="7"
        ></v-pagination>
    </div>
</template>

<script>

    import Alert from '@/components/AlertSeleccion'

    export default {
        components: {
            Alert
        },
        data(){
            return{
                page: 1,
                pageSize: 5
            }
        },
        methods: {

            obtener_perfiles(){
                this.$store.dispatch('getAreas')
            },
            show_edit(id){
                this.$emit('showEdit', id.toString())
            },
            show_delete(id){
                this.$emit('showDelete', id.toString())
            }

        },
        computed: {
            areas(){

                let search = this.$store.getters.getSearch

                let _areas = this.$store.getters.getAreas

                let result = null 

                if(search){

                    result = _areas.filter(area => area.descripcion.toLowerCase().indexOf(search) > -1 )

                }else{

                    result = _areas
                }
                

                return result

            },
            areas_paginate(){

                return this.areas.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);

            },
            sin_asignar(){
                return this.$store.getters.getSinAsignar
            },
            pageLength: {
                get: function(){

                    let result = Math.ceil(this.areas.length / this.pageSize)

                    return result

                },
                set: function(){
                }
            }
        },
        mounted(){

            this.obtener_perfiles()

        }
    }
</script>