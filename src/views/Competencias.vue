<template>
    <div>

        <v-card class="mt-4 pl-4 pr-4">
            <v-card-text class="mb-0 pb-0">
                <v-row align="center">
                    <v-col cols="4">
                        <v-breadcrumbs
                            :items="breadcrumbs"
                            large
                            class="ml-0 pl-0"
                        ></v-breadcrumbs>
                    </v-col>
					<v-col align="end">
						<v-btn @click="mostrar_configuracion()" v-if="conf" color="grey lighten-1" label small outlined rounded> 
							CONFIGURACIÓN
							<v-icon>
								mdi-cog
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
							v-model="search"
							prepend-inner-icon="mdi-magnify"
							label="Buscar..."
							single-line
							hide-details
							outlined
							autocomplete="off"
						></v-text-field>
					</v-col>
					<v-col align="end">
						<v-btn :disabled="!escritura || !habilitar" color="teal darken-1" elevation="2" @click="mostrar_modal()" dark fab>
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
					:items-per-page="10"
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

						<v-btn @click="mostrar_seguimiento(item)" x-small icon class="mr-2" color="orange">
							<v-icon>
								mdi-clipboard-list
							</v-icon>
						</v-btn>

                        <v-btn :disabled="!admin"  @click="mostrar_editar(item)" x-small icon color="blue accent-4">
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
					v-if="reportes.length > 0"
					class="mt-4 mb-4"
					v-model="page"
					:length="pageCount"
					:total-visible="7"
				></v-pagination>
			</v-card-text>

        </v-card>

        <Modal :fullscreen="fullscreen" :width="width" :title="title" ref="modal">
			<template #form>
				<Form ref="form" :id_area="id_area" :id_evaluacion="id_evaluacion" :nit="id_colaborador" @update="obtener_reportes" :secciones_prop="secciones" @closeModal="close_modal"></Form>
			</template>
		</Modal>

		<Modal :fullscreen="fullscreen" :width="width" :title="title" ref="modal_conf">
			<template #form>
				<Conf></Conf>
			</template>
		</Modal>

    </div>
</template>

<script>

    import Modal from '@/components/Modal.vue'
	import Form from '@/components/competencias/Form.vue'
	import Conf from '@/components/competencias/Conf.vue'
	// import Seguimiento from '@/components/competencias/Seguimiento.vue'

    import verificar_permisos from '@/functions/verificar_permisos'

    import Alert from '@/components/AlertSeleccion'

	import request from '@/functions/request'
	import sw_alert from '@/functions/alert'

    export default {
        components: {
            Alert,
            Modal,
            Form,
			Conf,
			// Seguimiento
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
						text: 'Competencias',
						disabled: true,
						href: 'breadcrumbs_link_1',
					},
				],
                headers: [],
				reportes: [],
				escritura: false,
				secciones: false,
				conf: false,
				admin: false,
				id_evaluacion: null,
				id_colaborador: null,
				id_area: null,
                fullscreen: false,
				habilitar: false
            }

        },
        methods: {
            async verificar_permisos(){

				const url = this.$route.name

				verificar_permisos.check(url)
				.then((response) => {

					this.escritura = response.data.escritura
					this.secciones = true,
					this.conf = response.data.conf
					this.habilitar = response.data.habilitar
					this.admin = response.data.admin

					if (!this.secciones) {
						
						const usuario = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

						this.id_area = usuario.codarea

					}
				})

			},
            mostrar_modal(){

                this.title = "Generar Evaluación"
                this.fullscreen = true
                this.id_evaluacion = null
				this.id_colaborador = null
				this.id_area = null
				
				this.verificar_permisos()
				.then(() => {

					this.$refs.modal.show()
					.then(() => {

						this.$refs.form.clear()

					})

				})
				

            },
			mostrar_configuracion(){
				
				this.title = "Periodos de Evaluación"
				this.width = "800"
				this.fullscreen = false

				this.$refs.modal_conf.show()

			},
            close_modal(){
				this.$refs.modal.close()
			},
            obtener_reportes(){

				const url = this.$route.name

				const usuario = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

				const data = {
					url: 'obtener_evaluaciones_competencia',
					data: {
						url: url,
						nit: usuario.nit,
						codarea: usuario.codarea
					}
				}

				request.post(data)
				.then((response) => {

					this.headers = response.data.headers
					this.reportes = response.data.items

				})

            },
			mostrar_editar(item){

				this.title = "Editar Evaluación"
				this.fullscreen = true
				this.id_evaluacion = item.id
				this.id_colaborador = item.id_persona
				this.id_area = item.codarea
				this.secciones = false
				
				this.$store.commit('setEdit', true)

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
							url: 'eliminar_evaluacion_competencia',
							data: {
								id: item.id
							}
						}

						request.post(data)
						.then((response) => {

							console.log(response.data)

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
			mostrar_seguimiento(item){

				this.$store.commit('setIdEvaluacion', item.id)

				this.title = "Seguimiento de Competencias"
				this.width = "800"
				this.fullscreen = true

				this.id_evaluacion = item.id
				this.id_colaborador = item.id_persona
				this.id_area = item.codarea
				this.secciones = false

				this.$store.commit('setEdit', false)

				this.$refs.modal.show()

			}

        },
		computed: {

		},
        mounted(){

            this.verificar_permisos()

			this.obtener_reportes()

        }
    }
</script>

<style>

</style>