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
							filled
							label="Procesos"
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

			<v-card-text>
				<v-row v-if="!codarea" align="center" justify="center">
                    <v-col cols="12">
                        <v-row justify="center">
                            <v-col cols="2">
                                <v-img src="@/assets/img/info.png"></v-img>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="4">
                        <v-alert
                            border="right"
                            color="blue-grey"
                            dark
                        >
                            Debe de seleccionar primero un área.
                        </v-alert>
                    </v-col>
                </v-row>
			</v-card-text>
        </v-card>
    </div>
</template>

<script>

    import request from '@/functions/request.js'

    import Indicador from '@/components/dashboard/Indicador.vue'

    export default {
       
       components: {
           Indicador
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
					console.log(response.data)
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
					console.log(response.data)
					this.colaboradores = response.data
				})

			},

        },
        mounted(){

            this.obtener_areas()

        }
    }
</script>