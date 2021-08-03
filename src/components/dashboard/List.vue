<template>
    <div>
        <v-row>
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="1" class="text-center" v-for="(criterio, key) in criterios" :key="key">
                <!-- <span class="text-caption">
                    {{ criterio.nombre }}
                </span> -->
                <v-avatar>
                    <v-img :src="require('@/assets/img/' + criterio.icon)"></v-img>
                </v-avatar>
            </v-col>
        </v-row>
        <v-row v-for="(item, key) in items" :key="key">
            <v-col cols="12" md="4">
                {{ item.nombre }} {{ item.apellido }}
            </v-col>
            <v-col cols="1" class="text-center" v-for="(data_criterio, key) in item.criterios" :key="key">
                <span :class="data_criterio.color + '--text text-button font-weight-bold'" v-if="data_criterio.calificacion">
                    {{ Math.round(data_criterio.calificacion) }}
                </span>
                <span v-if="data_criterio.pendiente">
                    <v-icon size="15">
                        mdi-account-clock
                    </v-icon>
                </span>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        props: {
            items: Array
        },
        data(){
            return{
                criterios: [
                    {
                        nombre: "Productividad",
                        icon: 'productivity.png'
                    },
                    {
                        nombre: "ISO",
                        icon: 'quality-control.png'
                    },
                    {
                        nombre: "5'S",
                        icon: 'desk.png'
                    },
                    {
                        nombre: "Oficinia Verde",
                        icon: 'recycling.png'
                    },
                    {
                        nombre: "Convivencia",
                        icon: 'united.png'
                    },
                    {
                        nombre: "SSO",
                        icon: 'life-jacket.png'
                    },
                    {
                        nombre: "Desempeño",
                        icon: 'growth.png'
                    },
                    {
                        nombre: "Competencias",
                        icon: 'user.png'
                    }
                ]
            }
        }
    }
</script>

<style>

</style>