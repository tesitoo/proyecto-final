from django.urls import path
from .views import (
    index, panelAdmin, adminBodega, adminProductos,
    adminUsuario, adminVentas, boleta, carrito,
    detalle, ingresar, miscompras, misdatos,
    nosotros, registro, ropa, cerrar_sesion, actualizar_cuenta,
    crear_boleta, obtener_boletas_user, actualizar_estado_boleta,
    eliminar_producto, actualizar_producto, eliminar_cuenta
)

urlpatterns = [
    path("", index, name="index"),
    path("panelAdmin", panelAdmin, name="panelAdmin"),
    path("adminBodega", adminBodega, name="adminBodega"),
    path("adminProductos", adminProductos, name="adminProductos"),
    path("adminUsuario", adminUsuario, name="adminUsuario"),
    path("adminVentas", adminVentas, name="adminVentas"),
    path("boleta", boleta, name="boleta"),
    path("carrito", carrito, name="carrito"),
    path("detalle/<int:id>/", detalle, name="detalle"),
    path("ingresar", ingresar, name="ingresar"),
    path("cerrar_sesion", cerrar_sesion, name="cerrar_sesion"),
    path("miscompras", miscompras, name="miscompras"),
    path("misdatos", misdatos, name="misdatos"),
    path("nosotros", nosotros, name="nosotros"),
    path("registro", registro, name="registro"),
    path("ropa", ropa, name="ropa"),
    path("actualizar_cuenta", actualizar_cuenta, name="actualizar_cuenta"),
    path("crear_boleta/", crear_boleta, name="crear_boleta"),
    path("obtener_boletas_user/", obtener_boletas_user, name="obtener_boletas_user"),
    path("actualizar_estado_boleta/<int:boletaID>/<str:nuevo_estado>/", actualizar_estado_boleta, name="actualizar_estado_boleta"),
    path("eliminar_producto/<int:id>/", eliminar_producto, name="eliminar_producto"),
    path("editar_producto/<int:id>/", lambda request, id: adminProductos(request, id), name="editar_producto"),
    path("actualizar_producto", actualizar_producto, name="actualizar_producto"),
    path("eliminar_cuenta/<str:cuentaID>/", eliminar_cuenta, name="eliminar_cuenta")

]
