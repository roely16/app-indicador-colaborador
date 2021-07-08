<template>
    <div>
        <v-container>
            <v-form @submit.prevent="!actividad.id ? registrar() : editar()" v-model="valid" ref="form">
                <v-row>
                    <v-col cols="5">
                        <v-row>
                            <v-col cols="12">
                                <v-textarea :disabled="!admin && isEdit" :rules="[v => !!v]" v-model="actividad.descripcion" rows="3" outlined hide-details label="Descripción"></v-textarea>
                            </v-col>
                            <v-col cols="6">
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
                                            label="Inicio"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            outlined
                                            hide-details
                                            :rules="[v => !!v]"
                                            :disabled="!admin && isEdit"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker  v-model="date" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn  text color="primary" @click="menu = false">
                                            Cancel
                                        </v-btn>
                                        <v-btn text color="primary" @click="$refs.menu.save(date)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="6">
                                <v-menu
                                    ref="menu2"
                                    v-model="menu2"
                                    :close-on-content-click="false"
                                    :return-value.sync="date2"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="date2"
                                            label="Fin"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            outlined
                                            hide-details
                                            :rules="[v => !!v]"
                                            :disabled="!admin && isEdit"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker  v-model="date2" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn  text color="primary" @click="menu2 = false">
                                            Cancel
                                        </v-btn>
                                        <v-btn text color="primary" @click="$refs.menu2.save(date2)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea :disabled="!admin && isEdit" v-model="actividad.observaciones" rows="5" outlined hide-details label="Observaciones"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="7">

                        <v-row>
                            <v-col cols="12">
                                <v-card outlined>
                                    <v-card-text class="pb-0">
                                        <v-file-input multiple v-model="actividad.files" counter :show-size="1000" label="Adjuntar" outlined :prepend-icon="null" prepend-inner-icon="mdi-paperclip"></v-file-input>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12">
                                <v-card outlined min-height="180">
                                    <v-card-text v-if="actividad.archivos.length > 0">

                                        <v-row>
                                            <v-col align="end">
                                                
                                                <v-btn @click="descargar_archivos()" :disabled="archivos_seleccionados.length <= 0" color="primary" small icon>
                                                    <v-icon>
                                                        mdi-download
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn @click="eliminar_archivos()" :disabled="archivos_seleccionados.length <= 0" color="error" small icon>
                                                    <v-icon>
                                                        mdi-delete
                                                    </v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col v-for="(archivo, key) in actividad.archivos" :key="key" cols="3">
                                                <v-hover v-slot="{ hover }">
                                                    
                                                    <v-card
                                                        :elevation="hover || archivo.select ? 12 : 2"
                                                        :class="{ 'on-hover': hover }"
                                                        @click="select_documento(archivo)"
                                                        style="{ cursor: pointer;}"
                                                    >   

                                                        <v-card-title v-if="archivo.select" class="pt-0 pb-0" primary-title style="position: relative">
                                                            <v-btn color="success" dark x-small absolute top right fab>
                                                                <v-icon>mdi-check</v-icon>
                                                            </v-btn>
                                                        </v-card-title> 

                                                        <v-img v-if="archivo.image" aspect-ratio="1" contain :src="api + archivo.path"></v-img>

                                                        <v-card-text class="mt-0 pt-0" v-if="!archivo.image">
                                                            
                                                            <small> {{ archivo.nombre }} </small>
                                                            <v-img  aspect-ratio="1" contain :src="require('@/assets/img/documents.png')"></v-img>
                                                        </v-card-text>
                                                        
                                                    </v-card>
                                                    
                                                </v-hover>
                                                
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-card-text class="pt-0 pb-0" v-if="actividad.archivos.length <= 0">
                                        <Alert msg="No se han adjuntado archivos"></Alert>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        
                    </v-col>
                </v-row>

                <v-row class="mt-10" justify="center" align="center">
                    <v-col class="text-center" cols="6">
                        <v-btn large dark>
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

    import Alert from '@/components/AlertSeleccion'

    import { mapActions, mapState } from 'vuex'

    export default {
        components: {
            Alert
        },
        data(){
            return{
                date: new Date().toISOString().substr(0, 10),
                menu: false,
                date2: new Date().toISOString().substr(0, 10),
                menu2: false,
                files: [],
                actividad_: {
                    descripcion: null,
                    inicio: null,
                    fin: null,
                    observaciones: null,
                    archivos: [],
                    files: [],
                    id_seguimiento: null
                },
                valid: true,
                api: process.env.VUE_APP_API_URL
            }
        },
        methods: {
            ...mapActions([
                'verificar'
            ]),
            registrar(){

                this.$refs.form.validate()

                if (this.valid) {
                    
                    this.actividad.inicio = this.date
                    this.actividad.fin = this.date2
                    this.actividad.id_seguimiento = this.$store.getters.getIdSeguimiento

                    this.$store.dispatch('registrarActividad', this.actividad)

                }
                
            },
            editar(){

                console.log('editar');

                this.actividad.inicio = this.date
                this.actividad.fin = this.date2

                this.$store.dispatch('editarActividad');

            },
            select_documento(archivo){
                
                archivo.select = !archivo.select

                if (archivo.select) {
                    
                    this.$store.commit('setArchivosSeleccionados', archivo.id)

                }else{

                    this.$store.commit('removeArchivoSeleccionado', archivo.id)

                }

            },
            eliminar_archivos(){

                this.$store.dispatch('eliminar_archivo')

            },
            descargar_archivos(){

                this.$store.dispatch('descargar_archivo')

            }

        },
        computed: {
            ...mapState([
                'permisos'
            ]),
            actividad(){

                return this.$store.getters.getActividad

            },
            archivos_seleccionados(){

                return this.$store.getters.getArchivosSeleccionados

            },
            admin(){
                return this.$store.getters.getAdmin
            },
            isEdit(){

                if(this.actividad.id){
                    return true
                }

                return false

            }
        },
        mounted(){

            const url = this.$route.name

            this.verificar(url)

        }
    }
</script>

<style>

</style>