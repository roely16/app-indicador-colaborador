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
				</v-row>

            </v-card-text>

            <v-card-text class="mt-0 pt-0">

                <v-tabs
                    background-color="teal lighten-1"
                    dark
                    grow
                    v-model="tab"
                >
                    <v-tab>Perfiles</v-tab>
                    <v-tab>Permisos</v-tab>
                    <v-tab>Mantenimiento</v-tab>
                </v-tabs>

                <v-tabs-items
                    v-model="tab"
                >
                    <v-tab-item>
                        <Perfiles></Perfiles>
                    </v-tab-item>
                    <v-tab-item>
                        <Permisos></Permisos>
                    </v-tab-item>
                    <v-tab-item>
                        <Mantenimiento></Mantenimiento>
                    </v-tab-item>
                </v-tabs-items>

            </v-card-text>
        </v-card>
    </div>
</template>

<script>

    import Perfiles from '@/components/configuracion/Perfiles.vue'
    import Mantenimiento from '@/components/configuracion/Mantenimiento.vue'
    import Permisos from '@/components/configuracion/Permisos.vue'

    export default {
        components: {
            Perfiles,
            Mantenimiento,
            Permisos
        },
        data(){
            return{
                tab: 2,
                breadcrumbs: [
					{
						text: 'Home',
						disabled: false,
						href: '#/home',
					},
					{
						text: 'Configuración',
						disabled: true,
						href: 'breadcrumbs_link_1',
					},
				],

            }
        }
    }
</script>

<style>

</style>