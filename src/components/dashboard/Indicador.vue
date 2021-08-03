<template>
    <div>
        <v-card outlined>
            <v-card-text>
                <v-row style="height: 80px" align="start">
                    <v-col cols="9">
                        <h4>ESTADO DE DESARROLLO</h4>
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
                                PUNTAJE MENSUAL: {{ colaborador.total_mensual.toFixed(2) }} PUNTOS
                            </strong>
                        </small>
                    </v-col>
                    <v-col cols="4">
                        <v-rating
                            background-color="orange lighten-3"
                            color="orange"
                            size="18"
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
                                PUNTAJE ANUAL: {{ colaborador.total_mensual.toFixed(2) }} PUNTOS
                            </strong>
                        </h5>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    export default {
        props: {
            colaborador: Object
        },
        data(){
            return{
                criterios: ['PRODUCTIVIDAD', 'CERTIFICACIONES', 'DESEMPEÑO', 'SSO', 'COMPETENCIAS', 'CONVIVENCIA'],
                knowledge: 33,
            }
        }
    }
</script>