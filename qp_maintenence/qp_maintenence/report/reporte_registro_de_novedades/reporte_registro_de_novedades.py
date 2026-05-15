# Copyright (c) 2013, Mentum Group and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def execute(filters=None):
	
	columns, data = [], []

	columns = get_columns()
	data = get_data(filters)

	return columns, data

def get_data(filters):
	validate_filters(filters)

	query = f"""SELECT *
            FROM `tabRegistro de Novedades` as rn,
			tabNovedades as n
			WHERE n.parent = rn.name
			{get_conditions(filters)}
    """	
	
	return frappe.db.sql(query, as_dict=1)


def validate_filters(filters):

	if filters.get("fecha_inicio") and filters.get("fecha_fin"):
		if filters.get("fecha_inicio") > filters.get("fecha_fin"):
			frappe.throw(_("Fecha inicio debe ser menor a fecha fin"))

def get_conditions(filters):
	conditions = []

	if filters.get('cl_hoja_de_vida_bien'):
		hoja_de_vida_del_bien = get_list(filters.get('cl_hoja_de_vida_bien'))
              
		if len(hoja_de_vida_del_bien) > 1:
			conditions.append(f""" rn.hoja_de_vida_del_bien in {tuple(hoja_de_vida_del_bien)}""")
		else:
			conditions.append(f""" rn.hoja_de_vida_del_bien in ('{hoja_de_vida_del_bien[0]}')""")

	if filters.get('codigo_de_producto'):
		codigo_de_producto = get_list(filters.get('codigo_de_producto'))
              
		if len(codigo_de_producto) > 1:
			conditions.append(f""" rn.item_code in {tuple(codigo_de_producto)}""")
		else:
			conditions.append(f""" rn.item_code in ('{codigo_de_producto[0]}')""")

	if filters.get('quien_reporta'):
		quien_reporta = get_list(filters.get('quien_reporta'))
              
		if len(quien_reporta) > 1:
			conditions.append(f""" n.quien_reporta in {tuple(quien_reporta)}""")
		else:
			conditions.append(f""" n.quien_reporta in ('{quien_reporta[0]}')""")

	if filters.get('tipo_de_novedad'):
		conditions.append(f""" n.tipo_de_novedad = '{filters.tipo_de_novedad}'""")

	if filters.get('fuente_de_la_novedad'):
		conditions.append(f""" n.fuente_de_la_novedad = '{filters.fuente_de_la_novedad}'""")
	
	if filters.get('area_ejecutora'):
		conditions.append(f""" n.area_ejecutora = '{filters.area_ejecutora}'""")

	if filters.get('state'):
		conditions.append(f""" n.state = '{filters.state}'""")

	if filters.get('orden_de_servicio'):
		orden_de_servicio = get_list(filters.get('orden_de_servicio'))
              
		if len(orden_de_servicio) > 1:
			conditions.append(f""" n.orden_de_servicio in {tuple(orden_de_servicio)}""")
		else:
			conditions.append(f""" n.orden_de_servicio in ('{orden_de_servicio[0]}')""")


	if filters.get('fecha_inicio'):
		conditions.append(f""" n.fecha_reporte >= '{filters.fecha_inicio}'""")

	if filters.get('fecha_fin'):
		conditions.append(f""" n.fecha_reporte <= '{filters.fecha_fin}'""")

	return "and {}".format(" and ".join(conditions)) if conditions else ""

def get_list(field_list):
	if not isinstance(field_list, list):
		field_list = [d.strip() for d in field_list.strip().split(',') if d]
	return list(set(field_list))

def get_columns():

	columns = [
		{
			"label": _("Hoja de Vida del Bien"),
			"fieldname": "hoja_de_vida_del_bien",
			"fieldtype": "Link",
			"options": "Hoja de Vida del Bien"
		},
		{
			"label": _("Código de Producto"),
			"fieldname": "item_code",
			"fieldtype": "Link",
			"options": "Item"
		},
		{
			"label": _("Nombre de Producto"),
			"fieldname": "item_name",
			"fieldtype": "Data",
		},
		{
			"label": _("Fecha de Reporte"),
			"fieldname": "fecha_reporte",
			"fieldtype": "Date",
		},
		{
			"label": _("Tipo de Novedad"),
			"fieldname": "tipo_de_novedad",
			"fieldtype": "Data"
		},
		{
			"label": _("Descripcion"),
			"fieldname": "descripcion",
			"fieldtype": "Data"
		},
		{
			"label": _("Quien Reporta"),
			"fieldname": "quien_reporta",
			"fieldtype": "Data",
		},
		{
			"label": _("Nombre Quien Reporta"),
			"fieldname": "nombre_quien_reporta",
			"fieldtype": "Data",
		},
		{
			"label": _("Area Ejecutora"),
			"fieldname": "area_ejecutora",
			"fieldtype": "Data",
		},
		{
			"label": _("Fuente de la Novedad"),
			"fieldname": "fuente_de_la_novedad",
			"fieldtype": "Data",
		},
		{
			"label": _("Estado"),
			"fieldname": "state",
			"fieldtype": "Data",
		},
		{
			"label": _("Orden de Servicio"),
			"fieldname": "orden_de_servicio",
			"fieldtype": "Link",
			"options": "Orden de Servicio"
		},
		
	]

	return columns