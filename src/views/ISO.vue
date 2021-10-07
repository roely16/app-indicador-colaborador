<template>
    <div>
		<v-card class="mt-4 pl-4 pr-4">
			<v-card-text class="mb-0 pb-0">
				<v-row align="center">
					<v-col>
						<v-breadcrumbs
							:items="breadcrumbs"
							large
							class="ml-0 pl-0"
						></v-breadcrumbs>
					</v-col>
					
					<v-col v-if="admin" align="end">
						<v-btn @click="exportar()" color="grey lighten-1" label small outlined rounded> 
							EXPORTAR
							<v-icon>
								mdi-table-arrow-right
							</v-icon>
						</v-btn>
					</v-col>
					
				</v-row>
			</v-card-text>

			<!-- Tabla de registros -->
			<v-card-text>

				<v-row align="center" class="mb-2">
					<v-col cols="4">
						<v-text-field
							prepend-inner-icon="mdi-magnify"
							label="Buscar..."
							single-line
							hide-details
							outlined
							autocomplete="off"
							v-model="search"
						></v-text-field>
					</v-col>

					<v-col cols="6">
						<Filtro />
					</v-col>

					<v-col align="end">
						<v-btn :disabled="!escritura" color="teal darken-1" elevation="2" @click="mostrar_modal()" dark fab>
							<v-icon>
								mdi-plus
							</v-icon>
						</v-btn>
					</v-col>
				</v-row>

				<v-data-table
					:search="search"
					:headers="headers"
					:items="reportes"
					:items-per-page="5"
					class="elevation-0"
					hide-default-footer
					:page.sync="page"
					@page-count="pageCount = $event"
				>

					<template slot="no-data">
						
						<Alert msg="No hay datos disponibles"></Alert>

					</template>

					<template v-slot:[`item.calificacion`]="{item}">
						<v-chip small label :color="item.color" dark>
							{{ item.calificacion }}
						</v-chip>
					</template>

					<template v-slot:[`item.action`]="{ item }">
						<v-btn :disabled="!admin" @click="mostrar_editar(item)" x-small icon color="blue accent-4">
							<v-icon>
								mdi-pencil
							</v-icon>
						</v-btn>

						<v-btn :disabled="!admin" @click="eliminar(item)" class="ml-2" x-small icon color="red accent-4">
							<v-icon>
								mdi-delete
							</v-icon>
						</v-btn>

					</template>

				</v-data-table>

				<v-pagination
					class="mt-4 mb-4"
					v-model="page"
					:length="pageCount"
					v-if="reportes.length > 0"
					:total-visible="5"
				></v-pagination>
			</v-card-text>
		</v-card>

		<Modal :width="width" :title="title" ref="modal">
			<template #form>
				<Form ref="form" :id_evaluacion="id_evaluacion" :id_area="id_area"  :id_colaborador="id_colaborador" @update="obtener_reportes" :secciones="secciones" @closeModal="close_modal"></Form>
			</template>
		</Modal>

		<!-- 
			Modal para exportar los datos
		-->

		<Modal :width="width" :title="title" ref="modal_export">
			<template #form>
				<Exportar></Exportar>
			</template>
		</Modal>
	</div>
</template>

<script>

	import Modal from '@/components/Modal.vue'
	import Form from '@/components/productividad/Form.vue'
	import Exportar from '@/components/Exportar.vue'

	import request from '@/functions/request.js'
	import verificar_permisos from '@/functions/verificar_permisos'

	import Alert from '@/components/AlertSeleccion'

	import sw_alert from '@/functions/alert'
	
	import Filtro from '@/components/home/Filtro.vue'

	import { mapState } from 'vuex'

	export default {
		components: {
			Modal,
			Form,
			Alert,
			Exportar,
			Filtro
		},
		data(){
			return{
				search: null,
				codarea: null,
				colaborador: null,
				page: 1,
				pageCount: 0,
				itemsPerPage: 10,
				width: null,
				title: null,
				areas: [],
				colaboradores: [],
				breadcrumbs: [
					{
						text: 'Home',
						disabled: false,
						href: '#/home',
					},
					{
						text: 'ISO 9001',
						disabled: true,
						href: 'breadcrumbs_link_1',
					},
				],
				headers: [],
				reportes: [],
				escritura: false,
				secciones: false,
				admin: false,
				id_evaluacion: null,
				id_colaborador: null,
				id_area: null,
				criterio: {}
			}
		},
		methods: {

			mostrar_modal(){
				
				this.title = "Generar Evaluación"
				this.width = '1000'
				this.id_evaluacion = null
				this.id_colaborador = null
				this.id_area = null

				this.verificar_permisos()
				.then(() => {

					this.$refs.modal.show()

				})

			},
			close_modal(){
				this.$refs.modal.close()
			},
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
			obtener_reportes(){

				const url = this.$route.name

				const usuario = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

				const data = {
					url: 'obtener_evaluaciones',
					data: {
						url: url,
						nit: usuario.nit,
						codarea: usuario.codarea,
						areas: this.areas_select,
						date: this.date
					}
				}

				request.post(data)
				.then((response) => {
					this.headers = response.data.headers
					this.reportes = response.data.items
				})

			},
			async verificar_permisos(){

				const url = this.$route.name

				verificar_permisos.check(url)
				.then((response) => {
					
					this.escritura = response.data.escritura
					this.secciones = response.data.secciones
					this.admin = response.data.admin
					this.criterio = response.data.criterio

					this.$store.commit('setCriterio', this.criterio)

					if (!this.secciones) {
						
						const usuario = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

						this.id_area = usuario.codarea

					}

				})

			},
			mostrar_editar(item){

				this.title = "Editar Evaluación"
				this.width = '1000'
				this.id_evaluacion = item.id
				this.id_colaborador = item.id_persona
				this.id_area = item.codarea
				this.secciones = false

				this.$refs.modal.show()

			},
			eliminar(item){

				const data_alert = {
					title: '¿Está seguro?',
					message: 'Una vez eliminada no se podrá recuperar!',
					type: 'warning',
					confirm_text: 'ELIMINAR',
					cancel_text: 'Cancelar'
				}

				sw_alert.show_confirm(data_alert)
				.then((result) => {

					if (result.isConfirmed) {
						
						const data = {
							url: 'eliminar_evaluacion',
							data: {
								id: item.id
							}
						}

						request.post(data)
						.then((response) => {

							if (response.data.status == 200) {
								
								sw_alert.show(response.data)
								.then(() => {
									this.obtener_reportes()
								})

							}
						})

					}

				})

			},
			exportar(){

				this.title = "Exportar Datos"
				this.width = '600'

				this.$refs.modal_export.show()

			}
		},
		computed: {

			...mapState('filtro', {
				areas_select: state => state.areas_select,
				date: state => state.date
			})

		},
		watch: {
			date: function(){
				this.obtener_reportes()
			},
			areas_select: function(){
				this.obtener_reportes()
			}
		},
		mounted(){

			this.verificar_permisos()

			this.obtener_areas()
			this.obtener_reportes()

		}
	}
</script>

<style>

</style>