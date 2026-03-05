
import frappe
from frappe.utils import flt


def handle(orden_de_servicio, method):

    if not orden_de_servicio.fecha_y_hora_finalización_os:
        frappe.validate = False
        frappe.throw("Fecha y Hora de Finalizacion OS es obligatoria, por favor diligenciar")
