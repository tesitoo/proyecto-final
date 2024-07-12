from django.contrib import admin
from .models import Boleta, Producto, ProductoEnBoleta, Usuario

# Register your models here.
admin.site.register(Producto)
admin.site.register(Boleta)
admin.site.register(Usuario)
admin.site.register(ProductoEnBoleta)