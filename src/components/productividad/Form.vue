<template>
    <div>
        <v-container>
            <v-form @submit.prevent="registrar()" v-model="valid" ref="form">
                <v-row dense class="pb-0">
                    <v-col>
                         <v-card outlined>
                            <v-card-text>
                                <Filtro :disabled_seccion="!secciones" ref="filtro" @getCodarea="(value) => { codarea = value }" @getNit="(value) => { nit_colaborador = value }"></Filtro>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row v-if="nit_colaborador" class="mt-2">
                    
                    <!-- Mostrar detalle de Sección, si es asesor o si es ISO -->

                    <v-col cols="12">
                        <v-chip dark :color="detalle_colaborador.iso == '1' ? 'blue' : 'deep-orange darken-1'" label>
                            {{ detalle_colaborador.iso == '1' ? 'ISO' : 'NO ISO' }}
                        </v-chip>
                        <v-chip dark :color="detalle_colaborador.asesor == '1' ? 'cyan darken-4' : 'blue-grey darken-2'" label class="ml-2">
                            {{ detalle_colaborador.asesor == '1' ? 'ASESOR' : 'COLABORADOR' }}
                        </v-chip>
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
                                            v-model="item.calificacion"
                                            :rules="[v => !!v]"
                                        >
                                            <v-radio
                                                :label="calificacion.nombre"
                                                :value="calificacion.valor"
                                                v-for="(calificacion, key) in item.calificaciones"
                                                :key="key"
                                            ></v-radio>
                                            
                                        </v-radio-group>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <v-row align="center" v-if="criterio.metodo_calificacion == 'verificacion'" >
                            <v-col cols="8">
                                <v-btn :dark="item.check" @click="click_item(item)" :color="item.check ? 'red' : ''" block>
                                    {{ item.descripcion }}
                                </v-btn>
                            </v-col>
                            <v-col cols="2">
                                <v-text-field type="number" class="centered-input" v-model="item.calificacion" :disabled="!item.editable" autocomplete="off" dense hide-details outlined></v-text-field>
                            </v-col>
                            <v-col>
                                <v-btn @click="item.editable = !item.editable" x-small color="blue darken-4" icon>
                                    <v-icon>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                                <v-btn @click="item.show_description = !item.show_description" class="ml-4" x-small color="info" icon>
                                    <v-icon>
                                        mdi-message
                                    </v-icon>
                                </v-btn>
                            </v-col>
                            <v-col v-if="item.show_description" cols="8">
                                <v-textarea outlined :rows="3" hint="Máximo 500 caracteres" persistent-hint></v-textarea>
                            </v-col>
                        </v-row>
                    </v-col>

                    <!-- Calificación -->
                    <v-col  v-if="criterio.metodo_calificacion == 'verificacion'">
                        <v-row>
                            <v-col cols="8" class="text-right">
                                <h1>Total: </h1>
                            </v-col>
                            <v-col cols="2" class="text-center">
                                <v-btn large block color="success">
                                    {{ total_evaluacion }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row v-if="!nit_colaborador" align="center" justify="center">
                    <v-col cols="12">
                        <v-row justify="center">
                            <v-col cols="2">
                                <v-img src="@/assets/img/info.png"></v-img>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col class="text-center" cols="6">
                        <p class="overline">
                            Debe de seleccionar primero a un colaborador.
                        </p>
                    </v-col>
                </v-row>

                <v-row class="mt-4">
                    <v-col class="text-center">
                        <v-btn @click="$emit('closeModal')" large dark>
                            CANCELAR
                        </v-btn>
                        <v-btn :disabled="!nit_colaborador" type="submit" large color="primary" class="ml-2">
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
    import Filtro from '@/components/Filtro'

    export default {
        components: {
            Filtro
        },
        props: {
            closed: Boolean,
            secciones: Boolean
        },
        data(){
            return{
                criterio: {},
                items: [],
                areas: [],
                colaboradores: [],
                codarea: null,
                check_all: false,
                nit_colaborador: null,
                valid: true,
                detalle_colaborador: {}
            }
        },
        methods: {
            obtener_datos(){

                const data = {
                    url: 'datos_reporte',
                    data: {
                        url: this.$route.name,
                        nit: this.nit_colaborador
                    }
                }

                request.post(data)
                .then((response) => {
                    this.criterio = response.data.criterio
                    this.items = response.data.items
                    this.detalle_colaborador = response.data.detalle_colaborador
                })

            },
            registrar(){

                this.$refs.form.validate()

                if (this.valid) {
                    
                    const url = this.$route.name

                    const data = {
                        url: 'registrar_evaluacion',
                        data: {
                            url: url,
                            items: this.items,
                            id_persona: this.nit_colaborador,
                            criterio: this.criterio
                        }
                    }

                    request.post(data)
                    .then((response) => {

                        alert.show(response.data)
                        .then(() => {
                            this.$emit('update')
                        })
                        
                    })

                }
                
            },
            marcar_todos(){

                this.check_all = !this.check_all

                this.items.forEach(item => {

                    item.check = this.check_all
                    

                });

            },
            click_item(item){

                item.check = !item.check

                item.calificacion = item.check ? 0 : 100

            }
        },
        watch: {
            closed: function(){

                if (!closed) {

                    this.obtener_datos()

                }

            },
            nit_colaborador: function(val){

                console.log(val);

                if (val) {
                    
                    this.obtener_datos()

                }

            }

        },
        computed: {
            total_evaluacion: function(){
                
                let total = 0

                this.items.forEach(item => {
                    
                    console.log(item)

                    total += (parseInt(item.calificacion) * item.valor)

                });

                let result = total / this.criterio.valor

                return result > 100 ? 100 : result.toFixed(2)

            }
        },
        mounted(){

            //this.obtener_datos()

        }
    }
</script>

<style>
    .centered-input input {
        text-align: center
    }
</style>