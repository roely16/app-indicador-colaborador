<template>
    <div>
        <v-container>
            <v-form>
                <v-row>
                    <v-col>
                        <v-text-field filled label="Descripción" autocomplete="off"></v-text-field>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </div>
</template>

<script>
    export default {
        props: {
            criterio: Object
        },
        data(){
            return{

            }
        },
        methods: {

        },
        mounted(){

            console.log(this.criterio)

        }
    }
</script>

<style>

</style>