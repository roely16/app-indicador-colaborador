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
                <v-row class="mb-4">
                    <v-col cols="6">
                        <Grupos></Grupos>
                    </v-col>
                    <v-col>
                        <Secciones></Secciones>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

    </div>
</template>

<script>

    import Grupos from '@/components/sso/Grupos'
    import Secciones from '@/components/sso/Secciones'

    export default {
        components: {
            Grupos,
            Secciones
        },
        data(){
            return{
                search: null,
                breadcrumbs: [
					{
						text: 'Home',
						disabled: false,
						href: '#/home',
					},
					{
						text: 'Seguridad Ocupacional',
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