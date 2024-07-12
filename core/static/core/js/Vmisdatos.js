$(document).ready(function() {
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

    $.validator.addMethod("emailCompleto", function(value, element) {
        var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(value);
    }, "El formato del correo no es válido");

    $("#formulario_mis_datos").validate({
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
                emailCompleto: true,
                maxlength: 76
            },
            campo_direccion: {
                required: true
            },
            campo_contraseña: {
                required: true,
                minlength: 8,
                maxlength: 15
            },
            campo_repetir_contraseña: {
                required: true,
                equalTo: "#campo_contraseña"
            }
        },
        messages: {
            campo_rut: {
                required: "Campo obligatorio",
                rutChileno: "RUT no válido (escriba sin puntos y con guión)"
            },
            campo_nombres: {
                required: "Campo obligatorio",
                soloLetras: "Completar solo con letras.",
                minlength: "Mínimo 3 caracteres",
                maxlength: "Máximo 57 caracteres"
            },
            campo_apellidos: {
                required: "Campo obligatorio",
                soloLetras: "Completar solo con letras.",
                minlength: "Mínimo 2 caracteres",
                maxlength: "Máximo 20 caracteres"
            },
            campo_correo: {
                required: "Campo obligatorio",
                emailCompleto: "Formato de correo no válido",
                maxlength: "Máximo 76 caracteres"
            },
            campo_direccion: {
                required: "Campo obligatorio"
            },
            campo_contraseña: {
                required: "Campo obligatorio",
                minlength: "La contraseña debe tener al menos 8 caracteres",
                maxlength: "La contraseña debe tener como máximo 15 caracteres"
            },
            campo_repetir_contraseña: {
                required: "Campo obligatorio",
                equalTo: "Las contraseñas deben coincidir"
            }
        },
        highlight: function(element) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function(element) {
            $(element).removeClass("is-invalid").addClass("is-valid");
        }
    });

    $("#rut").on("input", function() {
        this.value = this.value.toUpperCase();
    });
});