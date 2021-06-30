<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="7">
                    <v-card min-height="700" outlined>
                        <v-card-text>
                            <span class="overline">Información General</span>
                            <v-row class="mt-1">
                                <v-col cols="12">
                                    <v-text-field v-model="perfil.nombre" autocomplete="off" hide-details outlined single-line label="Nombre"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea v-model="perfil.descripcion" auto-grow autocomplete="off" hide-details outlined single-line label="Descripción" rows="3"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-card-text>

                        <v-card-text>
                            <v-row>
                                <v-col cols="8">
                                    <span class="overline">Competencias</span>
                                </v-col>
                                <v-col align="end">
                                    <v-btn @click="perfil.mostrar_nuevo = !perfil.mostrar_nuevo" icon color="success">
                                        <v-icon>
                                            {{ perfil.mostrar_nuevo ? 'mdi-eye-off' : 'mdi-eye' }}
                                        </v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>

                            <!-- Agregar nueva competencia -->
                            <v-row v-if="perfil.mostrar_nuevo">
                                <v-col cols="12">
                                    <v-card outlined>
                                        <v-card-text>
                                            <v-row>
                                                <v-col cols="8">
                                                    <v-textarea v-model="perfil.nueva_competencia.nombre" autocomplete="off" hide-details outlined single-line label="Nombre" rows="2" auto-grow></v-textarea>
                                                </v-col>
                                                <v-col cols="4">
                                                    <v-select return-object v-model="perfil.nueva_competencia.tipo" :items="tipos_competencias" autocomplete="off" hide-details outlined single-line label="Tipo"></v-select>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col align="center" cols="12">
                                                    <v-btn @click="perfil.mostrar_nuevo = false">
                                                        <v-icon>
                                                            mdi-close-circle
                                                        </v-icon>
                                                    </v-btn>
                                                    <v-btn :disabled="!perfil.nueva_competencia.nombre || !perfil.nueva_competencia.tipo" @click="agregar_competencia()" class="ml-2" color="success">
                                                        <v-icon>
                                                            mdi-plus-circle
                                                        </v-icon>
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-col>

                                <v-col cols="12">
                                    <v-divider></v-divider>
                                </v-col>
                                
                            </v-row>

                            <v-row class="mt-1">
                                <v-col cols="12" v-if="perfil.tipos_competencias.length > 0">
                                    <v-expansion-panels>
                                        <v-expansion-panel
                                            v-for="(item,i) in perfil.tipos_competencias"
                                            :key="i"
                                        >
                                        <v-expansion-panel-header>
                                            <span class="overline">
                                                {{ item.nombre }}
                                            </span>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content v-if="item.competencias.length > 0">

                                            <v-row align="center" v-for="(competencia, key) in item.competencias" :key="key">
                                                <v-col cols="9">
                                                    <v-text-field v-if="competencia.edit" v-model="competencia.nombre" autocomplete="off" hide-details outlined single-line dense></v-text-field>

                                                    <span v-if="!competencia.edit">
                                                        {{ competencia.nombre }}
                                                        <v-chip color="error" x-small label v-if="competencia.delete">
                                                            ELIMINAR
                                                        </v-chip>
                                                    </span>
                                                </v-col>
                                                <v-col align="end">
                                                    <v-btn @click="competencia.edit = !competencia.edit" x-small icon color="primary">
                                                        <v-icon>
                                                            {{ competencia.edit ? 'mdi-pencil-off' : 'mdi-pencil' }}
                                                        </v-icon>
                                                    </v-btn>
                                                    <v-btn @click="eliminar_competencia(item, key, competencia)" x-small icon color="error">
                                                        <v-icon>
                                                            mdi-delete
                                                        </v-icon>
                                                    </v-btn>
                                                </v-col>
                                            </v-row>

                                        </v-expansion-panel-content>

                                        <v-expansion-panel-content v-if="item.competencias.length <= 0">

                                            <Alert msg="No se han registrado competencias"></Alert>

                                        </v-expansion-panel-content>

                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </v-col>

                                <v-col v-if="perfil.tipos_competencias <= 0">
                                    <Alert msg="No se han registrado competencias"></Alert>
                                </v-col>
                            </v-row>
                        </v-card-text>

                    </v-card>
                </v-col>
                <v-col cols="5">
                    <v-card min-height="700" outlined>

                        <v-card-text>
                            <span class="overline">Colaboradores</span>
                            
                            <Filtro ref="filtro" @getCodarea="(value) => { codarea = value }" @getNit="(value) => { nit_colaborador = value }" cols_areas="12" cols_colaboradores="12"></Filtro>

                            <v-row align="center" class="mt-2">
                                <v-col align="center" cols="12">
                                    <v-btn :disabled="!nit_colaborador" @click="agregar_colaborador()" class="ml-2" color="success">
                                        <v-icon>
                                            mdi-plus-circle
                                        </v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-divider class="mt-4"></v-divider>
                        </v-card-text>

                        <!-- Colaboradores asignados al perfil -->
                        <v-card-text v-if="perfil.colaboradores.length <= 0">

                            <v-row>
                                <v-col cols="12">
                                    <Alert msg="El perfil no tiene colaboradores asignados"></Alert>
                                </v-col>
                                
                            </v-row>

                        </v-card-text>

                        <!-- Listado de colaboradores -->
                        <v-card-text>
                            <v-row align="center" v-for="(colaborador, key) in perfil.colaboradores" :key="key">
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
                                                <v-img src="@/assets/img/avatar.png"></v-img>
                                            </v-avatar>
                                        </v-badge>
                                </v-col>
                                <v-col cols="8">
                                    {{ colaborador.nombre }} {{ colaborador.apellido }}
                                    <v-chip color="error" x-small label v-if="colaborador.delete">
                                        ELIMINAR
                                    </v-chip>
                                </v-col>
                                <v-col align="end">
                                    <v-btn @click="eliminar_colaborador(key, colaborador)" x-small icon color="error">
                                        <v-icon>
                                            mdi-delete
                                        </v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col align="center">
                    <v-btn @click="$emit('closeModal')" large dark>
                        CANCELAR
                    </v-btn>
                    <v-btn @click="!id_perfil ? registrar() : editar()" :disabled="!perfil.nombre" large color="primary" class="ml-2">
                        REGISTRAR
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

    import Alert from '@/components/AlertSeleccion'
    import Filtro from '@/components/Filtro'

    import request from '@/functions/request'
    // eslint-disable-next-line no-unused-vars
    import sw_alert from '@/functions/alert'

    export default {
        props: {
            id_perfil: String
        },
        components: {
            Alert,
            Filtro
        },
        data(){
            return{
                perfil: {
                    nombre: null,
                    descripcion: null,
                    nueva_competencia: {
                        nombre: null,
                        tipo: null
                    },
                    tipos_competencias: [],
                    colaboradores: [],
                    mostrar_nuevo: false
                },
                tipos_competencias: [
                    {
                        id: 1,
                        text: "Técnicas"
                    },
                    {
                        id: 2,
                        text: "Blandas"
                    }
                ],
                codarea: null,
                nit_colaborador: null
            }
        },
        methods: {

            agregar_competencia(){

                if (this.perfil.nueva_competencia.nombre && this.perfil.nueva_competencia.tipo) {

                    let result = this.perfil.tipos_competencias.filter(tipo => tipo.id == this.perfil.nueva_competencia.tipo.id)

                    // Crear el tipo de competencia
                    if (result.length <= 0) {
                        
                        let data = {
                            nombre: "Competencias " + this.perfil.nueva_competencia.tipo.text,
                            id: this.perfil.nueva_competencia.tipo.id,
                            competencias: []
                        }

                        this.perfil.tipos_competencias.push(data)

                        let result = this.perfil.tipos_competencias.filter(tipo => tipo.id == this.perfil.nueva_competencia.tipo.id)

                        // eslint-disable-next-line no-unused-vars
                        let competencia = {
                            nombre: this.perfil.nueva_competencia.nombre,
                            id_tipo: result[0].id,
                            edit: false
                        }

                        result[0].competencias.push(competencia)

                    }else{

                        // Registrar solo la competencia
                        let result = this.perfil.tipos_competencias.filter(tipo => tipo.id == this.perfil.nueva_competencia.tipo.id)

                        let competencia = {
                            nombre: this.perfil.nueva_competencia.nombre,
                            id_tipo: result[0].id,
                            edit: false
                        }

                        result[0].competencias.push(competencia)

                    }

                    this.perfil.nueva_competencia = {
                        nombre: null,
                        tipo: null
                    }

                }

            },
            agregar_colaborador(){

                // Validar que no exista el colaborador
                let result = this.perfil.colaboradores.filter(colaborador => colaborador.nit == this.nit_colaborador)

                if (result.length <= 0) {
                    
                    const data = {
                        url: 'info_colaborador',
                        data: {
                            nit: this.nit_colaborador
                        }
                    }

                    request.post(data)
                    .then((response) => {

                        // Validar si es edición o registro
                        if (this.id_perfil) {
                            
                            const data_request = {
                                url: 'agregar_colaborador_perfil',
                                data: {
                                    id_perfil: this.id_perfil,
                                    nit: response.data.nit
                                }
                            }

                            request.post(data_request)
                            .then((response) => {

                                if (response.data.status == 200) {
                                    
                                    this.obtener_detalle()
                                    this.$store.dispatch('getAreas')

                                }
                            })

                        }else{

                            this.perfil.colaboradores.push(response.data)

                        }
                    })

                }else{
                    
                    const data = {
                        title: 'Atención',
                        message: 'Este colaborador ya fue agregado al perfil',
                        type: 'info'
                    }

                    sw_alert.show(data)

                }

            },
            registrar(){

                const data = {
                    url: 'registrar_perfil',
                    data: this.perfil
                }

                request.post(data)
                .then((response) => {

                    if (response.data.status == 200) {
                        
                        sw_alert.show(response.data)
                        .then(() => {

                            this.$emit('update')
                            this.$emit('closeModal')

                            this.$store.dispatch('getAreas')

                        })

                    }
                })

            },
            eliminar_competencia(tipo, key, competencia){

                if (!this.id_perfil || !competencia.id) {
                    
                    tipo.competencias.splice(key, 1)

                }else{
                    
                    competencia.delete = !competencia.delete

                }
            
            },
            eliminar_colaborador(key, colaborador){

                if (this.id_perfil && colaborador.id_perfil) {
                    
                   const data = {
                        title: '¿Está seguro?',
                        message: "Una vez eliminado no se podrá recuperar!",
                        type: 'warning',
                        confirm_text: 'ELIMINAR',
                        cancel_text: 'Cancelar'
                    }

                    sw_alert.show_confirm(data)
                    .then((result) => {

                        if (result.isConfirmed) {
                            
                            const data_request = {
                                url: 'eliminar_colaborador_perfil',
                                data: {
                                    nit: colaborador.nit,
                                    id_perfil: this.id_perfil
                                }
                            }

                            request.post(data_request)
                            .then((response) => {

                                if (response.data.status == 200) {
                                    
                                    this.obtener_detalle()

                                    this.$store.dispatch('getAreas')

                                }
                            })
                        }
                    })

                }else{

                    //colaborador.delete = !colaborador.delete

                    console.log('eliminación directa')

                    this.perfil.colaboradores.splice(key, 1)

                }
                

            },
            obtener_detalle(){

                const data = {
                    url: 'detalle_perfil',
                    data: {
                        id: this.id_perfil
                    }
                }

                request.post(data)
                .then((response) => {

                    this.perfil = response.data

                })

            },
            editar(){

                const data = {
                    url: 'editar_perfil',
                    data: this.perfil
                }

                request.post(data)
                .then((response) => {
                    
                    if (response.data.status == 200) {
                        
                        sw_alert.show(response.data)
                        .then(() => {

                            this.$emit('update')
                            this.obtener_detalle()

                            this.$store.dispatch('getAreas')

                        })

                    }

                })

            },
            clear(){

                this.perfil = {
                    nombre: null,
                    descripcion: null,
                    nueva_competencia: {
                        nombre: null,
                        tipo: null
                    },
                    tipos_competencias: [],
                    colaboradores: [],
                    mostrar_nuevo: false
                }

            }

        },
        watch: {
            id_perfil: function(val){

                if (val) {
                    
                    this.obtener_detalle()
                }

            }
        },
        mounted(){

            if (this.id_perfil) {

                this.obtener_detalle()

            }

        }
    }
</script>

<style>

</style>