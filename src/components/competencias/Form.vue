<template>
    <div>

        <v-container>
            <v-row class="mt-2" >
                <v-col cols="8">
                    <v-card outlined min-height="600">
                        <v-card-text>
                            <Filtro :id_colaborador="id_colaborador" :disabled_seccion="!secciones" :disabled_colaborador="id_colaborador ? true : false" ref="filtro" @getCodarea="(value) => { codarea = value }" @getNit="(value) => { nit_colaborador = value }"></Filtro>
                            
                            <v-row dense class="mt-2">
                                <v-col>
                                    <v-text-field readonly v-model="perfil" autocomplete="off" hide-details outlined single-line label="Perfil de Servicios"></v-text-field>
                                </v-col>
                                 <v-col>
                                    <v-text-field autocomplete="off" hide-details outlined single-line label="Período de Evaluación"></v-text-field>
                                </v-col>
                            </v-row>
                            
                            <v-divider class="mt-4"></v-divider>
                        </v-card-text>

                        <v-card-text class="pt-0 mt-0">
                            <small class="overline">
                                CALIFICAR AL COLABORADOR CON BASE A LA PONDERACIÓN ASIGNADA EN CADA SECCIÓN
                            </small>
                            <v-row
                                no-gutters
                                style="height: 40px;"
                            >
                                <v-col
                                v-for="(item, key) in ponderacion"
                                :key="key"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                    >
                                        <small>
                                            {{ item.value }}. {{ item.text }}
                                        </small>
                                    </v-card>
                                </v-col>
                            </v-row>

                            <v-divider class="mt-4"></v-divider>

                        </v-card-text>

                        <v-card-text>
                            
                            <v-expansion-panels>
                                <v-expansion-panel
                                    v-for="(tipo, key) in tipos_competencias"
                                    :key="key"
                                >
                                <v-expansion-panel-header>
                                    <span class="overline">
                                        {{ tipo.nombre }}
                                    </span>
                                </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-row align="center" v-for="(competencia, key) in tipo.competencias" :key="key">
                                            <v-col cols="8">
                                                <span>{{ competencia.nombre }}</span>
                                            </v-col>
                                            <v-col>
                                                <v-select dense outlined single-line hide-details :items="ponderacion"></v-select>
                                            </v-col>
                                            
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>

                        </v-card-text>

                        
                        <v-card-text v-if="tipos_competencias.length > 0">
                            <span class="overline">Calificación por Sección</span>

                            <v-row
                                no-gutters
                                style="height: 40px;"
                                v-for="(tipo, key) in tipos_competencias"
                                :key="key"
                            >
                                <v-col cols="6">
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                    >
                                        {{ tipo.nombre }}
                                    </v-card>
                                </v-col>
                                <v-col>
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                    >
                                        0/50
                                    </v-card>
                                </v-col>
                            </v-row>

                        </v-card-text> -->
                    </v-card>
                </v-col>
                <v-col>
                    <v-card outlined min-height="600">
                        <v-card-text>
                            <div class="text-center overline">
                                CALIFICACIÓN  OBTENIDA
                            </div>
                            <v-sheet>
                                <div class="text-center text-h1 active">
                                    0
                                </div>
                            </v-sheet>
                            
                            <v-divider></v-divider>

                        </v-card-text>

                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-textarea hide-details solo single-line label="Observaciones Complementarias del Calificador" :rows="4"></v-textarea>
                </v-col>
            </v-row>
        </v-container>

    </div>
</template>

<style scoped>
    
</style>

<script>

    import Filtro from '@/components/Filtro'

    import request from '@/functions/request'

    export default {
        components: {
            Filtro
        },
        data(){
            return{
                ponderacion: [
                    {
                        id: 1,
                        text: "EXCELENTE",
                        value: 5
                    },
                    {
                        id: 2,
                        text: "MUY BUENO",
                        value: 4
                    },
                    {
                        id: 3,
                        text: "BUENO",
                        value: 3
                    },
                    {
                        id: 4,
                        text: "REGULAR",
                        value: 2
                    },
                    {
                        id: 5,
                        text: "NO SATISFACTORIO",
                        value: 1
                    }
                ],
                nit_colaborador: null,
                codarea: null,
                id_colaborador: null,
                secciones: null,
                perfil: null,
                tipos_competencias: []
            }
        },
        methods: {

            obtener_perfil(){

                const data = {
                    url: 'obtener_perfil',
                    data: {
                        nit: this.nit_colaborador
                    }
                }

                request.post(data)
                .then((response) => {

                    console.log(response.data);
                    this.perfil = response.data.perfil.nombre
                    this.tipos_competencias = response.data.tipos_competencias

                })

            }

        },
        watch: {

            nit_colaborador: function(val){

                if (val) {
                    
                    this.obtener_perfil()

                }

            }

        }
    }
</script>

<style>

</style>