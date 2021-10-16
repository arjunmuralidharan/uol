"use strict";

// Class Definition
var KTWizardPage = function () {
	// Elements
	var _stepperEl;
	var _stepperFormEl;
	var _stepperFormSubmitButtonEl;

	// Variables
	var _stepperObj;
	var _validations = [];

	// Private Functions
	var _initStepper = function () {
		// Initialize Stepper
		_stepperObj = new KTStepper(_stepperEl);

		// Validation before going to next page
		_stepperObj.on('kt.stepper.next', function (stepper) {
			console.log('stepper.next');
			if (stepper.getCurrentStepIndex() == 2) {
				var m = document.getElementById("module");	
				document.getElementById("module-confirmation").textContent = m.options[m.selectedIndex].text;
				var s = document.getElementById("semester");
				document.getElementById("semester-confirmation").textContent = s.options[s.selectedIndex].text;
				document.getElementById("grade-confirmation").textContent = document.getElementById("grade").value;
				document.getElementById("anonymous-confirmation").textContent = 
				document.getElementById("anonymous").checked ? "Grade will be kept private" : "Grade will be visible to other users";			

			}
			// Validate form before change stepper step
			var validator = _validations[stepper.getCurrentStepIndex() - 1]; // get validator for currnt step

			if (validator) {
				validator.validate().then(function (status) {
					console.log('validated!');

					if (status == 'Valid') {
						stepper.goNext();

						KTUtil.scrollTop();
					} else {
						Swal.fire({
							text: "Sorry, looks like there are some errors detected, please try again.",
							icon: "error",
							buttonsStyling: false,
							confirmButtonText: "Ok, got it!",
							customClass: {
								confirmButton: "btn fw-bold btn-light"
							}
						}).then(function () {
							KTUtil.scrollTop();
						});
					}
				});
			} else {
				stepper.goNext();
				KTUtil.scrollTop();
			}
		});

		// Prev event
		_stepperObj.on('kt.stepper.previous', function (stepper) {
			console.log('stepper.previous');

			stepper.goPrevious();
			KTUtil.scrollTop();
		});

		// Submit event
		_stepperFormSubmitButtonEl.addEventListener('click', function (e) {
			e.preventDefault();

			Swal.fire({
				text: "All is good! Please confirm the grade submission.",
				icon: "success",
				showCancelButton: true,
				buttonsStyling: false,
				confirmButtonText: "Yes, submit!",
				cancelButtonText: "No, cancel",
				customClass: {
					confirmButton: "btn fw-bold btn-primary",
					cancelButton: "btn fw-bold btn-active-light-primary"
				}
			}).then(function (result) {
				if (result.value) {
					_stepperFormEl.submit(); // Submit form
				} else if (result.dismiss === 'cancel') {
					Swal.fire({
						text: "Your form has not been submitted!.",
						icon: "error",
						buttonsStyling: false,
						confirmButtonText: "Ok, got it!",
						customClass: {
							confirmButton: "btn fw-bold btn-primary",
						}
					});
				}
			});
		});
	}

	var _initValidation = function () {
		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
		// Step 1
		_validations.push(FormValidation.formValidation(
			_stepperFormEl,
			{
				fields: {
					course_id: {
						validators: {
							notEmpty: {
								message: 'Module is required'
							}
						}
					},
					semester: {
						validators: {
							notEmpty: {
								message: 'Study session is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap5({
						eleValidClass: '',
						rowSelector: '.fv-row'
					})
				}
			}
		));

		// Step 2
		_validations.push(FormValidation.formValidation(
			_stepperFormEl,
			{
				fields: {
					grade: {
						validators: {
							notEmpty: {
								message: 'Grade is required'
							},
							integer: {
								decimalSeparator: '',
        						message: 'Grade must be an integer',
							},
							between: {
								inclusive: true,
								min: 40,
								max: 100,
								message: 'Grade must be between 40 and 100'
							}
						}
					}
					// ,
					// address2: {
					// 	validators: {
					// 		notEmpty: {
					// 			message: 'Address is required'
					// 		}
					// 	}
					// },
					// postcode: {
					// 	validators: {
					// 		notEmpty: {
					// 			message: 'Postcode is required'
					// 		}
					// 	}
					// },
					// city: {
					// 	validators: {
					// 		notEmpty: {
					// 			message: 'City is required'
					// 		}
					// 	}
					// },
					// state: {
					// 	validators: {
					// 		notEmpty: {
					// 			message: 'State is required'
					// 		}
					// 	}
					// },
					// country: {
					// 	validators: {
					// 		notEmpty: {
					// 			message: 'Country is required'
					// 		}
					// 	}
					// }
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					// Bootstrap Framework Integration
					bootstrap: new FormValidation.plugins.Bootstrap5({
						eleValidClass: '',
						rowSelector: '.fv-row'
					})
				}
			}
		));
	}

	return {
		// Public Functions
		init: function () {
			_stepperEl = document.querySelector('#kt_stepper');
			_stepperFormEl = document.querySelector('#kt_stepper_form');
			_stepperFormSubmitButtonEl = document.querySelector('[data-kt-stepper-action="submit"]');

			_initStepper();
			_initValidation();
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTWizardPage.init();
});
