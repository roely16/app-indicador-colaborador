<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-expansion-panels>
                    <v-expansion-panel v-for="(area, i) in dashboard" :key="i">
                        <v-expansion-panel-header>
                            <span class="overline text-h6">
                                {{ area.descripcion }}
                            </span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>

                            <v-row class="mt-4">
                                <v-col>
                                    <List :items="area.empleados"></List>
                                </v-col>
                            </v-row>

                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                
            </v-col>
        </v-row>
    </div>
</template>

<script>

    import List from '@/components/dashboard/List'
    import { mapState } from 'vuex'

    export default {
        components: {
            List
        },
        computed: {

            ...mapState('dashboard', [
                'dashboard'
            ])

        }
    }
</script>

<style>

</style>