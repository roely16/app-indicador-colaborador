<template>
    <div>
    <v-row>
        <v-col>
            <v-breadcrumbs
                :items="breadcrumbs"
                large
                class="ml-0 pl-0"
            ></v-breadcrumbs>
        </v-col>
    </v-row>
    </div>
</template>

<script>
    export default {
        props: {
            breadcrumbs: Array
        },
        data() {
            return{
                
            }
        },
    }
</script>