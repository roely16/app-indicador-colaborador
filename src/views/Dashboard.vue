<template>
    <div>
        <v-card class="mt-4 pl-4 pr-4" min-height="700">
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
							:disabled="disabled_areas"
						></v-autocomplete>
                    </v-col>
				</v-row>
				<v-row dense>
					<v-col>
						<v-progress-circular
							indeterminate
							color="success"
							size="20"
							width="1"
							v-if="loading"
						></v-progress-circular>
					</v-col>
					<v-col cols="6" align="end">
						<v-chip label color="success">
                            {{ date }}
                        </v-chip>
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="date"
                            transition="scale-transition"
                            left
                            max-width="290px"
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon>
                                        mdi-calendar
                                    </v-icon>
                                </v-btn>
                           
                            </template>
                            <v-date-picker
                                v-model="date"
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
                                @click="() => {
									$refs.menu.save(date)
									obtener_colaboradores()
								}"
                            >
                                OK
                            </v-btn>
                            </v-date-picker>
                        </v-menu>

						<v-btn @click="obtener_colaboradores()" :disabled="!codarea" icon>
							<v-icon>
								mdi-refresh
							</v-icon>
						</v-btn>
					</v-col>
					
				</v-row>
				<v-divider class="mt-4"></v-divider>
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

	import verificar_permisos from '@/functions/verificar_permisos'

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
				loading: false,
				date: new Date().toISOString().substr(0, 7),
                menu: false,
                modal: false,
				disabled_areas: false
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

				this.loading = true

				const data = {
					url: 'dashboard_area',
					data: {
						codarea: this.codarea,
						month: this.date
					}
				}

				request.post(data)
				.then((response) => {
					this.colaboradores = response.data
					this.loading = false
				})

			},
			verificar_permisos(){

				const url = this.$route.name

				verificar_permisos.check(url)
				.then((response) => {
					
					if (!response.data.secciones) {
						
						const usuario = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

						this.codarea = usuario.codarea
						this.disabled_areas = true

					}else{

						this.disabled_areas = false

					}

					console.log(response.data);
				})

			},

        },
		watch: {

			codarea: function(val){

				if (val) {
					
					this.obtener_colaboradores()

				}

			},
			// date: function(val){

			// 	if (val) {
					
			// 		this.obtener_colaboradores()
					
			// 	}

			// }

		},
        mounted(){

			this.verificar_permisos()
            this.obtener_areas()

        }
    }
</script>