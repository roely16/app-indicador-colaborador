<template>
    <div>
        <v-card class="mt-4 pl-4 pr-4">
            <v-card-text class="mb-0 pb-0">
                <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
            </v-card-text>

            <v-card-text>
                <v-tabs
                    dark
                    background-color="teal darken-1"
                    v-model="tab"
                >
                    <v-tab>Evaluaciones</v-tab>
                    <v-tab>Actividades</v-tab>                    
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item :key="0">
                        <Evaluaciones />                       
                    </v-tab-item>
                    <v-tab-item :key="1">
                         <Actividades />
                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>
        </v-card>
    </div>
</template>


<script>

    import Breadcrumb from '../components/home/Breadcrum'
    import Actividades from '../components/sgs/Actividades'
    import Evaluaciones from '../components/sgs/Evaluaciones'
    
    export default{
        components: {
            Breadcrumb,
            Actividades,
            Evaluaciones
        },
        data(){
            return{
                tab: 0,
                breadcrumbs: [
					{
						text: 'Home',
						disabled: false,
						href: '#/home',
					},
					{
						text: 'Sistema de Gestión de Servicios',
						disabled: true,
						href: 'breadcrumbs_link_1',
					},
				]
            }
        }
    }
</script>