<template>
    <div>

        <v-row :class="margin_top" align="center" justify="center">
            <v-col cols="12">
                <v-row justify="center">
                    <v-col align="center" cols="12">
                        <v-img max-width="100" src="@/assets/img/info.png"></v-img>
                    </v-col>
                </v-row>
            </v-col>
            <v-col class="text-center" cols="12">
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
            msg: String,
            margin_top: {
                type: String,
                default: 'mt-10'
            }
        }
    }
</script>

<style>

</style>