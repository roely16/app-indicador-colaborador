<template>
    <div>

        <v-row class="mt-10" align="center" justify="center">
            <v-col cols="12">
                <v-row justify="center">
                    <v-col cols="2">
                        <v-img src="@/assets/img/info.png"></v-img>
                    </v-col>
                </v-row>
            </v-col>
            <v-col class="text-center" cols="4">
               <p class="overline">
                   {{ msg }}
               </p>
            </v-col>
        </v-row>

    </div>
</template>

<script>
    export default {
        props: {
            msg: String
        }
    }
</script>

<style>

</style>