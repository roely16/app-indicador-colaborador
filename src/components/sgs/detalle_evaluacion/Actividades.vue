<template>
    <div>
        <v-card height="700" max-height="700">
            <v-card-title>
                <v-row>
                    <v-col>
                        Actividades
                    </v-col>
                    <v-col align="end">
                        <v-btn :disabled="!actividad_select" @click="eliminar_actividad()" icon color="error">
                            <v-icon>
                                mdi-delete
                            </v-icon>
                        </v-btn>
                        <v-btn @click="mostrar_modal" color="primary" icon>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-card :color="actividad.check ? '#385F73' : null" :dark="actividad.check" class="mb-2" v-for="(actividad, key) in actividades" :key="key" outlined min-height="50">
                    <v-card-title class="pointer" @click="obtener_responsables(actividad)">
                        {{ actividad.nombre }}
                    </v-card-title>

                    <v-card-text>

                       <v-row align="center">
                            <v-col cols="4">
                                <v-text-field autocomplete="off" type="number" @change="actualizar_porcentaje(actividad)" v-model="actividad.porcentaje" outlined dense hide-details label="%"></v-text-field>
                            </v-col>
                            <v-col align="end">
                                
                            </v-col>
                        </v-row>

                    </v-card-text>
                </v-card>

                <AlertMsg v-if="actividades.length <= 0" msg="Aún no se han agregado actividades" />
            </v-card-text>
        </v-card>

        <Modal 
            :title="title"
            :width="width"
            ref="modal"
        >
            <template #form>
                <ListaActividades />
            </template>
        </Modal>
    </div>
</template>

<style scoped>
    .pointer{
        cursor: pointer;
    }
</style>

<script>

    import { mapState, mapActions } from 'vuex'
    import AlertMsg from '@/components/AlertSeleccion'
    import Modal from '@/components/Modal'
    import ListaActividades from '@/components/sgs/detalle_evaluacion/ListaActividades'

    export default {
        components: {
            AlertMsg,
            Modal,
            ListaActividades
        },
        data() {
            return{
                title: null,
                width: null
            }
        },
        methods: {

            ...mapActions('detalle_evaluacion_sgs', [
                'obtener_actividades_disponibles',
                'obtener_responsables',
                'actualizar_porcentaje',
                'eliminar_actividad'
            ]),
            mostrar_modal(){

                this.title = "Actividades Disponibles"
                this.width = 600

                this.obtener_actividades_disponibles()

                this.$refs.modal.show()

            }
        },  
        computed: {
            ...mapState('detalle_evaluacion_sgs', {
                actividades: state => state.actividades,
                actividad_select: state => state.actividad_select
            })
        }
    }
</script>