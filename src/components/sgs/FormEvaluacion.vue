<template>
    <div>
        <v-container>
            <v-form v-model="valid" ref="form" @submit.prevent="check_form">
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            label="Nombre"
                            outlined
                            hide-details
                            v-model="evaluacion.nombre"
                            :rules="[v => !!v]"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea
                            label="Descripción"
                            outlined
                            hide-details
                            v-model="evaluacion.descripcion"
                        ></v-textarea>
                    </v-col>
                    <v-col cols="6">
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="evaluacion.mes"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="evaluacion.mes"
                                    label="Mes"
                                    readonly
                                    outlined
                                    hide-details
                                    v-bind="attrs"
                                    v-on="on"
                                    :rules="[v => !!v]"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="evaluacion.mes"
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
                                    @click="$refs.menu.save(evaluacion.mes)"
                                >
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-menu>
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

    import { mapState, mapActions } from 'vuex'

    export default {
        data() {
            return{
                menu: false,
                date: null,
                valid: true
            }
        },
        methods: {
            ...mapActions('evaluacion_sgs', [
                'registrar_evaluacion',
                'editar_evaluacion'
            ]),
            check_form(){

                this.$refs.form.validate()

                if (this.valid) {
                    
                    if(!this.evaluacion.id){
                        this.registrar_evaluacion()
                    }else{
                        this.editar_evaluacion()
                    }

                }

            },
            reset_validation(){

                this.$refs.form.resetValidation()

            }
        },
        computed: {
            ...mapState('evaluacion_sgs', {
                evaluacion: state => state.evaluacion
            })
        }
    }
</script>