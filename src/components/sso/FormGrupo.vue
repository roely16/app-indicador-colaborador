<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                   <IntegrantesGrupo @updateActividad="(data) => { data_actividad = data }" :id_actividad="id_actividad" :id_grupo="id_grupo"></IntegrantesGrupo>
                </v-col>
                <v-col>
                    <ActividadesGrupo :data_actividad="data_actividad" @actividadCheck="(value) => { id_actividad = value }" :id_grupo="id_grupo"></ActividadesGrupo>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

    import IntegrantesGrupo from '@/components/sso/IntegrantesGrupo'
    import ActividadesGrupo from '@/components/sso/ActividadesGrupo'

    export default {
        
        components: {
            IntegrantesGrupo,
            ActividadesGrupo
        },
        props: {
            id_grupo: Number
        },
        data(){
            return{
                id_actividad: null,
                data_actividad: null
            }
        },
        created(){



        }
    }
</script>

<style>

</style>