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
						<v-btn color="success" @click="mostrar_modal()" large>
							<v-icon>
								mdi-plus
							</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-card-text>

			<!-- Tabla de registros -->
			<v-card-text>

				<v-row align="center" class="mb-2">
					<v-col md="4">
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
					<v-col md="4">
						<v-autocomplete
							v-model="colaborador"
							:items="colaboradores"
							item-text="nombre_completo"
							item-value="nit"
							filled
							label="Colaborador"
							hide-details
						></v-autocomplete>
					</v-col>
					<v-col>
						<v-text-field
							append-icon="mdi-magnify"
							label="Buscar..."
							single-line
							hide-details
							filled
							autocomplete="off"
						></v-text-field>
					</v-col>
				</v-row>

				<v-data-table
					:headers="headers"
					:items="reportes"
					:items-per-page="5"
					class="elevation-0"
					hide-default-footer
					:page.sync="page"
					@page-count="pageCount = $event"
				></v-data-table>

				<v-pagination
					class="mt-4 mb-4"
					v-model="page"
					:length="pageCount"
				></v-pagination>
			</v-card-text>
		</v-card>

		<Modal :width="width" :title="title" ref="modal">
			<template #form>
				<Form @closeModal="close_modal"></Form>
			</template>
		</Modal>
	</div>
</template>

<script>

	import Modal from '@/components/Modal.vue'
	import Form from '@/components/productividad/Form.vue'

	import request from '@/functions/request.js'

	export default {
		components: {
			Modal,
			Form
		},
		data(){
			return{
				items: ['foo', 'bar', 'fizz', 'buzz'],
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
						text: 'Metodología 5S',
						disabled: true,
						href: 'breadcrumbs_link_1',
					},
				],
				headers: [],
				reportes: [],
			}
		},
		methods: {

			mostrar_modal(){
				this.title = "Agregar Reporte"
				this.width = '800'
				this.$refs.modal.show()
			},
			close_modal(){
				this.$refs.modal.close()
			},
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
			obtener_reportes(){

				const data = {
					url: 'obtener_reportes',
					data: null
				}

				request.post(data)
				.then((response) => {
					console.log(response.data)
					this.headers = response.data.headers
					this.reportes = response.data.items
				})

			}

		},
		mounted(){

			this.obtener_areas()
			this.obtener_reportes()

		}
	}
</script>

<style>

</style>