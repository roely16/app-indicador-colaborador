<template>
    <div>
        <v-card height="700" style="overflow-y: scroll;" max-height="700">
            <v-card-title>
                <v-row>
                    <v-col>
                        <span class="font-weight-medium">
                            Responsables
                        </span>
                    </v-col>
                    <v-col align="end">
                        <v-btn @click="eliminar_responsables" :disabled="responsables_marcados.length <= 0" color="error" icon>
                            <v-icon>
                                mdi-delete
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
                <v-card color="#e6e6e6" outlined class="mb-2" v-for="(area, key) in responsables" :key="key">
                    <v-card-text>
                        <v-row align="center">
                            <v-col cols="1">
                                <v-btn v-if="area.check" x-small icon color="success">
                                    <v-icon>
                                        mdi-check
                                    </v-icon>
                                </v-btn>
                            </v-col>
                            <v-col class="pointer" @click="checkSeccionResponsable(area)" cols="9">
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
                                <v-card class="mb-1" outlined v-for="(empleado, key) in area.empleados" :key="key">
                                    <v-card-text>
                                        <v-row class="pointer"  @click="checkResponsable({codarea: area.codarea, empleado: empleado.nit})" align="center">
                                            <v-col cols="10">
                                                <span class="font-weigth-bold">
                                                    {{ empleado.nombre }} {{ empleado.apellido }}
                                                </span>
                                            </v-col>
                                             <v-col cols="1">
                                                <v-btn v-if="empleado.check" x-small color="success" icon>
                                                    <v-icon>
                                                        mdi-check
                                                    </v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-btn @click="actualizar_cumplimiento({realizada: 'S', empleado: empleado.nit})" :color="empleado.realizada == 'S' ? 'success' : null" x-small icon>
                                                    <v-icon>
                                                        mdi-thumb-up
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn @click="actualizar_cumplimiento({realizada: 'N', empleado: empleado.nit})"  :color="empleado.realizada == 'N' ? 'error' : null" class="ml-2" x-small icon>
                                                    <v-icon>
                                                        mdi-thumb-down
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
                <AlertMsg v-if="responsables.length <= 0" msg="Debe de seleccionar una actividad" />
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

    import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
    import AlertMsg from '@/components/AlertSeleccion'

    export default {
        components: {
            AlertMsg
        },
        data() {
            return{
                show_search: false
            }
        },
        methods: {
            ...mapMutations('detalle_evaluacion_sgs', [
                'checkSeccionResponsable',
                'checkResponsable'
            ]),
            ...mapActions('detalle_evaluacion_sgs', [
                'actualizar_cumplimiento',
                'eliminar_responsables'
            ])
        },
        computed: {
            ...mapState('detalle_evaluacion_sgs', {
                actividad: state => state.actividad,
                responsables: state => state.responsables
            }),
            ...mapGetters('detalle_evaluacion_sgs', [
                'responsables_marcados'
            ])
        }
    }
</script>