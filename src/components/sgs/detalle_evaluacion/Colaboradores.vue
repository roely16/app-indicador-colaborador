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
                <v-text-field prepend-inner-icon="mdi-magnify" dense hide-details outlined label="Buscar..."></v-text-field>
            </v-card-text>
            <v-card-text>
                <v-card color="#e6e6e6" outlined class="mb-2" v-for="(area, key) in areas" :key="key">
                    <v-card-text>
                        <v-row align="center">
                            <v-col cols="1">
                                <v-btn v-if="area.check" x-small icon color="success">
                                    <v-icon>
                                        mdi-check
                                    </v-icon>
                                </v-btn>
                            </v-col>
                            <v-col @click="check_seccion(area)" class="pointer-title" cols="9">
                                <span class="overline">
                                    {{ area.descripcion }}
                                </span>
                            </v-col>
                            <v-col align="end" cols="1">
                                <v-btn @click="area.expand = !area.expand" small icon>
                                    <v-icon>
                                        {{ !area.expand ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row v-if="area.expand">
                            <v-col>
                                <v-card @click="check_colaborador({codarea: area.codarea, empleado: empleado.nit})" class="mb-1" outlined v-for="(empleado, key) in area.empleados" :key="key">
                                    <v-card-text>
                                        <v-row align="center">
                                            <v-col cols="1">
                                                <v-btn v-if="empleado.check" x-small icon color="success">
                                                    <v-icon>
                                                        mdi-check
                                                    </v-icon>
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="11">
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
                <AlertMsg v-if="!actividad_select" msg="Debe de seleccionar una actividad" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    
    import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
    import AlertMsg from '@/components/AlertSeleccion'

    export default {
        components: {
            AlertMsg
        },
        data(){
            return{
                show_search: false
            }
        },
        methods: {
            ...mapActions('detalle_evaluacion_sgs', [
                'obtener_areas',
                'agregar_responsables'
            ]),
            ...mapMutations('detalle_evaluacion_sgs', [
                'check_seccion',
                'check_colaborador'
            ])
        },
        computed: {
            ...mapState('detalle_evaluacion_sgs', {
                areas: state => state.colaboradores,
                actividad_select: state => state.actividad_select
            }),
            ...mapGetters('detalle_evaluacion_sgs', [
                'colaboradores_marcados',
            ])
        },
        mounted(){
            //this.obtener_areas()
        }
    }
</script>