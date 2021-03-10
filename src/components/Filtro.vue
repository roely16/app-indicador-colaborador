<template>
    <div>
        <v-row dense>
            <v-col>
                <v-autocomplete :disabled="disabled_seccion" hide-details v-model="codarea" :items="areas" item-text="descripcion" item-value="codarea" outlined single-line label="Sección" @change="obtener_colaboradores()"></v-autocomplete>
            </v-col>
            <v-col>
                <v-autocomplete :disabled="disabled_colaborador" v-model="nit_colaborador" :items="colaboradores" item-text="nombre_completo" item-value="nit" hide-details outlined single-line label="Colaborador" @change="update_data()"></v-autocomplete>
            </v-col>
        </v-row>
    </div>
</template>

<script>

    import request from '@/functions/request'

    export default {
        props: {
            disabled_seccion: Boolean,
            disabled_colaborador: Boolean,
            prop_nit: String,
            prop_codarea: String
        },
        data(){
            return{
                areas: [],
                colaboradores: [],
                codarea: null,
                nit_colaborador: null,
                data_filtro: {
                    codarea: null,
                    nit: null
                }
            }
        },
        methods: {

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
            obtener_colaboradores(){

                this.data_filtro.codarea = this.codarea

                this.$emit('change_data', this.data_filtro)

				const data = {
					url: 'obtener_colaboradores',
					data: {
						codarea: this.codarea
					}
				}

				request.post(data)
				.then((response) => {
					this.colaboradores = response.data
				})

			},
            update_data(){
                
                this.data_filtro.nit = this.nit_colaborador

                this.$emit('change_data', this.data_filtro)

            }

        },
        watch: {
            prop_codarea: function(val){

                if (val) {
                    
                    this.codarea = val

                    this.obtener_colaboradores()

                }

            },
            prop_nit: function(val){

                this.nit_colaborador = val

            }
        },
        mounted(){

            if (this.prop_codarea) {
                
                this.codarea = this.prop_codarea

                this.obtener_colaboradores()

            }

            if (this.prop_nit) {
                
                this.nit_colaborador = this.prop_nit

            }

            this.obtener_areas()

        }
    }
</script>

<style>

</style>