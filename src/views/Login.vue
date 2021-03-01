<template>
	<v-row class="fill-height" align="center" justify="center">
		<v-col>
			<v-card outlined class="mx-auto my-12" max-width="374">
				<template slot="progress"> </template>

				<v-img
					height="150"
					contain
					src="@/assets/img/logo_muni.jpg"
				></v-img>

				<v-card-text>
					
					<Form></Form>

				</v-card-text>
			
			</v-card>
		</v-col>
	</v-row>
</template>

<script>

    import Form from '@/components/login/Form'

    export default {
        components: {
            Form
        }
    };
</script>

<style>

</style>