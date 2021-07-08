<template>
    <div>

        <v-container fluid>
            <v-row>
                <v-col>

                    <v-card>

                        <v-tabs  v-model="tab" background-color="teal darken-2" dark>
                            <v-tab>Evaluación 
                                <v-icon class="ml-2">
                                    {{ edit ? 'mdi-pencil' : 'mdi-pencil-off' }}
                                </v-icon>
                            </v-tab>
                            <v-tab v-if="!edit">Seguimiento
                                <v-icon class="ml-2">
                                    mdi-clipboard-list
                                </v-icon>
                            </v-tab>
                        </v-tabs>

                        <v-tabs-items v-model="tab">
                            <v-tab-item>
                                <v-form @submit.prevent="!id_evaluacion ? registrar() : editar()" v-model="valid" ref="form">
                                    <v-row >
                                        <v-col cols="8">
                                            <v-card outlined min-height="600">
                                                <v-card-text>
                                                    <Filtro :id_colaborador="id_colaborador" :disabled_seccion="!secciones_prop" 
                                                    :id_area="id_area" :disabled_colaborador="id_colaborador ? true : false" ref="filtro" @getCodarea="(value) => { codarea = value }" @getNit="(value) => { nit_colaborador = value }"></Filtro>
                                                    
                                                    <v-row v-if="perfiles.length > 0" dense class="mt-2">
                                                        <v-col cols="6">
                                                            <v-select v-if="!nombre_perfil" @change="obtener_detalle_perfil()" :disabled="id_evaluacion ? true : false" :items="perfiles" item-text="nombre" item-value="id" v-model="perfil" autocomplete="off" hide-details outlined single-line label="Perfil de Servicios"></v-select>
                                                            
                                                            <span class="overline">
                                                                {{ nombre_perfil }}
                                                            </span>
                                                        </v-col>
                                                        <v-col cols="6">

                                                            <v-menu
                                                                ref="menu"
                                                                v-model="menu"
                                                                :close-on-content-click="false"
                                                                :return-value.sync="date"
                                                                transition="scale-transition"
                                                                offset-y
                                                                max-width="290px"
                                                                min-width="auto"
                                                            >
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-text-field
                                                                        :disabled="id_evaluacion ? true : false"
                                                                        v-model="date"
                                                                        label="Período de Evaluación"
                                                                        outlined
                                                                        single-line
                                                                        readonly
                                                                        v-bind="attrs"
                                                                        v-on="on"
                                                                        hide-details
                                                                    ></v-text-field>
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
                                                        </v-col>
                                                    </v-row>
                                                    
                                                    <!-- Posponer -->
                                                    <v-row v-if="nit_colaborador && perfil">
                                                        <v-col align="end">
                                                            <v-btn :disabled="id_evaluacion ? true : false" @click="posponer()" small color="warning">
                                                                POSPONER 
                                                                <v-icon size="18" class="ml-1">
                                                                    mdi-clock
                                                                </v-icon>
                                                            </v-btn>
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

                                                <v-card-text v-if="perfil">
                                                    
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
                                                                        <v-select :disabled="!edit" :rules="[ v => !!v ]" v-model="competencia.resultado" dense outlined single-line hide-details :items="ponderacion"></v-select>
                                                                    </v-col>
                                                                    
                                                                </v-row>
                                                            </v-expansion-panel-content>
                                                        </v-expansion-panel>
                                                    </v-expansion-panels>

                                                </v-card-text>

                                                <v-card-text v-if="perfil">

                                                    <v-row align="center" justify="center">
                                                        <v-col align="center">
                                                            <v-btn @click="$emit('closeModal')" large dark>
                                                                CANCELAR
                                                            </v-btn>
                                                            <v-btn :disabled="!nit_colaborador || !perfil || !edit || !all_passed" type="submit" large color="primary" class="ml-2">
                                                                REGISTRAR
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>

                                                </v-card-text>

                                                <v-card-text v-if="!nit_colaborador">

                                                    <AlertSeleccion msg="Seleccione un colaborador"></AlertSeleccion>

                                                </v-card-text>

                                                <v-card-text v-if="nit_colaborador && !perfil">

                                                    <AlertSeleccion msg="No existe perfil para este colaborador"></AlertSeleccion>

                                                </v-card-text>
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
                                                            {{ Math.round(total) }}
                                                        </div>
                                                    </v-sheet>

                                                    <div class="text-center" v-if="total > 0">
                                                        <v-chip dark v-if="total <= 59" label color="red">
                                                            NO SATISFACTORIO
                                                        </v-chip>

                                                        <v-chip dark v-if="total >= 60 && total <= 69" label color="orange">
                                                            REGULAR
                                                        </v-chip>

                                                        <v-chip v-if="total >= 70 && total <= 79" label color="yellow">
                                                            BUENO
                                                        </v-chip>

                                                        <v-chip dark v-if="total >= 80 && total <= 89" label color="teal">
                                                            MUY BUENO
                                                        </v-chip>

                                                        <v-chip v-if="total >= 90 && total <= 100" label color="success">
                                                            EXCELENTE
                                                        </v-chip>
                                                    </div>
                                                    
                                                    <v-divider class="mt-4"></v-divider>

                                                </v-card-text>

                                                <v-card-text class="mt-0 pt-0" v-if="tipos_competencias.length > 0">
                                                    <span class="overline">Calificación por Sección</span>

                                                    <v-row
                                                        no-gutters
                                                        style="height: 40px;"
                                                        v-for="(tipo, key) in calificacion"
                                                        :key="key"
                                                    >
                                                        <v-col cols="10">
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
                                                                {{ Math.round(tipo.result) }}/50
                                                            </v-card>
                                                        </v-col>
                                                    </v-row>

                                                    <v-divider class="mt-4"></v-divider>

                                                </v-card-text>

                                                <v-card-text v-if="total <= 69 && all_passed">

                                                    <v-row align="center" justify="center">
                                                        <v-col cols="4">
                                                            <v-img max-width="100" contain src="@/assets/img/warning.png"></v-img>
                                                        </v-col>
                                                        <v-col class="text-center" cols="12">
                                                            <p class="overline">
                                                                Se requiere seguimiento de competencias
                                                            </p>
                                                        </v-col>
                                                    </v-row>
                                                    
                                                </v-card-text>

                                            </v-card>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col>
                                            <v-textarea :disabled="!edit" v-model="observaciones" hide-details solo single-line label="Observaciones Complementarias del Calificador" :rows="4"></v-textarea>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-tab-item>
                            <v-tab-item>
                                <Seguimiento></Seguimiento>
                            </v-tab-item>
                        </v-tabs-items>

                    </v-card>

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
    import alert from '@/functions/alert'

    import AlertSeleccion from '@/components/AlertSeleccion'

    import Seguimiento from '@/components/competencias/Seguimiento'

    export default {
        components: {
            Filtro,
            AlertSeleccion,
            Seguimiento
        },
        props: {

            id_evaluacion: String,
            nit: String,
            secciones_prop: Boolean,
            id_area: String

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
                perfiles: [],
                perfil: null,
                tipos_competencias: [],
                valid: false,
                total: 0,
                observaciones: null,
                date: new Date().toISOString().substr(0, 7),
                menu: false,
                modal: false,
                tab: 0,
                nombre_perfil: null
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

                    this.perfiles = response.data.perfil
                    this.tipos_competencias = []
                    this.perfil = null
                    
                })

            },
            registrar(){

                this.$refs.form.validate()

                if (this.valid) {
                    
                    const data = {
                        url: 'registrar_evaluacion_competencia',
                        data: {
                            tipos_competencias: this.tipos_competencias,
                            total: this.total,
                            nit_colaborador: this.nit_colaborador,
                            observaciones: this.observaciones,
                            month: this.date,
                            id_perfil: this.perfil
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
            obtener_detalle(){

                this.id_colaborador = this.nit

                const data = {
                    url: 'detalle_evaluacion_competencia',
                    data: {
                        id: this.id_evaluacion,
                        nit_colaborador: this.id_colaborador
                    }
                }

                request.post(data)
                .then((response) => {

                    this.total = response.data.calificacion
                    this.observaciones = response.data.observaciones
                    this.date = response.data.periodo
                    this.tipos_competencias = response.data.tipos_competencias
                    this.perfiles = response.data.perfiles
                    this.perfil = response.data.perfil
                    this.nombre_perfil = response.data.nombre_perfil

                })


            },
            editar(){

                this.$refs.form.validate()

                if (this.valid) {

                    console.log('editar');

                    const data = {
                        url: 'editar_evaluacion_competencia',
                        data: {
                            tipos_competencias: this.tipos_competencias,
                            total: this.total,
                            nit_colaborador: this.nit_colaborador,
                            observaciones: this.observaciones,
                            month: this.date,
                            id_evaluacion: this.id_evaluacion
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
            clear(){

                this.id_colaborador = null
                this.tipos_competencias = []
                this.observaciones = null
                this.total = 0
                this.perfil = null

                this.$refs.form.resetValidation()

            },
            posponer(){

                const confirm = {
                    title: '¿Está seguro?',
					message: 'Se solicitará una prórroga para realizar la evaluación!',
					type: 'warning',
					confirm_text: 'ACEPTAR',
					cancel_text: 'CANCELAR'
                }

                alert.show_confirm(confirm)
                .then((result) => {

                    if (result.isConfirmed) {
                        
                        const data = {
                            url: 'posponer_evaluacion',
                            data: {
                                nit_colaborador: this.nit_colaborador,
                                month: this.date
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

                })

            },
            obtener_detalle_perfil(){

                const data = {
                    url: 'detalle_perfil_colaborador',
                    data: {
                        nit: this.nit_colaborador,
                        id_perfil: this.perfil
                    }
                }

                request.post(data)
                .then((response) => {

                    this.tipos_competencias = response.data

                })

            }

        },
        watch: {

            nit_colaborador: function(val){

                if (val) {
                    
                    if (!this.id_evaluacion) {
                        
                        this.obtener_perfil()

                    }
                
                }

            },
            id_evaluacion: function(val){

                if (val) {
                    
                    this.obtener_detalle()

                }

            }

        },
        computed: {

            calificacion: function(){

                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.total = 0

                if (this.tipos_competencias.length > 0) {
                    
                    this.tipos_competencias.forEach(tipo => {
                        
                        let total = 0

                        if (tipo.competencias) {
                            
                            tipo.competencias.forEach(competencia => {
                            
                                total = total + competencia.resultado * (50 / (tipo.competencias.length * 5))

                            });

                        }
                        

                        if (!total) {
                            
                            tipo.result = 0

                        }else{

                            tipo.result = total

                        }

                        this.total += tipo.result


                    });

                }
                

                return this.tipos_competencias

            },
            edit(){

                return this.$store.getters.getEdit
                
            },
            all_passed(){

                let pendientes = 0

                this.tipos_competencias.forEach(tipo => {
                    
                    let result = tipo.competencias.filter( competencia => !competencia.resultado )

                    pendientes += result.length

                });

                return pendientes > 0 ? false : true

            },
        },
        created(){

            if (this.id_evaluacion) {
                
                this.obtener_detalle()

            }

        }
    }
</script>

<style>

</style>