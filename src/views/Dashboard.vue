<template>
    <div>
        <v-card class="mt-4 pl-4 pr-4">
			<v-card-text>
				<v-row>
					<v-col>
						<v-breadcrumbs
							:items="breadcrumbs"
							large
							class="ml-0 pl-0"
						></v-breadcrumbs>
					</v-col>
                    <v-spacer></v-spacer>
					<v-col align="end">
                        <v-autocomplete
							v-model="codarea"
							:items="areas"
							item-text="descripcion"
							item-value="codarea"
							outlined
							single-line
							label="Secciones"
							hide-details
							@change="obtener_colaboradores()"
						></v-autocomplete>
                    </v-col>
				</v-row>
			</v-card-text>

            <v-card-text>

				<v-row align="center" class="mb-2">
					<v-col md="4" v-for="(colaborador, key) in colaboradores" :key="key">
						<Indicador :colaborador="colaborador"></Indicador>
					</v-col>
                </v-row>
            </v-card-text>

			<v-card-text v-if="!codarea">
				<AlertSeleccion msg="Debe de seleccionar primero una sección"></AlertSeleccion>
			</v-card-text>
        </v-card>
    </div>
</template>

<script>

    import request from '@/functions/request.js'

    import Indicador from '@/components/dashboard/Indicador.vue'

	import AlertSeleccion from '@/components/AlertSeleccion'

    export default {
       
       components: {
           Indicador,
			AlertSeleccion
       },
        data(){
            return{

                breadcrumbs: [
					{
						text: 'Home',
						disabled: false,
						href: '#/home',
					},
					{
						text: 'Dashboard',
						disabled: true,
						href: 'breadcrumbs_link_1',
					},
				],
                codarea: null,
                areas: [],
                colaboradores: [],
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

        },
        mounted(){

            this.obtener_areas()

        }
    }
</script>