<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                   <IntegrantesGrupo :id_grupo="id_grupo"></IntegrantesGrupo>
                </v-col>
                <v-col>
                    <ActividadesGrupo></ActividadesGrupo>
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

            }
        },
        created(){



        }
    }
</script>

<style>

</style>