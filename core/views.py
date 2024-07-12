from decimal import Decimal
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import Producto, ProductoEnBoleta, Usuario, Boleta
from django.contrib import messages
from django.contrib.auth.hashers import check_password, make_password
import json

# Create your views here.
def index(request): 
	return render(request, "core/index.html", {"productos": obtener_producto()})

def panelAdmin(request): return render(request, "core/panelAdmin.html")
def adminBodega(request):	
	return render(request, "core/adminBodega.html", {"productos": obtener_producto(), "categorias": ["Carreras", "Simulación", "Acción", "Horror", "Aventura", "Supervivencia", "Sandbox", "Estrategia", "Party", "Deportes", "Rol"]})

def adminProductos(request): return render(request, "core/adminProductos.html")

def adminUsuario(request):
	if request.method == "POST":
		rut = request.POST["campo_rut"]
		nombres = request.POST["campo_nombres"]
		apellidos = request.POST["campo_apellidos"]
		correo = request.POST["campo_correo"]
		dirección = request.POST["campo_direccion"]
		subscrito = request.POST.get("es_subscriptor", False)
		if subscrito:
			subscrito = True
		contraseña = request.POST["campo_contraseña"]
		if Usuario.objects.filter(correo = correo).exists():
			messages.error(request, "Ya existe un correo como este.")
			return redirect("adminUsuario")
		elif Usuario.objects.filter(rut = rut).exists():
			messages.error(request, "Ya existe un RUT como este.")
			return redirect("adminUsuario")
		usuario = Usuario(rut = rut, nombres = nombres, apellidos = apellidos, correo = correo, direccion = dirección, contraseña = make_password(contraseña), subscrito = subscrito)
		usuario.save()
		messages.success(request, f"Cuenta creada con éxito: {nombres} {apellidos} ({correo})")
		return redirect("adminUsuario")
	cuentas = Usuario.objects.all()
	return render(request, "core/adminUsuario.html", {"cuentas": cuentas, "roles": ["Cliente", "Administrador", "Bodeguero", "Vendedor"]})

def adminVentas(request):
	boletas = obtener_boletas()
	return render(request, "core/adminVentas.html",  {"boletas": boletas})

def boleta(request): return render(request, "core/boleta.html")
def carrito(request): return render(request, "core/carrito.html")
def detalle(request, id):
	return render(request, "core/detalle.html", {"productos": obtener_producto(id)})

def ingresar(request):
	if request.method == "POST":
		correo = request.POST.get("campo_correo")
		contraseña = request.POST.get("campo_contraseña")
		try:
			cuenta = Usuario.objects.get(correo = correo)
			if check_password(contraseña, cuenta.contraseña):
				request.session["cuenta_rut"] = cuenta.rut
				request.session["cuenta_nombres"] = cuenta.nombres
				request.session["cuenta_apellidos"] = cuenta.apellidos
				request.session["cuenta_correo"] = cuenta.correo
				request.session["cuenta_direccion"] = cuenta.direccion
				request.session["cuenta_es_subscriptor"] = cuenta.subscrito
				request.session["foto_perfil"] = cuenta.imagen.url if cuenta.imagen else "/static/core/img/monckey2.jpg"
				request.session["cuenta_rol"] = cuenta.rol
				request.session["logeado"] = True
				messages.success(request, f"Se inició sesión: {cuenta.correo}.")
				return redirect("index")
			messages.error(request, "Contraseña incorrecta.")
		except:
			messages.error(request, "Este correo no existe.")
	return render(request, "core/ingresar.html")

def cerrar_sesion(request):
	request.session.flush()
	return redirect("index")

def actualizar_cuenta(request):
	if request.method != "POST":
		messages.error(request, "Método no permitido.")
		return redirect("index")
	cuenta_rut = request.session["cuenta_rut"]
	if not cuenta_rut:
		messages.error(request, "No hay una sesión iniciada.")
		return redirect("ingresar")
	try:
		cuenta = Usuario.objects.get(rut=cuenta_rut)
		contraseña = request.POST["campo_contraseña"]
		repetir_contraseña = request.POST["campo_repetir_contraseña"]
		if contraseña != repetir_contraseña:
			messages.error(request, "Las contraseñas no coinciden.")
			return redirect("mis_datos")
		elif not check_password(contraseña, cuenta.contraseña):
			messages.error(request, "Contraseña incorrecta.")
			return redirect("mis_datos")
		cuenta.nombres = request.POST["campo_nombres"]
		cuenta.apellidos = request.POST["campo_apellidos"]
		cuenta.direccion = request.POST["campo_direccion"]
		cuenta.subscrito = request.POST.get("es_subscriptor", False)
		if cuenta.subscrito:
			cuenta.subscrito = True
		request.session["cuenta_nombres"] = cuenta.nombres
		request.session["cuenta_apellidos"] = cuenta.apellidos
		request.session["cuenta_correo"] = cuenta.correo
		request.session["cuenta_direccion"] = cuenta.direccion
		request.session["cuenta_es_subscriptor"] = cuenta.subscrito
		cuenta.save()
		messages.success(request, "Datos actualizados correctamente.")
		return redirect("misdatos")
	except Usuario.DoesNotExist:
		messages.error(request, "Cuenta no encontrada.")
		return redirect("ingresar")
	
