<template>
	<div>
		<AppBar></AppBar>

		<v-container v-if="isHome">
			<Menu></Menu>
		</v-container>
		
		<v-container>
            <router-view></router-view>
        </v-container>
	</div>
</template>

<script>

	import AppBar from '@/components/home/AppBar'
	import Menu from '@/components/home/Menu'

	export default {
		components: {
			AppBar,
			Menu
		},
		data(){
			return{

			}
		},
		computed: {
			isHome: function(){

				if (this.$route.name == 'home') {
					
					return true
					
				}

				return false

			}
		}
		
	}
</script>
