$(document).ready(function() {
	$.validator.addMethod("emailCompleto", function(value, element) {
		var regex = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		return regex.test(value);
	});

	$('#formulario_login').validate({
		rules: {
			campo_correo: {
				required: true,
				email: true
			},
			campo_contraseña: {
				required: true
			}
		},
		messages: {
			campo_correo: {
				required: "Ingrese su correo",
				email: "El formato del correo no es válido"
			},
			campo_contraseña: {
				required: "Ingrese su contraseña"
			}
		},
		highlight: function(element) {
			$(element).addClass('is-invalid').removeClass("is-valid");
		},
		unhighlight: function(element) {
			$(element).removeClass('is-invalid').addClass("is-valid");
		}
	});
});
