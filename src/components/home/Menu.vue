<template>
    <div>
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
        mounted(){

            this.obtener_menu()

        }
    }
</script>

<style>

</style>