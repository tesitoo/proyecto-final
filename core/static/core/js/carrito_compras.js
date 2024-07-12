import { checkItemsEnCarro } from "./utilidades.js"

document.addEventListener("DOMContentLoaded", function() {
	const IVA = 19
	let totalSinIVA = 0
	let carrito = JSON.parse(localStorage.getItem("carrito")) || []
	let tablaCarritoCompras = document.getElementById("tablaCarritoCompras")
	let tablaDatosTributarios = document.getElementById("tablaDatosTributarios")
	let tablaCuerpo = document.getElementsByTagName("tbody")[0]
	let tablaCuerpotTrib = document.getElementsByTagName("tbody")[1]

	tablaCuerpo.innerHTML = ""
	tablaCuerpotTrib.innerHTML = ""

	carrito.forEach(function(producto) {
		let filaTabla = document.createElement("tr")
		let descuentoSub = parseInt(producto.descuento_subs)
		let descuentoOferta = producto.en_descuento ? parseInt(producto.descuento) : 0
		let descuentoTotal = descuentoOferta + descuentoSub
		descuentoTotal = descuentoTotal > 100 ? 100 : descuentoTotal
		
		let columnaCategoria = document.createElement("td")
		columnaCategoria.textContent = "N/A"
		filaTabla.appendChild(columnaCategoria)
		
		let columnaNombre = document.createElement("td")
		columnaNombre.textContent = producto.nombre
		filaTabla.appendChild(columnaNombre)

		let columnaPrecio = document.createElement("td")
		columnaPrecio.textContent = "$" + producto.precio
		filaTabla.appendChild(columnaPrecio)

		let columnaDescuentoSub = document.createElement("td")
		columnaDescuentoSub.textContent = "-" + producto.descuento_subs + "%"
		filaTabla.appendChild(columnaDescuentoSub)

		let columnaOferta = document.createElement("td")
		columnaOferta.textContent = producto.en_descuento ? "-" + descuentoOferta + "%" : "N/A"
		filaTabla.appendChild(columnaOferta)

		let columnaDescuentoTotal = document.createElement("td")
		columnaDescuentoTotal.textContent = descuentoTotal > 0 ? "-" + descuentoTotal + "%" : "N/A"
		filaTabla.appendChild(columnaDescuentoTotal)

		let columnaCantidad = document.createElement("td")
		columnaCantidad.textContent = producto.cantidad
		filaTabla.appendChild(columnaCantidad)

		let columnaPrecioFinal = document.createElement("td")
		columnaPrecioFinal.textContent = "$" + Math.trunc((producto.precio * producto.cantidad) * (1 - (descuentoTotal / 100)))
		filaTabla.appendChild(columnaPrecioFinal)

		let columnaBoton = document.createElement("td")
		let botonRemover = document.createElement("button")
		botonRemover.innerHTML = "Quitar"
		botonRemover.classList.add("btn", "btn-outline-danger", "btn-sm")
		botonRemover.addEventListener("click", function() {
			quitarDelCarrito(producto)
			location.reload()
		})
		columnaBoton.appendChild(botonRemover)
		filaTabla.appendChild(columnaBoton)
		tablaCuerpo.appendChild(filaTabla)

		totalSinIVA += Math.trunc((producto.precio * producto.cantidad) * (1 - (descuentoTotal / 100)))
	})

	let filaTablaDatosTrib = document.createElement("tr")
	let columnaPrecioSinIVA = document.createElement("td")
	let columnaIVA = document.createElement("td")
	let columnaTotalPagar = document.createElement("td")

	columnaPrecioSinIVA.textContent = "$" + totalSinIVA
	columnaIVA.textContent = "+" + IVA + "%"
	columnaTotalPagar.textContent = "$" + Math.trunc(totalSinIVA * ((IVA / 100) + 1))

	filaTablaDatosTrib.appendChild(columnaPrecioSinIVA)
	filaTablaDatosTrib.appendChild(columnaIVA)
	filaTablaDatosTrib.appendChild(columnaTotalPagar)
	tablaCuerpotTrib.appendChild(filaTablaDatosTrib)
})

function quitarDelCarrito(producto) {
	let carrito = JSON.parse(localStorage.getItem("carrito")) || []
	carrito = carrito.filter(function(item) {
		return item.nombre !== producto.nombre
	})
	localStorage.setItem("carrito", JSON.stringify(carrito))
}

export async function vaciarCarrito() {
	localStorage.removeItem("carrito")
	location.reload()
}