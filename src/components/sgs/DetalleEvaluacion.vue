<template>
    <div>
        <v-container fluid>
            <v-row>
                <v-col cols="4">
                    <Actividades />
                </v-col>
                <v-col cols="4">
                    <Responsables />
                </v-col>
                <v-col cols="4">
                    <Colaboradores />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

    import Actividades from '@/components/sgs/detalle_evaluacion/Actividades'
    import Responsables from '@/components/sgs/detalle_evaluacion/Responsables'
    import Colaboradores from '@/components/sgs/detalle_evaluacion/Colaboradores'

    export default {

        components: {
            Actividades,
            Colaboradores,
            Responsables
        },
        data(){
            return{

            }
        }
    }

</script>