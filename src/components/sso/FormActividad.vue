<template>
    <div>
        <v-container>
            <v-form ref="form" @submit.prevent="!id_actividad ? registrar() : editar()" v-model="valid">
                <v-row class="mt-2">
                    <v-col cols="12">
                        <v-text-field autocomplete="off" v-model="actividad.nombre" :rules="[v => !!v]" label="Nombre" outlined hide-details></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="date"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="date"
                                    label="Fecha de Cumplimiento"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    outlined
                                    hide-details
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="date"
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
                                    @click="$refs.menu.save(date)"
                                >
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-menu>
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
    import alert from '@/functions/alert'

    export default {
        props: {
            id_grupo: Number,
            id_actividad: String
        },
        data(){
            return{
                valid: true,
                actividad: {
                    nombre: null,
                    fecha: null
                },
                date: new Date().toISOString().substr(0, 10),
                menu: false,
            }
        },
        methods: {

            registrar(){

                this.$refs.form.validate()

                if (this.valid) {
                    
                    this.actividad.fecha = this.date
                    this.actividad.id_grupo = this.id_grupo

                    const data = {
                        url: 'registrar_actividad',
                        data: this.actividad
                    }

                    request.post(data)
                    .then((response) => {
                        console.log(response.data)

                        if (response.data.status == 200) {
                            
                            alert.show(response.data)
                            .then(() => {
                                this.$emit('updateData')
                            })

                        }
                        
                    })

                }

            },
            clear(){

                this.actividad = {
                    nombre: null,
                    fecha: null
                }

                this.date = new Date().toISOString().substr(0, 10)

                this.$refs.form.resetValidation()

            },
            detalle(){

                const data = {
                    url: 'detalle_actividad',
                    data: {
                        id_actividad: this.id_actividad
                    }
                }

                request.post(data)
                .then((response) => {
                    this.actividad = response.data
                    this.date = response.data.fecha
                    console.log(response.data)
                })

            },
            editar(){

                this.$refs.form.validate()

                if (this.valid) {

                    this.actividad.fecha = this.date

                    const data = {
                        url: 'editar_actividad',
                        data: this.actividad
                    }

                    request.post(data)
                    .then((response) => {
                        
                        if (response.data.status == 200) {
                            
                            alert.show(response.data)
                            .then(() => {

                                this.$emit('updateData')

                            })

                        }

                    })

                }

            }

        },
        watch: {

            id_actividad: function(val){

                if (val) {
                    
                    this.detalle()
                    
                }

            }

        },
        created(){

            if (this.id_actividad) {
                
                this.detalle()

            }

        }
    }
</script>

<style>

</style>