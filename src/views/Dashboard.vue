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
							multiple
						>
							<template v-slot:selection="{ item, index }">
								<v-chip v-if="index === 0">
								<span>{{ item.descripcion }}</span>
								</v-chip>
								<span
								v-if="index === 1"
								class="grey--text text-caption"
								>
								(+{{ codarea.length - 1 }})
								</span>
							</template>
						</v-autocomplete>
                    </v-col>
				</v-row>
				<v-row align="center" dense>
					<v-col>
						<v-btn-toggle v-model="mode">
							<v-btn>
								<v-icon>mdi-view-grid</v-icon>
							</v-btn>

							<v-btn>
								<v-icon>mdi-view-list</v-icon>
							</v-btn>
						</v-btn-toggle>
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
				<v-divider class="mt-4 mb-0 pb-0"></v-divider>
				<v-progress-linear indeterminate color="green" v-if="loading"></v-progress-linear>
			</v-card-text>

			<v-card-text class="mt-0 pt-0 text-right">
				<v-btn :disabled="!this.colaboradores.length > 0" icon @click="exportar()">
					<v-icon>
						mdi-cloud-download
					</v-icon>
				</v-btn>
			</v-card-text>

            <v-card-text v-if="mode == 0">
				<v-row align="center">
					<v-col cols="12">
						<v-expansion-panels>
							<v-expansion-panel v-for="(area, i) in colaboradores" :key="i">
								<v-expansion-panel-header>
									<span class="overline text-h6">
										{{ area.descripcion }}
									</span>
								</v-expansion-panel-header>
								<v-expansion-panel-content>
									<v-row class="mt-4">
										<v-col md="4" v-for="(colaborador, key) in area.empleados" :key="key">
											<Indicador :colaborador="colaborador"></Indicador>
										</v-col>
									</v-row>
								</v-expansion-panel-content>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-col>
                </v-row>
            </v-card-text>

			<v-card-text v-if="mode == 1">
				<ListView></ListView>
			</v-card-text>

			<v-card-text v-if="codarea.length <= 0">
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

	import ListView from '@/components/dashboard/ListView'
	
	import { mapMutations } from 'vuex'

    export default {
       
       components: {
           Indicador,
			AlertSeleccion,
			ListView
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
                codarea: [],
                areas: [],
                colaboradores: [],
				loading: false,
				date: new Date().toISOString().substr(0, 7),
                menu: false,
                modal: false,
				disabled_areas: false,
				mode: 0
            }
        },
        methods: {

			...mapMutations('dashboard', [
				'setDashboard'
			]),
            obtener_areas(){

				const route = this.$route.name

                const user = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

				const data = {
					url: 'obtener_areas',
					data: {
                        modulo: route,
                        nit: user.nit
                    }
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
					this.setDashboard(this.colaboradores)

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
			exportar(){

				const data = {
					url: 'export_dashboard',
					data: {
						codarea: this.codarea,
						month: this.date
					},
					headers: {
						responseType: 'blob'
					}
				}

				request.post(data)
				.then((response) => {

					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', 'dashboard.xlsx');
					document.body.appendChild(link);
					link.click();

				})

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

			this.verificar_permisos()
            this.obtener_areas()

        }
    }
</script>