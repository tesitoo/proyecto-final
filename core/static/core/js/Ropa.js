$(document).ready(function() {
    $.get("http://fakestoreapi.com/products", function(data) {
        $.each(data, function(i, producto) {
            var html = `
                <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
                    <div class="card" ">
                        <img src="${producto.image}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">
                                ${producto.title}
                            </h5>
                            <h6 class="card-title">
                                ${producto.category}
                            </h6>
                            <p class="card-text">
                                ${producto.description}
                            </p>
                            <a href="#" class="btn btn-primary">Buscar en Amazon</a>
                        </div>
                    </div>
                </div>
            `;
            $("#recuadro").append(html)    
        })
    })
})