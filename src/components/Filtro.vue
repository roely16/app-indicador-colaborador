<template>
    <div>
        <v-row dense>
            <v-col :cols="cols_areas">
                <v-autocomplete :disabled="disabled_seccion" hide-details v-model="codarea" :items="areas" item-text="descripcion" item-value="codarea" outlined single-line label="Sección" @change="$emit('getCodarea', codarea)"></v-autocomplete>
            </v-col>
            <v-col :cols="cols_colaboradores">
                <v-autocomplete :disabled="disabled_colaborador" v-model="nit_colaborador" :items="colaboradores" item-text="nombre_completo" item-value="nit" hide-details outlined single-line label="Colaborador" @change="$emit('getNit', nit_colaborador)"></v-autocomplete>
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
            prop_codarea: String,
            id_colaborador: String,
            cols_areas: {
                type: String,
                default: '6'
            },
            cols_colaboradores: {
                type: String,
                default: '6'
            }
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
            set(item){

                this.codarea = item.codarea
                this.nit_colaborador = item.id_persona

            },
            set_seccion(){

                if (this.disabled_seccion) {
                    
                    const usuario = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

                    this.codarea = usuario.codarea

                }

            }

        },
        watch: {
            codarea: function(val){

                if (val) {
                    
                    this.obtener_colaboradores()

                }

            },
            id_colaborador: function(val){

                if (val) {

                    this.nit_colaborador = val

                    this.$emit('getNit', this.nit_colaborador)

                }else{

                    this.nit_colaborador = null

                }
  
            }
        },
        mounted(){

            if (this.id_colaborador) {
                
                this.nit_colaborador = this.id_colaborador

                this.$emit('getNit', this.nit_colaborador)

            }else{

                this.nit_colaborador = null

            }

            this.set_seccion()
            this.obtener_areas()

        }
    }
</script>

<style>

</style>