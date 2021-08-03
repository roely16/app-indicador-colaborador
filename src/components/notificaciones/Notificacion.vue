<template>
    <div>
        <v-list two-line>
            <v-list-item>
                <v-list-item-icon>
                    <v-icon color="indigo">
                        mdi-alert-circle-outline
                    </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>
                        {{ title }}
                    </v-list-item-title>
                    <v-list-item-subtitle >
                        {{ subtitle }}
                    </v-list-item-subtitle>
                    
                    <v-row class="mt-1">
                        <v-col cols="3">
                            <v-btn @click="() => { mostrarDetalles(item) }" class="elevation-0" small>DETALLES</v-btn>
                        </v-col>
                    </v-row>

                </v-list-item-content>

                <v-list-item-icon>
                    <v-icon @click="() => { clearNotificacion(index) }" small>mdi-close</v-icon>
                </v-list-item-icon>
            </v-list-item>
            <v-divider></v-divider>
        </v-list>
    </div>
</template>

<script>
    
    import { mapActions } from 'vuex'

    export default {

        props: {
            title: String,
            subtitle: String,
            item: Object,
            index: Number
        },
        methods: {
            ...mapActions('notificaciones', [
                'mostrarDetalles',
                'clearNotificacion'
            ])
        }

    }

</script>

<style>

</style>