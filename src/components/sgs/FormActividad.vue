<template>
    <div>
        <v-container>
            <v-form @submit.prevent="check_registrar_actividad" v-model="valid" ref="form">
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            label="Nombre"
                            outlined
                            hide-details
                            :rules="[v => !!v]"
                            v-model="actividad.nombre"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea
                            label="Descripción"
                            outlined
                            hide-details
                            v-model="actividad.descripcion"
                        ></v-textarea>
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

    import { mapActions, mapState } from 'vuex'

    export default {
        data(){
            return{
                valid: true,
            }
        },
        methods: {
            ...mapActions('sgs', [
                'registrar_actividad',
                'editar_actividad'
            ]),
            check_registrar_actividad(){

                this.$refs.form.validate()

                if(this.valid){

                    if (this.actividad.id) {

                        this.editar_actividad()
                        .then(this.$emit('closeModal'))

                    }else{

                        this.registrar_actividad(this.actividad)
                        .then(this.$emit('closeModal'))

                    }
                }

            },
            resetValidation(){
                this.$refs.form.resetValidation()
            }
        },
        computed: {
            ...mapState('sgs', {
                actividad: state => state.actividad
            })
        }
    }   
</script>

<style>

</style>