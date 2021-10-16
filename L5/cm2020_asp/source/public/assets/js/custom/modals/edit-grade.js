"use strict";

// Class Definition
var KTModalEditGrade = function () {
	var elModal;
	var elForm;
	var elSubmitButton;
	var validator;



	var _initModal = function() {
		// init map on open modal        
		elModal = document.querySelector('#kt_modal_edit_grade');
		elForm = document.querySelector('#kt_modal_edit_grade_form');
		elSubmitButton = document.querySelector('#submit');


		elModal.addEventListener('shown.bs.modal', function (event) {
			var grade = event.relatedTarget.getAttribute('data-bs-grade');
			var gradeId = event.relatedTarget.getAttribute('data-bs-grade-id');
			var module = event.relatedTarget.getAttribute('data-bs-module');
			var semester = event.relatedTarget.getAttribute('data-bs-semester');
			var anonymous = event.relatedTarget.getAttribute('data-bs-anonymous') == "true";

			document.querySelector('#grade-id').value =  gradeId;
			document.querySelector('#module-title').textContent =  module;
			$("#semester").select2().val(semester).trigger("change");
			document.querySelector('#grade').value =  grade;
			document.querySelector('#anonymous').checked =  anonymous;
			document.querySelector('#anonymous').value = anonymous

		});

		// Submit event
		elSubmitButton.addEventListener('click', function (e) {
			e.preventDefault();
			document.querySelector('#anonymous').value = document.querySelector('#anonymous').checked;
			if (validator) {
				validator.validate().then(function (status) {
					console.log('validated!');

					if (status == 'Valid') {
						Swal.fire({
							text: "All is good! Please confirm the grade changes.",
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
								elForm.submit(); // Submit form
							} else if (result.dismiss === 'cancel') {
								Swal.fire({
									text: "Your edits have not been saved!.",
									icon: "error",
									buttonsStyling: false,
									confirmButtonText: "Ok, got it!",
									customClass: {
										confirmButton: "btn btn-primary",
									}
								});
							}
						});
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
							//KTUtil.scrollTop();
						});
					}
				});
			} else {
				KTUtil.scrollTop();
			}


		});	


	}
	var _initValidation = function () {
		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
		// Step 1
		validator = FormValidation.formValidation(elForm,
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
		);
	}

	return {
		// Public Functions
		init: function () {
			_initModal();
			_initValidation();
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTModalEditGrade.init();
});