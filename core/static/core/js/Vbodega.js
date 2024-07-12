$(document).ready(function() {

    // Método de validación para solo números
    $.validator.addMethod("soloNumeros", function(value, element) {
        return /^-?\d+$/.test(value);
    }, "Sólo se permiten números");

    // Método de validación para solo letras y espacios en blanco
    $.validator.addMethod("soloLetras", function(value, element) {
        return this.optional(element) || /^[a-zA-Z\s]*$/.test(value);
    }, "Sólo se permiten letras y espacios en blanco.");

    // Validación del formulario
    $("#mantenedorBodegaForm").validate({
        rules: {
            bodega_categoria: {
                required: true
            },
            bodega_nombre: {
                required: true,
                soloLetras: true
            },
            bodega_stock: {
                required: true,
                soloNumeros: true
            },
            bodega_añadir: {
                required: true,
                soloNumeros: true
            }
        },
        messages: {
            bodega_categoria: {
                required: "Campo obligatorio"
            },
            bodega_nombre: {
                required: "Campo obligatorio",
                soloLetras: "Por favor, ingrese solo letras y espacios en blanco"
            },
            bodega_stock: {
                required: "Campo obligatorio",
                soloNumeros: "Por favor, ingrese solo números"
            },
            bodega_añadir: {
                required: "Campo obligatorio",
                soloNumeros: "Por favor, ingrese solo números"
            }
        },
        highlight: function(element) {
            $(element).closest('.bodega-form-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.bodega-form-group').removeClass('has-error');
        },
        errorPlacement: function(error, element) {
            if (element.attr("type") === "file") {
                error.insertAfter(element.closest('.bodega-form-group'));
            } else {
                error.insertAfter(element);
            }
        }
    });
});