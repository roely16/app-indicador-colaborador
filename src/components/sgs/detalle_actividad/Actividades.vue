<template>
    <div>
        <v-card min-height="500">
            <v-card-title>
                <v-row>
                    <v-col>
                        Actividades
                    </v-col>
                    <v-col align="end">
                        <v-btn color="primary" icon>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-card v-for="(actividad, key) in actividades" :key="key" outlined min-height="50"></v-card>

                <AlertMsg v-if="actividades.length <= 0" msg="Aún no se han agregado actividades" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

    import { mapState } from 'vuex'
    import AlertMsg from '@/components/AlertSeleccion'

    export default {
        components: {
            AlertMsg
        },
        data() {
            return{

            }
        },
        computed: {
            ...mapState('detalle_evaluacion_sgs', {
                actividades: state => state.actividades
            })
        }
    }
</script>