<template>
    <div>
        <v-container>
            <v-form ref="form" @submit.prevent="!id_grupo ? registrar() : editar()" v-model="valid">
                <v-row>
                    <v-col>
                        <v-text-field autocomplete="off" hint="Máximo 200 caracteres" persistent-hint v-model="grupo.nombre" :rules="[ v => !!v ]" label="Nombre" outlined></v-text-field>
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
            id_grupo: Number
        },  
        data(){
            return{
                valid: true,
                grupo: {
                    nombre: null
                }
            }
        },
        methods: {

            registrar(){

                this.$refs.form.validate()

                if (this.valid) {
                    
                    const data = {
                        url: 'registrar_grupo',
                        data: this.grupo
                    }

                    request.post(data)
                    .then((response) => {
                       
                        if (response.data.status == 200) {
                            
                            alert.show(response.data)
                            .then(() => {

                                this.$emit('updateTable')
                                this.$emit('closeModal')

                            })

                        }
                        
                    })
                

                }

            },
            clear(){

                this.grupo = {
                    nombre: null
                }

                this.$refs.form.resetValidation()

            },
            detalle_grupo(){

                const data = {
                    url: 'detalle_grupo',
                    data: {
                        id_grupo: this.id_grupo
                    }
                }

                request.post(data)
                .then((response) => {
                    this.grupo = response.data
                })

            },
            editar(){

                this.$refs.form.validate()

                if (this.valid) {
                    
                    const data = {
                        url: 'editar_grupo',
                        data: this.grupo
                    }

                    request.post(data)
                    .then((response) => {
                       
                        if (response.data.status == 200) {
                            
                            alert.show(response.data)
                            .then(() => {

                                this.$emit('updateTable')
                                this.$emit('closeModal')

                            })

                        }
                        
                    }) 

                }

            }

        },
        watch: {

            id_grupo: function(val){

                if (val) {
                    
                    this.detalle_grupo()
                    
                }

            }

        },
        created(){

            if (this.id_grupo) {
                
                this.detalle_grupo()

            }

        }

    }
</script>

<style>

</style>