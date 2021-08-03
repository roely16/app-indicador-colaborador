<template>
    <div>
        <v-card min-width="400" max-width="400">
            <v-card-text>

                <v-row>
                    <v-col>
                        <span class="overline">
                            Notificaciones
                        </span>
                    </v-col>
                    <v-col align="right">
                        <v-progress-circular v-if="loading" indeterminate color="grey lighten-1"></v-progress-circular>
                    </v-col>
                </v-row>
                
            </v-card-text>

            <v-card-text v-if="items.length > 0" class="pl-0 pr-0 pt-0 pb-0 text-center">
                <v-virtual-scroll
                    height="300"
                    item-height="120"
                    :items="items"
                    :bench="benched"
                    v-if="items.length > 0"
                >
                    <template v-slot:default="{ item, index }">
                        <Notificacion :index="index" :item="item" :title="item.title" :subtitle="item.subtitle"></Notificacion>
                    </template>
                </v-virtual-scroll>

            </v-card-text>

            <v-card-text v-if="items.length <= 0">
                <v-row justify="center">
                    <v-col cols="6">
                        <v-img max-width="200" :src="require('@/assets/img/folder.png')"></v-img>
                    </v-col>
                    <v-col class="text-center" cols="12">
                        <span class="overline">Sin notificaciones pendientes</span>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

    import Notificacion from '@/components/notificaciones/Notificacion'
    import { mapState } from 'vuex'

    export default {
        components: {
            Notificacion
        },
        data(){
            return{
                benched: 0,
                selected: [2],
            }
        },
        methods: {

        },
        computed: {

            ...mapState('notificaciones', {
                items: 'notificaciones',
                loading: 'loading'
            })

        },
        
    }
</script>

<style>

</style>