(() => {
	"use strict";

	document.addEventListener("click", (event) => {
		const target = event.target;
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
				input.addAttribute('checked', 'checked');
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
})();