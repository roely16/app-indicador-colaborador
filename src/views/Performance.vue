<template>
    <div>

        <v-card class="mt-4 pl-4 pr-4">
			<v-card-text class="mb-0 pb-0">
				<v-row>
					<v-col>
						<v-breadcrumbs
							:items="breadcrumbs"
							large
							class="ml-0 pl-0"
						></v-breadcrumbs>
					</v-col>
					<v-spacer></v-spacer>
					
				</v-row>
			</v-card-text>

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
						<v-btn color="teal darken-1" elevation="2" @click="modal_filtro()" dark fab>
							<v-icon>
								mdi-filter
							</v-icon>
						</v-btn>
					</v-col>
				</v-row>

                <v-data-table
					:search="search"
					:headers="headers"
					:items="items"
					:items-per-page="10"
					class="elevation-0"
					hide-default-footer
					:page.sync="page"
					@page-count="pageCount = $event"
				>

                    <template v-slot:[`item.calificacion`]="{item}">
						<v-chip small label :color="item.color" dark>
							{{ item.calificacion }}
						</v-chip>
					</template>

                    <template slot="no-data">
						
						<Alert msg="No hay datos disponibles"></Alert>

					</template>

                    <template v-slot:[`item.action`]="{ item }">
                        <v-btn @click="mostrar_editar(item)" x-small icon color="blue accent-4">
                            <v-icon>
                                mdi-information
                            </v-icon>
                        </v-btn>

                    </template>

                </v-data-table>

                <v-pagination
					v-if="items.length > 0"
					class="mt-4 mb-4"
					v-model="page"
					:length="pageCount"
				></v-pagination>

            </v-card-text>
        </v-card>

        <Modal ref="modal" :title="title" :width="width">
            <template #form>
                <FormFiltro ref="form"></FormFiltro>
            </template>
        </Modal>

        <Modal ref="modal_info" :title="title" :width="width">
            <template #form>
                <FormInfo ref="form"></FormInfo>
            </template>
        </Modal>

    </div>
</template>

<script>

    import Alert from '@/components/AlertSeleccion'

    import request from '@/functions/request'

    import Modal from '@/components/Modal'

    import FormFiltro from '@/components/performance/FormFiltro'
    import FormInfo from '@/components/performance/FormInfo'

    export default {
        components: {
			Alert,
            Modal,
            FormFiltro,
            FormInfo
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
                        text: 'Desempeño',
                        disabled: true,
                        href: 'breadcrumbs_link_1',
                    },
                ],
                search: null,
                headers: [],
				items: [],
                page: 1,
				pageCount: 0,
				itemsPerPage: 10,
                title: null,
                width: null
            }
        },
        methods: {

            obtener_datos(){

                const data = {
                    url: 'obtener_evaluaciones_performance',
                    data: null
                }

                request.post(data)
                .then((response) => {
                    this.headers = response.data.headers
                    this.items = response.data.items
                })

            },
            modal_filtro(){

                this.title = "Filtrar"
                this.width = "500"
                this.$refs.modal.show()

            },
            modal_info(){



            }

        },
        created(){

            this.obtener_datos()

        }
    }
</script>

<style>

</style>