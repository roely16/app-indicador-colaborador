<template>
	<div>
		<v-form @submit.prevent="login" ref="form" v-model="valid">
			<v-row>
				<v-col cols="12">
					<v-text-field v-model="usuario.usuario" prepend-icon="mdi-account" :rules="[v => !!v]" label="Usuario" hide-details solo autocomplete="off"></v-text-field>
				</v-col>
				<v-col cols="12">
					<v-text-field v-model="usuario.pass" type="password" prepend-icon="mdi-lock" :rules="[v => !!v]" label="Contraseña" hide-details solo autocomplete="off"></v-text-field>
				</v-col>
			</v-row>

			<v-row align="center">
				<v-col class="text-center">
					<v-btn :disabled="loading" :loading="loading" type="submit" large color="teal" :dark="!loading">
						INGRESAR 
						<v-icon>
							mdi-login
						</v-icon>
					</v-btn>
				</v-col>
			</v-row>
		</v-form>
	</div>
</template>

<script>

	import request from '@/functions/request'
	import alert from '@/functions/alert'

	export default {
		data(){
			return{
				valid: true,
				usuario: {
					usuario: null,
					pass: null
				},
				loading: false
			}
		},
		methods: {
			login(){

				this.$refs.form.validate()

				if (this.valid) {
					
					this.loading = true

					
					const data = {
						url: 'login',
						data: this.usuario
					}

					request.post(data)
					.then((response) => {

						if (response.data.status != 200) {
							
							alert.show(response.data)

						}else{

							// Almacenar en localStorage
							const datos_usuarios = {
								nombre: response.data.data.nombre,
								apellido: response.data.data.apellido,
								nit: response.data.data.nit,
								codarea: response.data.data.codarea,
								seccion: response.data.data.seccion,
								imagen: response.data.data.imagen,
							}

							localStorage.setItem('app-estado-desarrollo', JSON.stringify(datos_usuarios))

							this.$router.push({name: 'home'})

						}

						this.loading = false
					})
					

				}

			}
		}
	}
</script>

<style lang="scss" scoped>
</style>