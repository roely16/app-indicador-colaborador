<template>
    <div>
        <v-row dense>
            <v-col>
                <v-autocomplete :disabled="disabled_seccion" hide-details v-model="codarea" :items="areas" item-text="descripcion" item-value="codarea" outlined single-line label="Sección" @change="$emit('getCodarea', codarea)"></v-autocomplete>
            </v-col>
            <v-col>
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

            }

        },
        watch: {
            codarea: function(val){

                if (val) {
                    
                    this.obtener_colaboradores()

                }

            },
        },
        mounted(){

            this.obtener_areas()

        }
    }
</script>

<style>

</style>