def eliminar_cuenta(request, cuentaID):
	cuenta = Usuario.objects.filter(rut = cuentaID)
	boletas = Boleta.objects.filter(rut = cuentaID)
	if boletas:
		return JsonResponse({"message": "No se puede eliminar a este usuario, ya que tiene boletas asociadas."})
	cuenta.delete()
	return render(request, "core/adminUsuario.html")

def miscompras(request):
	boletas = Boleta.objects.filter(rut=request.session.get("cuenta_rut"))
	return render(request, "core/miscompras.html", {"boletas": boletas})

def misdatos(request):
	return render(request, "core/misdatos.html")

def nosotros(request): return render(request, "core/nosotros.html")
def registro(request): return render(request, "core/registro.html")
def ropa(request): return render(request, "core/ropa.html")

def obtener_producto(id = None):
	if id:
		productos = list(Producto.objects.filter(id = id))
	else:
		productos = [
			{
				"id": producto["id"],
				"nombre": producto["nombre"],
				"descripcion": producto["descripcion"],
				"precio": float(producto["precio"]),
				"stock": producto["stock"],
				"imagen": producto["imagen"],
				"categoria": producto["categoria"],
				"en_descuento": producto["en_descuento"],
				"en_restock": producto["en_restock"],
				"descuento": float(producto["descuento"]),
				"descuento_subs": float(producto["descuento_subs"])
			}
			for producto in list(Producto.objects.all().values())
		]
	return productos

def registro(request):
	if request.method == "POST":
		rut = request.POST["campo_rut"]
		nombres = request.POST["campo_nombres"]
		apellidos = request.POST["campo_apellidos"]
		correo = request.POST["campo_correo"]
		dirección = request.POST["campo_direccion"]
		subscrito = request.POST.get("es_subscriptor", False)
		if subscrito:
			subscrito = True
		contraseña = request.POST["campo_contraseña"]
		confirmar_contraseña = request.POST["campo_repetir_contraseña"]
		if contraseña == confirmar_contraseña:
			if Usuario.objects.filter(correo = correo).exists():
				messages.error(request, "Ya existe un correo como este.")
				return redirect("registro")
			elif Usuario.objects.filter(rut = rut).exists():
				messages.error(request, "Ya existe un RUT como este.")
				return redirect("registro")
			usuario = Usuario(rut = rut, nombres = nombres, apellidos = apellidos, correo = correo, direccion = dirección, contraseña = make_password(contraseña), subscrito = subscrito)
			usuario.save()
			return redirect("ingresar")
		else:
			messages.error(request, "Las contraseñas no coinciden.")
			return redirect("registro")
	return render(request, "core/registro.html")

def crear_boleta(request):
	if request.method == "POST":
		try:
			data = json.loads(request.body)
			productos = data.get("producto", [])
			total = Decimal("0.00")
			for producto in productos:
				producto_obj = Producto.objects.get(id=producto["id"])
				cantidad = producto["cantidad"]
				total += producto_obj.precio * cantidad
			boleta = Boleta.objects.create(rut=request.session.get("cuenta_rut"), total=total)
			for producto in productos:
				producto_obj = Producto.objects.get(id=producto["id"])
				cantidad = producto["cantidad"]
				ProductoEnBoleta.objects.create(boleta=boleta, producto=producto_obj, cantidad=cantidad)
			boleta.save()
			return JsonResponse({"mensaje": "Boleta creada correctamente."})
		except Exception as e:
			return JsonResponse({"error": str(e)}, status=400)
	return JsonResponse({"error": "Método no permitido"}, status=405)

