<template>
    <div>
        <v-container>
            <v-form ref="form" @submit.prevent="registrar()" v-model="valid">
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

    export default {

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
                        console.log(response.data)

                        this.$emit('updateTable')
                        
                    })
                

                }

            }

        }

    }
</script>

<style>

</style>