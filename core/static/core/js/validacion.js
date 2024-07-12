$(document).ready(function() {

		// Agregar método de validación para RUT chileno
		$.validator.addMethod("rutChileno", function(value, element) {
			var rutPattern = /^\d{7,8}-[\dK]$/;
			if (!rutPattern.test(value)) {
					return false;
			}
			var rutSinGuion = value.replace("-", "");
			var rut = rutSinGuion.slice(0, -1);
			var dv = rutSinGuion.slice(-1);
			var factor = 2;
			var sum = 0;
			for (var i = rut.length - 1; i >= 0; i--) {
					sum += parseInt(rut.charAt(i)) * factor;
					factor = factor === 7 ? 2 : factor + 1;
			}
			var dvCalculado = 11 - (sum % 11);
			dvCalculado = dvCalculado === 11 ? "0" : dvCalculado === 10 ? "K" : dvCalculado.toString();
			return dv === dvCalculado;
		}, "El RUT no es válido (escriba sin puntos y con guión)");
	
		// Agregar método de validación para correo
		$.validator.addMethod("emailCompleto", function(value, element) {
			var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
			console.log("poto")
			return regex.test(value);
		}/* , 'El formato del correo no es válido' */);
		
		$.validator.addMethod("soloLetras", function(value, element) {
			return this.optional(element) || /^[a-zA-Z\s]*$/.test(value);
		}, "Sólo se permiten letras y espacios en blanco.");
	
		document.getElementById('campo_rut').addEventListener('keyup', function(e) {
			e.target.value = e.target.value.toUpperCase();
		});
	
		$("#formulario_registro").validate({
			rules: {
				campo_rut: {
					required: true,
					rutChileno: true
				},
				campo_nombres: {
					required: true,
					soloLetras: true,
					minlength: 3,
					maxlength: 57
				},
				campo_apellidos: {
					required: true,
					soloLetras: true,
					minlength: 2,
					maxlength: 20
				},
				campo_correo: {
					required: true,
					email: true,
					maxlength:76
				},
				campo_direccion: {
					required: true,
				},
				campo_contraseña: {
					required: true,
					minlength: 8,
					maxlength: 15
				},
				campo_repetir_contraseña: {
					required: true,
					minlength: 8,
					maxlength: 15,
					equalTo: "#campo_contraseña"
				}
			},
			messages: {
				campo_rut: {
					required: "Campo obligatorio",
					rutChileno: "Rut no valido, escriba sin puntos y con guión"
				},
				campo_nombres: {
					required: "Campo obligatorio",
					soloLetras: "Completar solo con letras.",
					minlength: "Caracteres minimos= 3",
					maxlength: "Caracteres maximos= 57"
				},
				campo_apellidos: {
					required: "Campo obligatorio",
					soloLetras: "Completar solo con letras.",
					minlength: "Caracteres minimos= 2",
					maxlength: "Caracteres maximos= 20"
				},
				campo_correo: {
					required: "Campo obligatorio",
					email: "Ingrese correo valido",
					maxlength: "Caracteres maximos= 76"
				},
				campo_direccion: {
						required: "Campo obligatorio"
				},
				campo_contraseña: {
					required: "La contraseña es un campo requerido",
					minlength: "La contraseña debe tener un mínimo de 8 caracteres",
					maxlength: "La contraseña debe tener un máximo de 15 caracteres",
				},
				campo_repetir_contraseña: {
					required: "Repetir contraseña es un campo requerido",
					minlength: "Repetir contraseña debe tener un mínimo de 8 caracteres",
					maxlength: "Repetir contraseña debe tener un máximo de 15 caracteres",
					equalTo: "Debe repetir la contraseña escrita anteriormente",
				},
			},
			highlight: function(element) {
				$(element).parent().addClass("is-invalid")
			},
			unhighlight: function(element) {
				$(element).parent().removeClass("is-invalid")
			}
			
		});
	});

