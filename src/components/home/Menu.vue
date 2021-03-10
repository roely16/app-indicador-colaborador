<template>
    <div>
        <!-- <v-row dense>
            <v-col>
                <v-row dense>
                    <v-col cols="12">
                        <v-chip small label>
                            HERSON ROELY CHUR CHINCHILLA
                        </v-chip>                        
                    </v-col>
                    <v-col cols="12">
                        <v-chip small label>
                            COORDINACIÓN DE INFORMATICA
                        </v-chip>
                    </v-col>
                </v-row>
            </v-col>
        </v-row> -->

        <v-banner
                single-line
            >
                <v-icon
                slot="icon"
                color="teal "
                size="36"
                >
                mdi-account
                </v-icon>

                    <p class="overline mt-0 mb-0 pt-0 pb-0">
                        {{ user_data.nombre }} {{ user_data.apellido }}
                    </p>
                    <p class="overline mt-0 mb-0 pt-0 pb-0" style="line-height: 1">
                        <small>
                            {{ user_data.seccion.descripcion }}
                        </small>
                    </p>

                <template v-slot:actions>
                    <v-btn
                        color="orange darken-1"
                        icon
                    >
                        <v-icon>
                            mdi-bell
                        </v-icon>
                    </v-btn>
                </template>
            </v-banner>
        <v-row class="mt-4">
            <v-col cols="12" md="4" sm="6" v-for="(item, i) in menu" :key="i">
                <v-card
                    :color="item.color"
                    dark
                >
                    <div class="d-flex flex-no-wrap justify-space-between">
                        <div>
                            <v-card-title
                                class="headline"
                                v-text="item.nombre"
                            ></v-card-title>

                            <v-card-subtitle v-text="item.artist"></v-card-subtitle>

                            <v-card-actions>
                            
                            <v-btn
                                class="ml-2 mt-5"
                                outlined
                                rounded
                                small
                                :to="{ name: item.url }"
                            >
                                INGRESAR
                            </v-btn>
                            </v-card-actions>
                        </div>

                        <v-avatar
                            class="ma-3"
                            size="125"
                            tile
                        >
                            <v-img :src="require('@/assets/img/' + item.icono)"></v-img>
                        </v-avatar>
                    </div>
                </v-card>

            </v-col>
        </v-row>
    </div>
</template>

<script>

    import request from '@/functions/request'

    export default {

        data(){
            return{

                items: [
                    {
                    color: '#1F7087',
                    src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
                    title: 'Supermodel',
                    artist: 'Foster the People',
                    },
                    {
                    color: '#952175',
                    src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
                    title: 'Halcyon Days',
                    artist: 'Ellie Goulding',
                    },
                ],
                menu: []

            }
        },
        methods: {

            obtener_menu(){

                const data = {
                    url: 'obtener_menu',
                    data: null
                }

                request.post(data)
                .then((response) => {
                    console.log(response.data)
                    this.menu = response.data
                })

            }

        },
        computed: {
            user_data: function(){

                const data = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

                return data
            }
        },
        mounted(){

            this.obtener_menu()

        }
    }
</script>

<style>

</style>