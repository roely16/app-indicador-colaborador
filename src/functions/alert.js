import  Swal from 'sweetalert2'

var fun = {
    
    async show(data){

        const result = await Swal.fire({
            title: data.title,
            text: data.message,
            icon: data.type
        })
        
        if (result) {

            return true
        }


    },
    async show_confirm(data){

        const result = await Swal.fire({
            title: data.title,
            text: data.message,
            icon: data.type,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: data.confirm_text,
            cancelButtonText: data.cancel_text
        })
        
        if (result) {

            return result
        }


    },

    async show_confirm_input(data){

        const result = await Swal.fire({
            title: data.title,
            text: data.message,
            input: 'text',
            inputPlaceholder: data.placeholder,
            showCancelButton: true,
            icon: data.type,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
			confirmButtonText: data.confirm_text,
            cancelButtonText: data.cancel_text,
            inputValidator: (value) => {

				return new Promise((resolve) => {
					if (value.toUpperCase() == data.word_validation) {
						resolve()
					} else {
						resolve('Debe de escribir ' + data.word_validation + ' para confirmar')
					}
				})
            }
          })

        if (result) {

            return result
        }

    }

}

export default fun