<template>
    <div>
        <v-card style="overflow-y: scroll;" max-height="700" height="700">
            <v-card-title>
                <v-row>
                    <v-col>
                        <span class="font-weight-medium">
                            Colaboradores
                        </span>
                    </v-col>
                    <v-col align="end">
                        <v-btn :disabled="colaboradores_marcados.length <= 0" @click="agregar_responsables" icon color="primary">
                            <v-icon>
                                mdi-account-multiple-plus
                            </v-icon>
                        </v-btn>
                        <v-btn @click="show_search = !show_search" icon>
                            <v-icon>
                                mdi-magnify
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text v-if="show_search" class="mb-2 pb-0">
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" dense hide-details outlined label="Buscar..."></v-text-field>
            </v-card-text>
            <v-card-text>
                <v-card color="#e6e6e6" outlined class="mb-2" v-for="(area, key) in filter_colaboradores" :key="key">
                    <v-card-text>
                        <v-row align="center">
                            
                            <v-col class="pointer" @click="check_seccion(area)" cols="10">
                                <span class="overline">
                                    {{ area.descripcion }}
                                </span>
                            </v-col>
                            <v-col cols="2">
                                <v-btn v-if="area.check" x-small icon color="success">
                                    <v-icon>
                                        mdi-check
                                    </v-icon>
                                </v-btn>
                            </v-col>
                            <!-- <v-col align="end" cols="1">
                                <v-btn @click="area.expand = !area.expand" small icon>
                                    <v-icon>
                                        {{ !area.expand ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                                    </v-icon>
                                </v-btn>
                            </v-col> -->
                        </v-row>
                        <v-row v-if="area.expand">
                            <v-col>
                                <v-card @click="check_colaborador({codarea: area.codarea, empleado: empleado.nit})" class="mb-1" outlined v-for="(empleado, key) in area.empleados" :key="key">
                                    <v-card-text>
                                        <v-row align="center">
                                            <v-col cols="10">
                                                <span>
                                                    {{ empleado.nombre }} {{ empleado.apellido }}
                                                </span>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-btn v-if="empleado.check" x-small icon color="success">
                                                    <v-icon>
                                                        mdi-check
                                                    </v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <AlertMsg v-if="!actividad_select" msg="Debe de seleccionar una actividad" />
            </v-card-text>
        </v-card>
    </div>
</template>

<style>

    .pointer{
        cursor: pointer;
    }

</style>

<script>
    
    import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
    import AlertMsg from '@/components/AlertSeleccion'

    export default {
        components: {
            AlertMsg
        },
        data(){
            return{
                show_search: false,
                search: ''
            }
        },
        methods: {
            ...mapActions('detalle_evaluacion_sgs', [
                'obtener_areas',
                'agregar_responsables'
            ]),
            ...mapMutations('detalle_evaluacion_sgs', [
                'check_seccion',
                'check_colaborador',
                'set_search_colaborador'
            ])
        },
        computed: {
            ...mapState('detalle_evaluacion_sgs', {
                areas: state => state.colaboradores,
                actividad_select: state => state.actividad_select,
                search_colaborador: state => state.search_colaborador
            }),
            ...mapGetters('detalle_evaluacion_sgs', [
                'colaboradores_marcados',
            ]),
            filter_colaboradores: function(){

                let data_filter = []

                let bk_areas = JSON.parse(JSON.stringify(this.areas))

                bk_areas.forEach(area => {
                    
                    if (area.descripcion.normalize('NFD').toUpperCase().replace(/[\u0300-\u036f]/g, "").includes(this.search.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase())) {

                        area.expand = true
                        data_filter.push(area)

                    }else{

                        let data_empleados = []

                        /** Buscar en a lista de colaboradores */
                        area.empleados.forEach(empleado => {
                            
                            let temp_emp = JSON.parse(JSON.stringify(empleado))

                            let name = temp_emp.nombre + ' ' + temp_emp.apellido

                            if (name.normalize('NFD').toUpperCase().replace(/[\u0300-\u036f]/g, "").includes(this.search.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase())) {
                                
                                data_empleados.push(temp_emp)

                            }

                        });

                        /** Verificar si al menos un empleado coincidio con la búsqueda */
                        if (data_empleados.length > 0) {
                            
                            area.empleados = data_empleados
                            area.expand = true
                            data_filter.push(area)

                        }
                    }
                    
                });

                return data_filter

            }
        },
        watch: {
        },
        mounted(){
            //this.obtener_areas()
        }
    }
</script>