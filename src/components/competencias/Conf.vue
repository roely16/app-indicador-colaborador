<template>
    <div>
        <v-container>
    
            <v-card class="mb-4" elevation="1" v-if="show_form">
                <v-card-text>
                    <v-form @submit.prevent="!periodo.id ? registrar() : editar()" ref="form" v-model="valid">
                        <v-row>
                            <v-col>
                                <span class="overline">
                                    {{ !periodo.id ? 'HABILITACIÓN' : 'EDICIÓN' }} DE PERIODO
                                </span>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <v-textarea v-model="periodo.observacion" hide-details label="Observación" outlined rows="3"></v-textarea>
                            </v-col>
                            <v-col cols="3">
                                <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :return-value.sync="periodo.fecha_inicio"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="periodo.fecha_inicio"
                                            label="Inicio del Periodo"
                                            hide-details
                                            outlined
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="periodo.fecha_inicio"
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
                                            @click="$refs.menu.save(periodo.fecha_inicio)"
                                        >
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="3">
                                <v-menu
                                    ref="menu2"
                                    v-model="menu2"
                                    :close-on-content-click="false"
                                    :return-value.sync="periodo.fecha_fin"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="periodo.fecha_fin"
                                            label="Fin del Periodo"
                                            hide-details
                                            outlined
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="periodo.fecha_fin"
                                        no-title
                                        scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="menu2 = false"
                                        >
                                            Cancel
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="$refs.menu2.save(periodo.fecha_fin)"
                                        >
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-row align="center" justify="center">
                            <v-col align="center">
                                <v-btn class="elevation-0" @click="show_form = false">
                                    CANCELAR 
                                    <v-icon class="ml-1">
                                        mdi-close-circle
                                    </v-icon>
                                </v-btn>
                                <v-btn :loading="saving" :disabled="saving" type="submit" color="primary" class="ml-2 elevation-0">
                                    {{ !periodo.id ? 'REGISTRAR' : 'ACTUALIZAR' }} 
                                    <v-icon class="ml-1">
                                        mdi-content-save
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>

                    </v-form>
                </v-card-text>
            </v-card>

            <v-row align="center" class="mt-1 mb-2">
                <v-col cols="6">
                    <v-text-field
                        v-model="search"
                        prepend-inner-icon="mdi-magnify"
                        label="Buscar..."
                        single-line
                        hide-details
                        outlined
                        autocomplete="off"
                        dense
                    ></v-text-field>
                </v-col>
                <v-col align="end">
                    <v-btn @click="() => {
                        show_form = true
                        clear()
                    }" color="teal darken-1" elevation="2" dark fab>
                        <v-icon>
                            mdi-plus
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-data-table 
                        :items="items" 
                        :headers="headers"
                        hide-default-footer
                        :page.sync="page"
                        @page-count="pageCount = $event"
                        show-expand
                        :loading="loading"
                    >   

                        <template v-slot:expanded-item="{ headers, item }">
                            <td :colspan="headers.length">
                                <v-row class="pt-4 pb-4">
                                    <v-col cols="4">
                                        <v-card @click="() => { 
                                            item.filtro = 'PE' 
                                        }" dark :color="'primary'" :elevation="item.filtro == 'PE' ? 12 : 0">
                                            <v-card-text>
                                                <v-row align="center">
                                                    <v-col cols="3">
                                                        <v-btn dark icon>
                                                            <v-icon size="40">
                                                                mdi-account-clock
                                                            </v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                    <v-col justify="center" class="text-center">
                                                        <small small label>
                                                            Pendientes
                                                        </small>
                                                        <br>
                                                        <span label class="text-h4 pt-4 pb-4">
                                                            {{ item.pendientes }}
                                                        </span>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-card @click="() => { 
                                            item.filtro = 'PO' 
                                        }" dark :color="'warning'" :elevation="item.filtro == 'PO' ? 12 : 0">
                                            <v-card-text>
                                                <v-row align="center">
                                                    <v-col cols="3">
                                                        <v-btn dark icon>
                                                            <v-icon size="40">
                                                                mdi-alarm
                                                            </v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                    <v-col justify="center" class="text-center">
                                                        <small small label>
                                                            Pospuestos
                                                        </small>
                                                        <br>
                                                        <span label class="text-h4 pt-4 pb-4">
                                                            {{ item.posponer }}
                                                        </span>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>

                                <v-row class="mb-4">
                                    <v-col>
                                        <v-expansion-panels class="elevation-0">
                                            <v-expansion-panel class="elevation-0" v-for="(area, key) in item.filtro == 'PE' ? item.areas : item.areas_posponer" :key="key">
                                                <v-expansion-panel-header>
                                                    {{ area.descripcion }}
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <h5 v-for="(empleado, i) in area.empleados" :key="i">
                                                        {{ empleado.nombre }} {{ empleado.apellido }}
                                                    </h5>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    </v-col>
                                </v-row>
                            </td>
                        </template>

                        <template v-slot:[`item.no`]="{item}">
                            {{ item.index }}
                        </template>

                        <template v-slot:[`item.action`]="{ item }">
                            <v-btn @click="mostrar_editar(item)" x-small icon color="blue accent-4">
                                <v-icon>
                                    mdi-pencil
                                </v-icon>
                            </v-btn>

                            <v-btn @click="eliminar(item)" class="ml-2" x-small icon color="red accent-4">
                                <v-icon>
                                    mdi-delete
                                </v-icon>
                            </v-btn>

                        </template>

                    </v-data-table>

                    <v-pagination
                        class="mt-4 mb-4"
                        v-model="page"
                        :length="pageCount"
                    ></v-pagination>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

    import request from '@/functions/request'
    import alert from '@/functions/alert'

    export default {
        data(){
            return{
                date: new Date().toISOString().substr(0, 10),
                menu: false,
                menu2: false,
                headers: [],
                items: [],
                show_form: false,
                search: null,
                periodo: {
                    observacion: null,
                    fecha_inicio: new Date().toISOString().substr(0, 10),
                    fecha_fin: new Date().toISOString().substr(0, 10),
                    notificar: false
                },
                valid: true,
                page: 1,
				pageCount: 0,
                saving: false,
                loading: false
            }
        },
        methods: {

            obtener_periodos(){

                this.loading = true

                const data = {
                    url: 'obtener_periodos',
                    data: null
                }

                request.post(data)
                .then((response) => {

                    this.items = response.data.items
                    this.headers = response.data.headers
                    this.loading = false

                })

            },
            registrar(){

                this.$refs.form.validate()

                if (this.valid) {
                    
                    this.saving = true

                    const data = {
                        url: 'registrar_periodo',
                        data: this.periodo
                    }

                    request.post(data)
                    .then((response) => {

                        if (response.data.status == 200) {
                            
                            alert.show(response.data)
                            .then(() => {

                                this.show_form = false
                                this.clear()

                            })

                        }

                        this.saving = false
                        this.obtener_periodos()

                    })


                }

            },
            mostrar_editar(item){

                this.show_form = true

                this.periodo.observacion = item.observacion
                this.periodo.fecha_inicio = item.fecha_inicio_format
                this.periodo.fecha_fin = item.fecha_fin_format
                this.periodo.id = item.id


            },
            eliminar(item){

                const data_alert = {
					title: '¿Está seguro?',
					message: 'Una vez eliminado no se podrá recuperar!',
					type: 'warning',
					confirm_text: 'ELIMINAR',
					cancel_text: 'Cancelar'
				}

                alert.show_confirm(data_alert)
                .then((result) => {

                    if (result.isConfirmed) {
                        
                        const data = {
                            url: 'eliminar_periodo',
                            data: {
                                id: item.id
                            }
                        }

                        request.post(data)
                        .then((response) => {
                            
                            if (response.data.status == 200) {
                                
                                alert.show(response.data)
                                .then( this.obtener_periodos() )

                            }
                        })

                    }

                })

            },
            clear(){

                this.periodo = {
                    observacion: null,
                    fecha_inicio: new Date().toISOString().substr(0, 10),
                    fecha_fin: new Date().toISOString().substr(0, 10)
                }

            },
            editar(){

                this.$refs.form.validate()

                if (this.valid) {

                    const data = {
                        url: 'editar_periodo',
                        data: this.periodo
                    }

                    request.post(data)
                    .then((response) => {
                        
                        if (response.data.status == 200) {
                            
                            alert.show(response.data)
                            .then(() => {
                                this.show_form = false
                                this.obtener_periodos()
                            })

                        }

                    })

                }

            },
            filtro_periodo(){



            }

        },
        created(){

            this.obtener_periodos()

        }
    }
</script>

<style>

</style>