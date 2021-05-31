<template>

    <div class="background">
        
        <v-app-bar
            color="teal darken-1"
            dark
            height="70"
        >
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>
                ESTADO DE DESARROLLO
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn @click="redirect()" icon>
                <v-icon>mdi-home</v-icon>
            </v-btn>

        </v-app-bar>
        <div class="container">
            
            <v-card shaped elevation="5">
                <v-card-text>

                        <v-row class="mt-4">
                            <v-col class="text-center" cols="12">
                                <span class="text-h3">Indicadores de Estado de Desarrollo</span>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="text-right mr-4">
                                <v-chip label color="success">
                                    {{ date }}
                                </v-chip>
                                <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :return-value.sync="date"
                                    transition="scale-transition"
                                    left
                                    max-width="290px"
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn x-large icon v-bind="attrs" v-on="on">
                                            <v-icon>
                                                mdi-calendar
                                            </v-icon>
                                        </v-btn>
                                
                                    </template>
                                    <v-date-picker
                                        v-model="date"
                                        type="month"
                                        no-title
                                        scrollable
                                    >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="menu = false"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="() => {
                                            $refs.menu.save(date)

                                            this.$store.commit('setFecha', date)
                                            reload()
                                        }"
                                    >
                                        OK
                                    </v-btn>
                                    </v-date-picker>
                                </v-menu>
                                <v-btn @click="reload()" icon x-large>
                                    <v-icon>
                                        mdi-reload
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>

                </v-card-text>

                <v-divider></v-divider>

                <v-card-text>

                    <v-row fill-height>
                        <v-col cols="4" v-for="(integrante, key) in equipo" :key="key">
                            <Individual v-if="integrante.nit" :nit="integrante.nit" ref="indicador"></Individual>
                        </v-col>
                    </v-row>

                </v-card-text>
        </v-card>
            
        
        </div>
    </div>
</template>

<script>

    import Individual from '@/components/dashboard/Individual.vue'

    import request from '@/functions/request'

    export default {
        components: {
            Individual
        },
        data(){
            return{

                date: this.$store.getters.getFecha,
                menu: false,
                modal: false,
                nit: null,
                equipo: []
            }
        },
        methods: {

            redirect(){

                window.location.replace("http://172.23.25.31/GestionServicios")

            },
            reload(){

                //this.$refs.indicador.obtener_datos()

            },
            obtener_equipo(){

                const data = {
                    url: 'equipo_indicadores',
                    data: {
                        nit: this.nit
                    }
                }

                request.post(data)
                .then((response) => {
                    
                    this.equipo = response.data

                })

            }

        },
        computed: {
            globalDate(){

                return this.$store.getters.getFecha

            }
        },
        mounted(){
                        
            const param = this.$route.params.nit

            const nit = atob(param)
            
            this.nit = nit

            // Obtener el equipo
            this.obtener_equipo()

        }
    }
</script>

<style>
    .background{
        height: 100vh;
    }
    .container{
        padding: 2rem;
    }
</style>