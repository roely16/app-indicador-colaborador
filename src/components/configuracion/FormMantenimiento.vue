<template>
    <div>
        <v-container>
            <v-form @submit.prevent="!id_item ? registrar() : editar()" v-model="valid" ref="form">
                <v-row class="mt-2">
                    <v-col cols="12">
                        <v-text-field v-model="item.descripcion" :rules="[v => !!v]" hide-details outlined label="Descripción" autocomplete="off"></v-text-field>
                    </v-col>

                    <v-col cols="12" class="pb-0">
                        <v-btn rounded @click="marcar_todos()" small :color="!all_checked ? 'primary' : 'error'">
                            {{ !all_checked ? 'SELECCIONAR' : 'LIMPIAR' }} 
                            <v-icon>
                                {{ !all_checked ? 'mdi-check-all' : 'mdi-close-circle' }}
                            </v-icon>
                        </v-btn>
                    </v-col>

                    <v-col cols="12">
                        <v-autocomplete multiple small-chips deletable-chips :items="areas" item-text="descripcion" item-value="codarea" v-model="item.areas" :rules="[v => !!v]" hide-details outlined label="Áreas" autocomplete="off"></v-autocomplete>
                    </v-col>
                    
                    <v-col class="pt-4 pb-0" cols="12">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col cols="6">
                        <v-switch
                            hide-details
                            label="Asesor"
                            v-model="item.aplica_asesor"
                        ></v-switch>
                        <v-switch
                            hide-details
                            label="Prestador de Servicios"
                            v-model="item.aplica_prestador"
                        ></v-switch>
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
    // eslint-disable-next-line no-unused-vars
    import alert from '@/functions/alert'

    export default {
        props: {
            criterio: Object,
            id_item: String
        },
        data(){
            return{
                valid: true,
                item: {
                    descripcion: null,
                    aplica_asesor: null,
                    aplica_prestador: null,
                    areas: []
                },
                areas: []
            }
        },
        methods: {

            obtener_detalle(){

                const data = {
                    url: 'detalle_item_criterio',
                    data: {
                        id: this.id_item
                    }
                }

                request.post(data)
                .then((response) => {
                    this.item = response.data
                    console.log(response.data)
                })

            },
            registrar(){

                this.$refs.form.validate()

                if (this.valid) {
                    
                    this.item.id_criterio = this.criterio.id

                    const data = {
                        url: 'registrar_item_criterio',
                        data: this.item
                    }

                    request.post(data)
                    .then((response) => {
                        
                        if (response.data.status == 200) {
                            
                            alert.show(response.data)
                            .then(() => {

                                this.$emit('update')

                            })

                        }

                    })

                }

            },
            editar(){

                this.$refs.form.validate()

                if (this.valid) {

                    const data = {
                        url: 'editar_item_criterio',
                        data: this.item
                    }

                    request.post(data)
                    .then((response) => {
                        
                        if (response.data.status == 200) {
                            
                            alert.show(response.data)
                            .then(() => {

                                this.$emit('update')

                            })

                        }
                        
                    })

                }

            },
            clear(){

                this.item = {
                    descripcion: null,
                    aplica_asesor: null,
                    aplica_prestador: null,
                    areas: []
                }

                this.$refs.form.resetValidation()

            },
            obtener_areas(){

                const data = {
                    url: 'obtener_areas',
                    data: null
                }

                request.post(data)
                .then((response) => {
                    
                    this.areas = response.data

                })

            },
            marcar_todos(){

                if (!this.all_checked) {
                    
                    this.item.areas = []

                    let temp = []
                    
                    this.areas.forEach(area => {
                        
                    temp.push(area.codarea)

                    });

                    this.item.areas = temp

                }else{

                    this.item.areas = []

                }
                
            }

        },
        watch: {

            id_item: function(val) {

                if (val) {
                    
                    this.obtener_detalle()

                }

            }

        },
        computed: {

            all_checked: function(){

                if (this.item.areas.length == this.areas.length) {
                    
                    return true

                }

                return false

            }

        },
        mounted(){

            if (this.id_item) {
                
                this.obtener_detalle()

            }

            this.obtener_areas()

        }
    }
</script>

<style>

</style>