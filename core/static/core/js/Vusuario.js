$(document).ready(function() {

    // Agregar método de validación para RUT chileno
    $.validator.addMethod("rutChileno", function(value, element) {
      var rutPattern = /^\d{7,8}-[\dK]$/;
      return rutPattern.test(value)
    }, "El RUT no es válido (escriba sin puntos y con guión)");
  
    // Agregar método de validación para correo
    $.validator.addMethod("emailCompleto", function(value, element) {
      var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
      return regex.test(value);
    }/* , 'El formato del correo no es válido' */);
    
    $.validator.addMethod("soloLetras", function(value, element) {
      return this.optional(element) || /^[a-zA-Z\s]*$/.test(value);
    }, "Sólo se permiten letras y espacios en blanco.");

    $.validator.addMethod("soloNumeros", function(value, element) {
        return /^[0-9]*$/.test(value);
      }, "Sólo se permiten numeros");
  
    document.getElementById('campo_rut').addEventListener('keyup', function(e) {
      e.target.value = e.target.value.toUpperCase();
    });
  
    $("#adminU").validate({
      rules: {
        id: {
            required: true,
            soloNumeros: true
        },
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
      },
      messages: {
        id: {
            required: "Campo obligatorio",
            soloNumeros: "Completar solo con números"
        },
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
      },
      highlight: function(element) {
        $(element).parent().addClass("is-invalid")
      },
      unhighlight: function(element) {
        $(element).parent().removeClass("is-invalid")
      }
    });
  });

