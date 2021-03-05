<template>
    <div>
        <v-container>
            <v-form @submit.prevent="registrar()">
                <v-row dense class="pb-0">
                    <v-col>
                         <v-card outlined>
                            <v-card-text>
                                <v-row dense>
                                    <v-col>
                                        <v-autocomplete v-model="codarea" :items="areas" item-text="descripcion" item-value="codarea" hide-details filled label="Procesos" @change="obtener_colaboradores()"></v-autocomplete>
                                    </v-col>
                                    <v-col>
                                        <v-autocomplete :items="colaboradores" item-text="nombre_completo" item-value="nit" hide-details filled label="Colaborador"></v-autocomplete>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                    </v-col>
                </v-row>
                <v-row class="mt-2">
                    <v-col v-if="criterio.metodo_calificacion == 'verificacion'">
                        <v-btn-toggle>
                            <v-btn>
                                <v-icon>mdi-check-all</v-icon>
                            </v-btn>
                        </v-btn-toggle>
                    </v-col>
                    <v-col class="pb-0" v-for="(item, key) in items" :key="key" cols="12">
                        
                        <v-card outlined v-if="criterio.metodo_calificacion == 'ponderacion'">
                            <v-card-text class="headline pb-0">
                                {{ item.descripcion }}
                            </v-card-text>
                            <v-card-text  class="pt-0 text-center">
                                <v-row align="center" justify="center">
                                    <v-col cols="8">
                                        <v-radio-group
                                            row
                                            hide-details
                                        >
                                            <v-radio
                                                label="Excelente"
                                                value="4"
                                                
                                            ></v-radio>
                                            <v-radio
                                                label="Bueno"
                                                value="3"
                                            ></v-radio>
                                            <v-radio
                                                label="Regular"
                                                value="2"
                                                
                                            ></v-radio>
                                            <v-radio
                                                label="Malo"
                                                value="1"
                                            ></v-radio>
                                        </v-radio-group>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <!-- <v-card outlined v-if="criterio.metodo_calificacion == 'verificacion'">
                            <v-card-text class="pt-0 pb-0">
                                <v-row dense align="center">
                                    <v-col cols="1">
                                        <v-btn :color="item.check ? 'success' : 'secondary'" @click="item.check = !item.check" icon>
                                            <v-icon>
                                                {{ !item.check ? 'mdi-checkbox-blank-circle-outline' : 'mdi-checkbox-marked-circle' }}
                                            </v-icon>
                                        </v-btn>
                                    </v-col>
                                    <v-col>
                                        <h3>
                                            {{ item.descripcion }}
                                        </h3>
                                    </v-col>
                                    
                                </v-row>
                            </v-card-text>
                        </v-card> -->

                        <v-row align="center" v-if="criterio.metodo_calificacion == 'verificacion'" >
                            <v-col cols="8">
                                <v-btn @click="item.check = !item.check" :color="item.check ? 'success' : ''" block>
                                    {{ item.descripcion }}
                                </v-btn>
                            </v-col>
                            <v-col cols="2">
                                <v-text-field readonly autocomplete="off" dense hide-details outlined></v-text-field>
                            </v-col>
                            <v-col>
                                <v-btn small color="blue darken-4" icon>
                                    <v-icon>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                                <v-btn class="ml-4" small color="info" icon>
                                    <v-icon>
                                        mdi-message
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>

                    <!-- Calificación -->
                    <v-col>
                        <v-row>
                            <v-col cols="8" class="text-right">
                                <h1>Total: </h1>
                            </v-col>
                            <v-col cols="2" class="text-center">
                                <v-btn large block color="success">
                                    100
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row class="mt-4">
                    <v-col class="text-center">
                        <v-btn @click="$emit('closeModal')" large dark>
                            CANCELAR
                        </v-btn>
                        <v-btn type="submit" large color="primary" class="ml-2">
                            REGISTRAR
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </div>
</template>

<script>

    import request from '@/functions/request'

    export default {
        data(){
            return{
                criterio: {},
                items: [],
                areas: [],
                colaboradores: [],
                codarea: null
            }
        },
        methods: {
            obtener_datos(){

                const data = {
                    url: 'datos_reporte',
                    data: {
                        url: this.$route.name
                    }
                }

                request.post(data)
                .then((response) => {
                    this.criterio = response.data.criterio
                    this.items = response.data.items
                })

            },
            obtener_areas(){

				const data = {
					url: 'obtener_areas',
					data: null
				}

				request.post(data)
				.then((response) => {
					this.areas = response.data
				})

			},
            registrar(){



            },
            obtener_colaboradores(){

				const data = {
					url: 'obtener_colaboradores',
					data: {
						codarea: this.codarea
					}
				}

				request.post(data)
				.then((response) => {
					this.colaboradores = response.data
				})

			},
        },
        mounted(){

            this.obtener_datos()
            this.obtener_areas()
        }
    }
</script>

<style>

</style>