<template>
    <div>

        <v-app-bar
            color="teal darken-1"
            dark
            height="70"
        >
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>
                ESTADO DE DESARROLLO
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn :to="{ name: 'home' }" icon>
                <v-icon>mdi-home</v-icon>
            </v-btn>
            <v-btn @click="salir()" icon>
                <v-icon>mdi-logout</v-icon>
            </v-btn>

        </v-app-bar>

    </div>
</template>

<script>

    import alert from '@/functions/alert'

    export default {
        methods: {

            salir(){

                const alert_msg = {
                    title: "¿Está seguro?",
                    message: "Deberá ingresar nuevamente sus credenciales",
                    type: "warning",
                    confirm_text: "SALIR",
                    cancel_text: "CANCELAR"
                }

                alert.show_confirm(alert_msg)
                .then((result) => {

                    if (result.isConfirmed) {
                        
                        localStorage.removeItem('app-estado-desarrollo')
                        this.$router.push({name: 'login'})

                    }

                })

            }

        }
    }
</script>

<style>

</style>