def obtener_boletas_user(request):
	cuenta_rut = request.session.get("cuenta_rut")
	if request.method != "GET":
		return JsonResponse({"error": "Método no permitido"}, status=405)
	elif not cuenta_rut:
		return JsonResponse({"boletas": []})
	boletas = Boleta.objects.filter(rut=cuenta_rut).values("id", "fecha", "total", "estado_pedido")
	boletas_con_productos = []
	for boleta in boletas:
		productos_en_boleta = ProductoEnBoleta.objects.filter(boleta_id=boleta["id"]).select_related("producto")
		productos = [
			{
				"imagen": producto.producto.imagen.url if producto.producto.imagen else "/static/core/img/monckey2.jpg",
				"nombre": producto.producto.nombre,
				"cantidad": producto.cantidad
			}
			for producto in productos_en_boleta
		]
		boleta["productos"] = productos
		boletas_con_productos.append(boleta)
	return JsonResponse({"boletas": boletas_con_productos})

def obtener_boletas():
	boletas = Boleta.objects.all().values("id", "fecha", "rut", "total", "estado_pedido")
	boletas_con_productos = []
	for boleta in boletas:
		cliente = Usuario.objects.get(rut=boleta["rut"])
		productos_en_boleta = ProductoEnBoleta.objects.filter(boleta_id=boleta["id"]).select_related("producto")
		productos = [
			{
				"imagen": producto.producto.imagen.url if producto.producto.imagen else "/static/core/img/monckey2.jpg",
				"nombre": producto.producto.nombre,
				"cantidad": producto.cantidad
			}
			for producto in productos_en_boleta
		]
		boleta["productos"] = productos
		boleta["fecha"] = boleta["fecha"].strftime("%Y-%m-%d")
		boleta["total"] = float(boleta["total"])
		boleta["cliente"] = {
			"nombres": cliente.nombres,
			"apellidos": cliente.apellidos,
			"subscrito": cliente.subscrito
		}
		boletas_con_productos.append(boleta)
	return boletas_con_productos

def actualizar_estado_boleta(request, boletaID, nuevo_estado):
	try:
		boleta = Boleta.objects.get(id=boletaID)
		boleta.estado_pedido = nuevo_estado
		boleta.save()
		respuesta = {
			"message": f"Estado de la boleta #{boletaID} actualizado correctamente.",
			"boletaID": boletaID,
			"nuevo_estado": nuevo_estado
		}
		return JsonResponse(respuesta)
	except Boleta.DoesNotExist:
		return JsonResponse({"error": "Boleta no encontrada."}, status=404)
	except Exception as e:
		return JsonResponse({"error": str(e)}, status=500)
	
def adminProductos(request, id=None):
	if request.method == "POST":
		nombre = request.POST.get("nombre")
		precio = request.POST.get("precio")
		descripcion = request.POST.get("descripcion")
		categoria = request.POST.get("categoria")
		descuento = request.POST.get("desc_oferta")
		descuento_sub = request.POST.get("desc_suscriptor")
		imagen = request.FILES.get("imagen_producto")

		if not all([nombre, precio, descripcion, categoria, descuento, descuento_sub, imagen]):
			messages.error(request, "Todos los campos son requeridos.")
		else:
			if id:
				producto = get_object_or_404(Producto, id=id)
				producto.nombre = nombre
				producto.descripcion = descripcion
				producto.precio = precio
				producto.categoria = categoria
				producto.descuento = descuento
				producto.descuento_subs = descuento_sub
				if imagen:
					producto.imagen = imagen
				producto.save()
			else:
				producto = Producto(nombre=nombre, precio=precio, stock=0, descripcion=descripcion, imagen=imagen, categoria=categoria, descuento=descuento, descuento_subs=descuento_sub)
				producto.save()
			return redirect("adminProductos")
	productos = Producto.objects.all()
	return render(request, "core/adminProductos.html", {"productos": productos, "producto_id": id, "categorias": ["Carreras", "Simulación", "Acción", "Horror", "Aventura", "Supervivencia", "Sandbox", "Estrategia", "Party", "Deportes", "Rol"]})

def eliminar_producto(request, id):
	if request.method == "POST":
		producto = get_object_or_404(Producto, id=id)
		producto.delete()
		return redirect("adminProductos")
	return JsonResponse({"Error": "Método no permitido."}, status=405)

def actualizar_producto(request):
	if request.method != "POST":
		messages.error(request, "Método no permitido.")
	try:
		producto = Producto.objects.get(id=request.POST["bodega_id"])
		if not producto:
			messages.error(request, f"No se encontró un producto con esta ID: {request.POST["bodega_id"]}")
			return redirect("adminBodega")
		stockASumar = request.POST["bodega_añadir"]
		producto.stock += int(stockASumar)
		producto.save()
		messages.success(request, "Datos actualizados correctamente.")
		return redirect("adminBodega")
	except Producto.DoesNotExist:
		messages.error(request, "Producto no encontrado.")
		return redirect("adminBodega")