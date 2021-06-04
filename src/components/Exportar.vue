<template>
    <div>

        <v-container >
            <v-form ref="form" v-model="valid" @submit.prevent="generar()">
                <v-row>
                    <v-col cols="12">
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
                                    v-model="date"
                                    label="Mes"
                                    prepend-inner-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    outlined
                                    hide-details
                                    :rules="[ v => !!v ]"
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
                    <v-col>
                        <v-autocomplete
							v-model="codarea"
							:items="areas"
							item-text="descripcion"
							item-value="codarea"
							outlined
							single-line
							label="Secciones"
							hide-details
                            multiple
                            chips
                            :rules="[ v => !!v ]"
						></v-autocomplete>
                    </v-col>
                </v-row>    

                <v-row class="mt-4">
                    <v-col class="text-center">
                        <v-btn @click="$emit('closeModal')" large dark>
                            CANCELAR 
                            <v-icon class="ml-2">
                                mdi-close-circle
                            </v-icon>
                        </v-btn>
                        <v-btn type="submit" large color="primary" class="ml-2">
                            GENERAR 
                            <v-icon class="ml-2">
                                mdi-download
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>

                <v-divider v-if="json_data.length > 0" class="mt-4 mb-4"></v-divider>

                <v-row v-if="json_data.length > 0">
                    <v-col class="text-center">

                        <v-btn color="success">
                            <download-excel :name="'Reporte ' + this.criterio.nombre + ' ' + this.date  + '.xls'" :data="json_data" :fields="json_fields">
                                Descargar Excel
                                <v-icon>
                                    mdi-file-excel
                                </v-icon>
                            </download-excel>   
                        </v-btn>
                    </v-col>
                </v-row>

                <v-row v-if="json_data.length == 0 && data_fetched" align="center" justify="center">
                    <v-col cols="12">
                        <v-alert dismissible type="error" class="text-center">
                            NO SE HAN ENCONTRADO REGISTROS QUE EXPORTAR
                        </v-alert>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    
    </div>
</template>

<script>

    import request from '@/functions/request.js'

    export default {
        data(){
            return{
                date: new Date().toISOString().substr(0, 7),
                menu: false,
                codarea: null,
                areas: [],
                valid: true,
                json_data: [],
                json_fields: {
                    'NIT': 'nit',
                    'Nombre': 'nombre',
                    'Mes': 'mes',
                    'Calificación': 'calificacion',
                    'Sección': 'seccion'
                },
                data_fetched: false
            }
        },
        methods: {

            obtener_areas(){

                const route = this.$route.name

                const user = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

                const data = {
                    url: 'obtener_areas',
                    data: {
                        modulo: route,
                        nit: user.nit
                    }
                }

                request.post(data)
                .then((response) => {
                    console.log(response.data)

                    this.areas = response.data
                })

            },
            generar(){
                
                this.$refs.form.validate()

                if(this.valid){

                    const criterio = this.$store.getters.getCriterio

                    const data = {
                        date: this.date,
                        codarea: this.codarea,
                        criterio: criterio.id
                    }

                    const post_request = {
                        url: 'datos_excel',
                        data: data
                    }

                    request.post(post_request)
                    .then((response) => {
                        this.json_data = response.data
                        this.data_fetched = true
                    })

                }

            }

        },
        computed: {

            criterio(){

                return this.$store.getters.getCriterio

            }

        },
        created(){

            this.obtener_areas()

        }
    }
</script>