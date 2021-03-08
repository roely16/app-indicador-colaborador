<template>
    <div>

        <v-app-bar
            color="teal darken-1"
            dark
        >
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>ESTADO DE DESARROLLO</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn :to="{ name: 'home' }" icon>
                <v-icon>mdi-home</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-logout</v-icon>
            </v-btn>

        </v-app-bar>

    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>