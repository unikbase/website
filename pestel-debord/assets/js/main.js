(() => {
	"use strict";

	const UNKB_SERVER_URL = 'https://dev1.unikbase.dev/meveo/rest/';
	const error_message = 'Nous ne trouvons pas votre lot, notre support va analyser votre borderau et vous contactera a l\'email {email}';


	const getPasseportData = async (passportUUID) => {
		const data = await fetch(UNKB_SERVER_URL + 'unikbase-token/' + passportUUID + '?mode=public', {
		}).then((response) => {
			return response.json();
		})

		if ( !data || data.status === 'fail' ) {
			return false;
		}
		return true;
	}
	const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        // Create a new FileReader object
        const reader = new FileReader();

        // Listen for the load event
        reader.addEventListener('load', function() {
            // The file's content will be in reader.result
            const base64String = reader.result.replace('data:', '')
                .replace(/^.+,/, '');

            resolve(base64String);
        });

        // Listen for the error event
        reader.addEventListener('error', function() {
            reject(reader.error);
        });

        // Read the file as a data URL
        reader.readAsDataURL(file);
    });
}

	document.addEventListener("click", (event) => {
		const target = event.target;
		const site = document.querySelector('.site');
		if ( target.classList.contains('close') ) {
			!!site  && site.classList.remove('error');
		}
		if ( target.classList.contains('btn-option-select')) {
			const options = document.querySelectorAll('.pricing-option');
			const activeOption = target.closest('.pricing-option');
			options.forEach((option) => {
				option.classList.remove('active');
				let inputField = option.querySelector('input');
				if ( inputField ) {
					inputField.removeAttribute('checked');
					inputField.checked = false;
				}
			});
			activeOption.classList.add('active');
			const input = activeOption.querySelector('input');
			if ( input ) {
				input.setAttribute('checked', 'checked');
				input.checked = true;
			}
		}
	});
	// add event checked
	document.addEventListener("change", (event) => {
		const target = event.target;
		if ( target.classList.contains('term-condition-agreement')) {
			if ( target.checked ) {
				document.querySelector('.btn-submit-form').removeAttribute('disabled');
			} else {
				document.querySelector('.btn-submit-form').setAttribute('disabled', 'disabled');
			}
		}
	})

	// Submit form handle
	const processForm = async (formData) => {
		const site = document.querySelector('.site');
		if ( site ) site.classList.add('loading');
		// get form data
		const passportUUID = formData.get('lot-number').replace(/\.0+$/,'').replace(".0", "-").replace(".", "-");
		let requestData = {
			uuid: passportUUID,
			client: {
				name: formData.get('name'),
				firtname: formData.get('firstname'),
				email: formData.get('email'),
				phone: formData.get('tel'),
			},
			// file: await readFileAsBase64(formData.get('bordereau')),
			plan: formData.get('pricing-option'),
		}
		let checkPassportExist = await getPasseportData(passportUUID);
		if ( !checkPassportExist ) {
			// Show error message
			let messageBox = document.querySelector('.error__message .content');
			if ( messageBox ) {
				messageBox.innerHTML = error_message.replace('{email}', requestData.client.email);
			}
			!!site && site.classList.remove('loading');
			!!site && site.classList.add('error');
			return false;
		}
		if ( plan !== 'free' ) {
			let price = 9.90;
		}
		
		!!site && site.classList.remove('loading');
	}
	const form = document.querySelector('#pestel-submittion');
	if ( form ) {
		form.addEventListener('submit', async (event) => {
			event.preventDefault();
			const formData = new FormData(form);
			processForm(formData);
		});
	}
})();