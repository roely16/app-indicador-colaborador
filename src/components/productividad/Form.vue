<template>
    <div>
        <v-container>
            <v-form @submit.prevent="!id_evaluacion ? registrar() : editar()" v-model="valid" ref="form">
                <v-row dense class="pb-0">
                    <v-col>
                         <v-card outlined>
                            <v-card-text>
                                <Filtro :id_colaborador="id_colaborador" :id_area="id_area" :disabled_seccion="!secciones" :disabled_colaborador="id_colaborador ? true : false" ref="filtro" @getCodarea="(value) => { codarea = value }" @getNit="(value) => { nit_colaborador = value }"></Filtro>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row v-if="nit_colaborador" class="mt-2">
                    
                    <!-- Mostrar detalle de Sección, si es asesor o si es ISO -->

                    <v-col cols="9">
                        <v-chip dark :color="detalle_colaborador.iso == '1' ? 'blue' : 'deep-orange darken-1'" label>
                            {{ detalle_colaborador.iso == '1' ? 'ISO' : 'NO ISO' }}
                        </v-chip>
                        <v-chip dark :color="detalle_colaborador.asesor == '1' ? 'cyan darken-4' : 'blue-grey darken-2'" label class="ml-2">
                            {{ detalle_colaborador.asesor == '1' ? 'ASESOR' : 'COLABORADOR' }}
                        </v-chip>
                    </v-col>

                    <v-col cols="3" align="end">
                         <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="date"
                            transition="scale-transition"
                            origin="top left"
                            left
                            max-width="290px"
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
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
                                @click="$refs.menu.save(date)"
                            >
                                OK
                            </v-btn>
                            </v-date-picker>
                        </v-menu>

                        <v-chip label color="success">
                            {{ date }}
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
                                <v-card outlined :dark="item.check" :color="item.check ? 'red' : ''" block>
                                    <v-card-text>
                                       
                                        <v-row align="center">
                                            <v-col cols="10">
                                                <span class="body-1">
                                                    {{ item.descripcion }}
                                                </span>
                                                <v-chip outlined v-if="item.changed" :color="item.check ? 'white' : 'warning'" label small>Deberá de ingresar una observación</v-chip>
                                            </v-col>
                                            <v-col cols="2" align="end">
                                                <v-btn v-if="item.editable" :color="!item.check ? 'success' : null" icon @click="item.editable ? click_item(item) : null">
                                                    <v-icon>
                                                        {{ !item.check ? 'mdi-check' : 'mdi-close-circle' }}
                                                    </v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>


                                    </v-card-text>

                                    <v-divider></v-divider>

                                    <v-card-text v-if="item.show_description" >
                                        
                                        <v-row align="center">
                                            <v-col cols="8">
                                                <v-textarea hide-details label="Observaciones" single-line v-model="item.comentario" outlined :rows="3" hint="Máximo 500 caracteres" persistent-hint></v-textarea>
                                            </v-col>
                                            
                                            <v-col cols="3" v-if="item.data_calculo">
                                                <v-row align="center">
                                                    <v-col cols="12">
                                                        <v-text-field autocomplete="off" @change="actualizarNota(item)" :rules="[v => !!v]" type="number" :readonly="!item.data_calculo.editable" v-model="item.data_calculo.operados" hide-details dense outlined label="Operados"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" @change="actualizarNota(item)" v-if="item.data_calculo.show_correcciones">
                                                        <v-text-field autocomplete="off" :rules="[v => !!v]" type="number" :readonly="!item.data_calculo.editable" v-model="item.data_calculo.correcciones" hide-details dense outlined label="Correcciones"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" @change="actualizarNota(item)" v-if="item.data_calculo.show_snc">
                                                        <v-text-field autocomplete="off" :rules="[v => !!v]" type="number" :readonly="!item.data_calculo.editable" v-model="item.data_calculo.snc" hide-details dense outlined label="SNC"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>

                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="2">
                                <v-text-field @change="() => {
                                    item.changed = true
                                    item.show_description = true
                                }" type="number" class="centered-input" v-model="item.calificacion" :disabled="!item.editable || item.edit" autocomplete="off" dense hide-details outlined></v-text-field>
                            </v-col>
                            <v-col>
                                <v-btn :disabled="!item.editable" @click="() => {

                                    item.edit = !item.edit 
                                    item.calificacion_bk = item.edit ? item.calificacion_bk : item.calificacion
                                       
                                }" x-small color="blue darken-4" icon>
                                    <v-icon>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                                <v-btn @click="item.show_description = !item.show_description" class="ml-4" x-small :color="item.comentario ? 'info' : 'secondary'" icon>
                                    <v-icon>
                                        mdi-message
                                    </v-icon>
                                </v-btn>

                                <v-tooltip v-if="item.info_calculo" bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                            class="ml-4"
                                            x-small
                                            color="error"
                                            icon
                                            v-bind="attrs"
                                            v-on="on"
                                        >
                                            <v-icon>
                                                mdi-information
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>
                                        
                                        {{ item.info_calculo }}

                                        <div v-if="item.motivos.length > 0">
                                            <hr class="mt-2 mb-2">
                                            <span v-for="(motivo, key) in item.motivos" :key="key">
                                                {{ motivo.descripcion }}
                                                <br>
                                            </span>
                                            
                                        </div>   
                                    </span>
                                </v-tooltip>

                                
                            </v-col>
                            
                        </v-row>

                        <!-- <v-row align="center">

                            <v-col cols="12">
                                <v-card outlined class="mb-4">

                                    <v-card-text>

                                        

                                    </v-card-text>
                                </v-card>
                            </v-col>

                        </v-row> -->
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
            secciones: Boolean,
            id_evaluacion: String,
            id_colaborador: String,
            id_area: String
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
                detalle_colaborador: {},
                date: new Date().toISOString().substr(0, 7),
                menu: false,
                modal: false,
            }
        },
        methods: {
            obtener_datos(){

                const data = {
                    url: 'datos_reporte',
                    data: {
                        url: this.$route.name,
                        nit: this.nit_colaborador,
                        month: this.date
                    }
                }

                request.post(data)
                .then((response) => {

                    this.criterio = response.data.criterio
                    this.items = response.data.items
                    this.detalle_colaborador = response.data.detalle_colaborador

                    this.$refs.form.resetValidation()

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
                            criterio: this.criterio,
                            month: this.date,
                            calificacion: this.total_evaluacion
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

            },
            detalle_evaluacion(){

                const data = {
                    url: 'detalle_reporte',
                    data: {
                        id_evaluacion: this.id_evaluacion,
                        nit: this.id_colaborador,
                    }
                }

                request.post(data)
                .then((response) => {

                    this.criterio = response.data.criterio
                    this.items = response.data.items

                    this.detalle_colaborador = response.data.detalle_colaborador

                    this.date = response.data.evaluacion.mes
                    
                })

            },
            editar(){

                this.$refs.form.validate()

                if (this.valid) {

                    const data = {
                        url: 'editar_evaluacion',
                        data: {
                            items: this.items,
                            nit: this.id_colaborador,
                            id_evaluacion: this.id_evaluacion,
                            criterio: this.criterio,
                            month: this.date,
                            calificacion: this.total_evaluacion
                        }
                    }

                    request.post(data)
                    .then((response) => {

                        if (response.data.status == 200) {
                            
                            alert.show(response.data)
                            .then(() => {
                                this.$emit('update')
                                this.$emit('closeModal')
                            })

                        }
                        
                    })

                }

            },
            setFiltro(){
                
                console.log('set filtro');

            },
            actualizarNota(item){

                // Si es SNC
                if (item.data_calculo.show_snc) {
                    
                    item.calificacion = 100 - (100 * (item.data_calculo.snc / item.data_calculo.operados))

                    item.calificacion = item.calificacion.toFixed(2)

                }

                // Si es corrección
                if (item.data_calculo.show_correcciones) {
                    
                    item.calificacion = 100 - (100 * (item.data_calculo.correcciones / item.data_calculo.operados))

                    item.calificacion = item.calificacion.toFixed(2)

                }

            }
        },
        watch: {
            closed: function(){

                if (!closed) {

                    this.obtener_datos()

                }

            },
            nit_colaborador: function(val){

                if (val) {
                    
                    if (this.id_evaluacion) {

                        this.detalle_evaluacion()

                    }else{

                        this.obtener_datos()

                    }
                }

            },
            id_colaborador: function(val){

                this.nit_colaborador = val
                this.items = []

            },
            date: function(val){

                if (val) {
                    
                    if (!this.id_evaluacion) {
                        
                        this.obtener_datos()

                    }
                    
                }

            }
        },
        computed: {
            total_evaluacion: function(){
                
                let total = 0

                this.items.forEach(item => {
                                        
                    if (!item.calificacion) {
                        
                        item.calificacion = 0

                    }

                    total += (parseFloat(item.calificacion) * parseFloat(item.valor))

                });
                                
                let result = total / this.criterio.valor

                console.log(result);

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