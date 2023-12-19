(() => {
	"use strict";

	const UNKB_SERVER_URL = 'https://dev1.unikbase.dev/meveo/rest/';
	const STRIPE_PAYMENT_URL = 'https://dev1.unikbase.dev/meveo/rest/stripe-checkout';
	const UNKB_PESTEL_SIGNUP_URL = 'https://collector-dev.unikbase.dev/tpk-signup';
	const PRICE_ID = 1;
	const PRICE_VALUE = 9.9;
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
	const sendStripePayment = async (requestData) => {
		let payload = {
			"operator-code": requestData["operator-code"],
			tpk_id: requestData.tokenUUID,
			tokenUUID: requestData.tokenUUID,
			price_id: PRICE_ID+'',
			value: PRICE_VALUE+'', //price_item
			name: requestData.name,
			firstname: requestData.firstname,
			email: requestData.email,
			phone: requestData.phone,
			width: requestData.width,
			height: requestData.height,
			commercialOfferCode: requestData.commercialOfferCode
		};
		
		fetch(STRIPE_PAYMENT_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload)
		}).then((response) => {
			try {
				return response.json();
			} catch (e) {
				return response;
			}
		}).then((data) => {
			let url = data?.result?.url;
			if ( !!data.error || url === undefined ) {
				// Show error message
				let site = document.querySelector('.site');
				let messageBox = document.querySelector('.error__message .content');
				if ( messageBox ) {
					messageBox.innerHTML = data.message || data.result;
				}
				!!site && site.classList.remove('loading');
				!!site && site.classList.add('error');
				return false;
			}
			let session_id = url
				.split("https://checkout.stripe.com/c/pay/")
				.join("");
			session_id = session_id.split('#')[0]
			
			localStorage.setItem("_pestel_stripe_session_id", session_id);
			localStorage.setItem(`_pestel_request_${session_id}`, JSON.stringify({
				...payload,
				currency: data?.currency || '€'
			}));
			window.location.href = url;
		});
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
		const operator = formData.get('operator-code') || 'PSTL';
		const passportUUID = formData.get('lot-number').replace(/\.0+$/,'').replace(".0", "-").replace(".", "-");
		// const plan = site.querySelector('input[name="pricing-option"]:checked').toUpperCase();
		// Get plan value from checkbox checked input
		let plan = '';
		const options = document.querySelectorAll('.pricing-option');
		options.forEach((option) => {
			const input = option.querySelector('input');
			if ( input && input.checked ) {
				plan = input.value.toUpperCase();
			}
		})
		
		let tokenUUID = `${operator}_231219-${passportUUID}`;
		let requestData = {
			tokenUUID,
			name: formData.get('name'),
			firtname: formData.get('firstname'),
			email: formData.get('email'),
			phone: formData.get('tel'),
			width: formData.get('width'),
			height: formData.get('height'),
			sign: formData.get('sign'),
			commercialOfferCode: plan,
			"operator-code": operator,
		}
		let checkPassportExist = await getPasseportData(tokenUUID);
		if ( !checkPassportExist ) {
			// Show error message
			let messageBox = document.querySelector('.error__message .content');
			if ( messageBox ) {
				messageBox.innerHTML = error_message.replace('{email}', requestData.email);
			}
			!!site && site.classList.remove('loading');
			!!site && site.classList.add('error');
			return false;
		}

		if ( plan !== 'BASIC' ) {
			// send to stripe
			sendStripePayment(requestData);
		} else {
			let params = Object.keys(requestData).map((key) => { return requestData[key] ? key + '=' + encodeURIComponent(requestData[key]) : '' }).filter(item => !!item).join('&');
			window.location.href = UNKB_PESTEL_SIGNUP_URL + '?' + params;
			!!site && site.classList.remove('loading');
		}
	}
	const form = document.querySelector('#pestel-submittion');
	if ( form ) {
		form.addEventListener('submit', async (event) => {
			event.preventDefault();
			// create new FormData included disabled fields

			const formData = new FormData(form);
			processForm(formData);
		});
	}
  // Generate function get all query string from url
	const getQueryString = () => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		return [{
			'operator-code': urlParams.get('operator-code') || 'PSTL',
			'lot-number': urlParams.get('lot-number'),
			'firstname': urlParams.get('firstname'),
			'name': urlParams.get('name'),
			'email': urlParams.get('email'),
			'phone': urlParams.get('phone'),
			'width': urlParams.get('width'),
			'height': urlParams.get('height'),
			'sign': urlParams.get('sign'),
		}, {
			'coverImage': urlParams.get('image'),
			'description': urlParams.get('description')
		}]
	}

	// event when document ready
	document.addEventListener("DOMContentLoaded", () => {
		const site = document.querySelector('.site');
		const [requestData, token] = getQueryString();
		if ( token.coverImage ) {
			let image = document.querySelector('.passport__thumbnail');
			image.style.backgroundImage = `url(${token.coverImage})`;
		}
		if ( token.description ) {
			let description = document.querySelector('.passport__description');
			description.innerHTML = token.description;
		}
		if ( token.coverImage && token.description ) {
			document.querySelector('.passport').classList.remove('hide');
		} else {
			document.querySelector('.passport').classList.add('hide');
		}

		const form = site.querySelector('.passport-fields')
		// If any params is empty, show form
		const validData = Object.values(requestData).filter((item) => {
			return item === null || item === undefined;
		});

		Object.keys(requestData).forEach((key) => {
			const input = form.querySelector(`input[name="${key}"]`);
			if ( input ) {
				input.value = requestData[key];
				input.setAttribute('value', requestData[key]);
			}
		});
	});
})();