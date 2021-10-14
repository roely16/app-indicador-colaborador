<template>
    <div>
        <v-container>
            <v-row dense>
                <AlertMsg v-if="actividades.length <= 0" msg="No se han encontrado actividades disponibles"></AlertMsg>
                <v-col v-for="(actividad, key) in actividades" :key="key" cols="12">
                    <v-card @click="seleccionar_actividad(actividad)" outlined>
                        <v-card-title>
                            <v-row>
                                <v-col cols="10">
                                    {{ actividad.nombre }}
                                </v-col>
                                <v-col align="end">
                                    <v-icon v-if="actividad.check" color="success">
                                        mdi-check-circle
                                    </v-icon>
                                </v-col>
                            </v-row>
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class="mt-4">
                <v-col class="text-center">
                    <v-btn @click="$emit('closeModal')" large dark>
                        CANCELAR
                    </v-btn>
                    <v-btn :disabled="actividades_seleccionadas_get.length <= 0" @click="agregar_actividades" large color="primary" class="ml-2">
                        AGREGAR
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

    import { mapState, mapActions, mapGetters } from 'vuex' 
    import AlertMsg from '@/components/AlertSeleccion'

    export default{
        components: {
            AlertMsg
        },
        methods: {
            ...mapActions('detalle_evaluacion_sgs', [
                'agregar_actividades'
            ]),
            seleccionar_actividad(actividad){
                actividad.check = !actividad.check
            }
        },
        computed: {
            ...mapState('detalle_evaluacion_sgs', {
                actividades: state => state.actividades_disponibles
            }),
            ...mapGetters('detalle_evaluacion_sgs', [
                'actividades_seleccionadas_get'
            ])
        }
    }
</script>