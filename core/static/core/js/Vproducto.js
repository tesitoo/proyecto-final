$(document).ready(function() {

    // Método de validación para solo números
    $.validator.addMethod("soloNumeros", function(value, element) {
        return /^[0-9]*$/.test(value);
    }, "Sólo se permiten números");

    // Método de validación para solo letras y espacios en blanco
    $.validator.addMethod("soloLetras", function(value, element) {
        return this.optional(element) || /^[a-zA-Z\s]*$/.test(value);
    }, "Sólo se permiten letras y espacios en blanco.");

    $("#mantenedorProductosForm").validate({
        rules: {
            id: {
                required: true,
                soloNumeros: true
            },
            nombre: {
                required: true,
                soloLetras: true
            },
            descripcion: {
                required: true
            },
            precio: {
                required: true,
                soloNumeros: true
            },
            desc_suscriptor: {
                required: true,
                soloNumeros: true
            },
            desc_oferta: {
                required: true,
                soloNumeros: true
            }
        },
        messages: {
            id: {
                required: "Campo obligatorio",
                soloNumeros: "Por favor, ingrese solo números"
            },
            nombre: {
                required: "Campo obligatorio",
                soloLetras: "Por favor, ingrese solo letras y espacios en blanco"
            },
            descripcion: {
                required: "Campo obligatorio"
            },
            precio: {
                required: "Campo obligatorio",
                soloNumeros: "Por favor, ingrese solo números"
            },
            desc_suscriptor: {
                required: "Campo obligatorio",
                soloNumeros: "Por favor, ingrese solo números"
            },
            desc_oferta: {
                required: "Campo obligatorio",
                soloNumeros: "Por favor, ingrese solo números"
            }
        },
        highlight: function(element) {
            $(element).closest('.producto-form-group').addClass('is-invalid');
        },
        unhighlight: function(element) {
            $(element).closest('.producto-form-group').removeClass('is-invalid');
        },
        errorPlacement: function(error, element) {
            if (element.attr("type") === "file") {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });

    // Acción al hacer clic en el botón Guardar
    $("#mantenedorProductosForm").on("submit", function(event) {
        event.preventDefault(); // Evita que se envíe el formulario por defecto si hay errores

        if ($(this).valid()) {
            // Aquí puedes colocar la lógica para guardar los datos si el formulario es válido
            alert("Formulario válido. Se puede proceder con el envío.");
            // Ejemplo de envío de formulario AJAX:
            // $.post("guardar_producto.php", $(this).serialize(), function(response) {
            //     console.log(response);
            // });
        } else {
            alert("Formulario inválido. Por favor, corrija los errores.");
        }
    });

    // Acción al hacer clic en el botón Nuevo
/*     $(".btn-secondary").on("click", function() {
        $("#mantenedorProductosForm")[0].reset(); // Resetea el formulario
        $(".producto-form-group").removeClass("is-invalid"); // Elimina clases de error
    }); */

    // Acción al hacer clic en el botón Eliminar
/*     $(".btn-danger").on("click", function() {
        if (confirm("¿Está seguro de que desea eliminar?")) {
            // Aquí puedes colocar la lógica para eliminar el producto
            alert("Producto eliminado correctamente.");
        }
    }); */

});