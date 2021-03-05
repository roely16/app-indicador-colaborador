<template>
    <div>
        <v-card>
            <v-card-text>
                <v-row align="center">
                    <v-col cols="9">
                        <h3>ESTADO DE DESARROLLO</h3>
                        <h5>NOMBRE: {{ colaborador.nombre }} {{ colaborador.apellido }}</h5>
                    </v-col>
                    <v-col>
                        <v-avatar>
                            <img
                                :src="require('@/assets/img/profile.png')"
                            >
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
                <v-row class="mt-2" dense v-for="(criterio, key) in criterios" :key="key">
                    <v-col cols="5">
                        <h5>
                            {{ criterio }}
                        </h5>
                    </v-col>
                    <v-col>
                        <v-progress-linear
                            v-model="knowledge"
                            height="25"
                            >
                            <strong>{{ Math.ceil(knowledge) }}</strong>
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
                                PUNTAJE MENSUAL: 30 PUNTOS
                            </strong>
                        </small>
                    </v-col>
                    <v-col cols="4">
                        <v-rating
                            background-color="orange lighten-3"
                            color="orange"
                            size="18"
                            dense
                        ></v-rating>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12">
                        <h4>
                            PUNTAJE ANUAL: 30 PUNTOS
                        </h4>
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