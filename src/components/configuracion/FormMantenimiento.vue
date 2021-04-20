<template>
    <div>
        <v-container>
            <v-form @submit.prevent="registrar()" v-model="valid" ref="form">
                <v-row class="mt-2">
                    <v-col cols="12">
                        <v-text-field v-model="item.descripcion" :rules="[v => !!v]" hide-details outlined label="Descripción" autocomplete="off"></v-text-field>
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
                    aplica_prestador: null
                }
            }
        },
        methods: {

            obtener_detalle(){

                const data = {
                    url: '',
                    data: {
                        id: this.id_item
                    }
                }

                request.post(data)
                .then((response) => {
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

            },
            clear(){

                this.item = {
                    descripcion: null,
                    aplica_asesor: null,
                    aplica_prestador: null
                }

                this.$refs.form.resetValidation()

            }

        },
        mounted(){

            if (this.id_item) {
                
                this.obtener_detalle()

            }

            console.log(this.criterio)

        }
    }
</script>

<style>

</style>