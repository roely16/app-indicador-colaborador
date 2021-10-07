<template>
    <div>
        <v-row align="center">
            <v-col v-if="permisos.secciones" cols="8">
                <v-autocomplete
                    outlined
                    placeholder="Sección o Proceso"
                    hide-details
                    :items="areas"
                    item-text="descripcion"
                    item-value="codarea"
                    multiple
                    v-model="areas_select"
                >

                    <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                            <span>{{ item.descripcion }}</span>
                        </v-chip>
                        <span
                            v-if="index === 1"
                            class="grey--text text-caption"
                        >
                            (+{{ areas_select.length - 1 }})
                        </span>
                    </template>
                </v-autocomplete>
            </v-col>
            <v-col align-self="center">
                
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    left
                    max-width="290px"
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                       
                        <v-input messages="Fecha de Visualización">
                            <v-chip v-bind="attrs" v-on="on" label color="success">
                                {{ date }} 
                                <v-icon class="ml-2">
                                    mdi-calendar
                                </v-icon>
                            </v-chip>
                        </v-input>
                    
                    </template>
                    <v-date-picker
                        v-model="date"
                        type="month"
                        no-title
                        scrollable
                    >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="() => {
                            $refs.menu.save(date)
                        }"
                    >
                        OK
                    </v-btn>
                    </v-date-picker>
                </v-menu>
            </v-col>
        </v-row>
        
    </div>
</template>

<script>
    
    import request from '@/functions/request.js'
    
    import { mapState, mapActions } from 'vuex'

    export default {
    
        data(){
            return{
                menu: false,
                areas: [],
            }
        },
        methods: {

            obtener_areas(){

                const route = this.$route.name

                const user = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

				const data = {
					url: 'obtener_areas',
					data: {
                        modulo: route,
                        nit: user.nit
                    }
				}

				request.post(data)
				.then((response) => {
					this.areas = response.data
				})

            },
            ...mapActions('permisos', ['verificar']),	
            set_values(){

                const usuario = JSON.parse(localStorage.getItem('app-estado-desarrollo'))

                this.$store.commit('filtro/setSelect', [usuario.codarea])

            }
        
        },
        computed: {
             ...mapState({
                permisos: state => state.permisos.permisos
             }), 
            areas_select: {
                get: function(){
                    return this.$store.getters['filtro/getAreas']
                },
                set: function(val){
                    this.$store.commit('filtro/setSelect', val)
                }
            },
            date: {
                get: function(){
                    return this.$store.getters['filtro/getDate']
                },
                set: function(val){
                    this.$store.commit('filtro/setDate', val)
                }
            }
        },
        mounted(){
            this.obtener_areas()
            const url = this.$route.name
            this.verificar(url)
            this.set_values()
        }

    }
</script>

<style>

</style>