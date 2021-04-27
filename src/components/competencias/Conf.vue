<template>
    <div>
        <v-container>
    
            <v-card class="mb-4" v-if="show_form">
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
                        <v-row class="mb-4" align="center" justify="center">
                            <v-col align="center">
                                <v-btn @click="show_form = false" large dark>
                                    CANCELAR 
                                    <v-icon>
                                        mdi-close-circle
                                    </v-icon>
                                </v-btn>
                                <v-btn :loading="saving" :disabled="saving" type="submit" large color="primary" class="ml-2">
                                    {{ !periodo.id ? 'REGISTRAR' : 'ACTUALIZAR' }} 
                                    <v-icon>
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
                    >
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
                    fecha_fin: new Date().toISOString().substr(0, 10)
                },
                valid: true,
                page: 1,
				pageCount: 0,
                saving: false
            }
        },
        methods: {

            obtener_periodos(){

                const data = {
                    url: 'obtener_periodos',
                    data: null
                }

                request.post(data)
                .then((response) => {

                    console.log(response.data)
                    this.items = response.data.items
                    this.headers = response.data.headers

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

            }

        },
        created(){

            this.obtener_periodos()

        }
    }
</script>

<style>

</style>