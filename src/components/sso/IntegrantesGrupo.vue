<template>
    <div>
        <v-card min-height="700" outlined>
            <v-card-text>
                <v-row>
                    <v-col>
                        <span class="overline">Integrantes</span>
                    </v-col>
                    <v-col align="end">
                        <v-btn @click="enable_check = !enable_check" icon>
                            <v-icon>
                                {{ enable_check ? 'mdi-account-multiple-remove' : 'mdi-account-multiple-check' }}
                            </v-icon>
                        </v-btn>
                        <v-btn icon>
                            <v-icon>
                                mdi-format-list-checks
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-text>
                <v-card class="mb-2" v-for="(seccion, index) in secciones" :key="index">
                    <v-card-text>
                        <v-row align="center">
                            <v-col v-if="enable_check" cols="1">
                                <v-btn @click="check_seccion(seccion)" icon>
                                    <v-icon>
                                        {{ seccion.check ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline' }}
                                    </v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="8">
                                <span class="overline">
                                    {{ seccion.nombre }}
                                </span>
                            </v-col>
                            <v-col align="end">
                                <v-btn @click="seccion.expand = !seccion.expand" small icon>
                                    <v-icon>
                                        {{ !seccion.expand ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row v-if="seccion.expand">
                            <v-col cols="12" v-for="(integrante, key) in seccion.integrantes" :key="key">
                                <v-row align="center">
                                    <v-col v-if="enable_check" cols="1">
                                        <v-btn @click="integrante.check = !integrante.check" icon>
                                            <v-icon>
                                                {{ integrante.check ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline' }}
                                            </v-icon>
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="1" class="mr-4">
                                        <v-badge
                                            color="green accent-4"
                                            icon="mdi-check"
                                            avatar
                                            bordered
                                            overlap
                                            :value="false"
                                        >
                                            <v-avatar size="40">
                                                <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
                                            </v-avatar>
                                        </v-badge>
                                    </v-col>
                                    <v-col cols="8">
                                        {{ integrante.nombre }}
                                    </v-col>
                                    <v-col align="end">
                                        
                                    </v-col>
                                </v-row>
                                <v-divider class="mt-2"></v-divider>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

    import request from '@/functions/request'

    export default {
        props: {
            id_grupo: Number
        },
        data(){
            return{
                secciones: [],
                enable_check: false
            }
        },
        methods: {

            obtener_integrantes(){

                const data = {
                    url: 'integrantes_grupo',
                    data: {
                        id_grupo: this.id_grupo
                    }
                }

                request.post(data)
                .then((response) => {
                    this.secciones = response.data
                })

            },
            check_seccion(seccion){

                seccion.check = !seccion.check

                seccion.integrantes.forEach(integrante => {
                    
                    integrante.check = seccion.check

                });

            }

        },
        computed: {

            checked: function(){

                let checked = []

                this.secciones.forEach(seccion => {
                    
                    let temp = seccion.integrantes.filter( integrante => integrante.check)
                    
                    if (temp.length > 0 ) {
                        
                        temp.forEach(element => {
                            
                            checked.push(element)

                        });

                    }

                });

                return checked

            }

        },
        created(){

            this.obtener_integrantes()

        }
    }
</script>

<style>

</style>