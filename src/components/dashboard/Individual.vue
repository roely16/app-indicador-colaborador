<template>
    <div>
        <v-card v-if="!isLoading" outlined>
            <v-card-text>
                <v-row style="height: 80px" align="start">
                    <v-col cols="9">
                        <h3>ESTADO DE DESARROLLO</h3>
                        <h5>NOMBRE: {{ colaborador.nombre }} {{ colaborador.apellido }}</h5>
                    </v-col>
                    <v-col>
                        <v-avatar>
                            <v-img v-if="!colaborador.imagen64" src="@/assets/img/avatar.png"></v-img>
                            <v-img v-if="colaborador.imagen64" :src="colaborador.imagen64"></v-img>
                        </v-avatar>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-text>
                <v-row>
                    <v-col cols="5">
                        <v-chip small label  color="yellow darken-1">
                            CRITERIO
                        </v-chip>
                    </v-col>
                    <v-col>
                        <v-chip small label color="yellow darken-1">
                            RESULTADO
                        </v-chip>
                    </v-col>
                </v-row>
                <v-row class="mt-2" dense v-for="(criterio, key) in colaborador.criterios" :key="key">
                    <v-col cols="5">
                        <h5>
                            {{ criterio.nombre }}
                            <v-tooltip v-if="criterio.motivo" bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="error" x-small v-bind="attrs" v-on="on">
                                        mdi-information
                                    </v-icon>
                                </template>
                                <span class="mb-0 pb-0">
                                    MOTIVO
                                </span>
                                <hr class="mt-2 mb-2">
                                <span>
                                    {{ criterio.motivo }}
                                </span>
                            </v-tooltip>
                        </h5>
                    </v-col>
                    <v-col>
                        <v-progress-linear
                            :value="criterio.calificacion"
                            height="25"
                            :color="criterio.color"
                        >
                            <strong v-if="!criterio.pendiente">{{ Math.round(criterio.calificacion) }}</strong>
                            <v-icon v-if="criterio.pendiente" size="15">
                                mdi-account-clock
                            </v-icon>
                        </v-progress-linear>
                    </v-col>
                    
                </v-row>

                <v-divider class="mt-4"></v-divider>
            </v-card-text>

            <v-card-text class="mt-0 pt-0">
                <v-row dense>
                    <v-col cols="8">
                        <small>
                            <strong>
                                PUNTAJE MENSUAL: {{ colaborador.total_mensual.toFixed(2) }}
                            </strong>
                        </small>
                    </v-col>
                    <v-col cols="4" align="end">
                        <v-rating
                            background-color="orange lighten-3"
                            color="orange"
                            size="15"
                            dense
                            :value="colaborador.stars"
                            readonly
                            half-increments
                        ></v-rating>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12">
                        <h5>
                            <strong>
                                PUNTAJE ANUAL: 
                                <v-tooltip right>
                                    <template v-slot:activator="{on, attrs}">
                                        <span v-bind="attrs" v-on="on">{{ colaborador.total_anual.toFixed(2) }}</span>
                                    </template>
                                    <div v-for="(date, key) in colaborador.dates" :key="key">
                                        <span>{{ date }}</span>
                                    </div>
                                </v-tooltip>
                            </strong>
                        </h5>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-card v-if="!nit">
            <v-card-text>
                <span class="overline">
                    DEBE DE PROPORCIONAR UN NÚMERO DE NIT
                </span>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

    import request from '@/functions/request'

    import { mapActions } from 'vuex'

    export default {
        props: {
            nit: String
        },
        data(){
            return{
                criterios: ['PRODUCTIVIDAD', 'CERTIFICACIONES', 'DESEMPEÑO', 'SSO', 'COMPETENCIAS', 'CONVIVENCIA'],
                colaborador: {},
                isLoading: false
            }
        },
        methods: {
            ...mapActions('dashboard', [
                'updateDashboard'
            ]),
            obtener_datos(){

                this.isLoading = true

                this.updateDashboard({date: this.$store.getters.getFecha, nit: this.nit})
				.then(() => {

                    const data = {
                        url: 'indicador_individual',
                        data: {
                            nit: this.nit,
                            fecha: this.$store.getters.getFecha
                        }
                    }

                    request.post(data)
                    .then((response) => {
                        this.colaborador = response.data
                        this.isLoading = false

                        const data_ = {
                            url: 'puntaje_anual',
                            data: {
                                empleado: this.colaborador
                            }
                        }

                        request.post(data_)
                        .then((response) => {
                            console.log(response.data)
                            this.colaborador = response.data
                        })
                    })

                })

            }

        },
        
        created(){

            this.obtener_datos()

        }
    }
</script>