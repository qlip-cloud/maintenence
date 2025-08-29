import re
import frappe
from frappe.utils import cint
from erpnext.stock.doctype.serial_no.serial_no import get_serial_nos, SerialNoQtyError
from frappe import _


def handle(asset, method):

    mr = frappe.new_doc('Hoja de Vida del Bien')

    mr.item_code = asset.item_code
    mr.item_name = asset.item_name
    mr.descripcion_del_producto = asset.asset_name
    mr.categoria_del_activo = asset.asset_category
    mr.custodio = asset.custodian
    mr.departamento = asset.department
    mr.ubicacion = asset.location
    mr.centro_de_costos = asset.cost_center
    mr.save()

    frappe.msgprint(_("{0} ha sido credo en Hoja de Vida del Bien").format(mr.name))

     
    