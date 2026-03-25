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
            FROM `tabActualizacion de Lecturas` as al
			WHERE al.name IS NOT NULL
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
			conditions.append(f""" al.cl_hoja_de_vida_bien in {tuple(hoja_de_vida_del_bien)}""")
		else:
			conditions.append(f""" al.cl_hoja_de_vida_bien in ('{hoja_de_vida_del_bien[0]}')""")

	if filters.get('codigo_de_producto'):
		codigo_de_producto = get_list(filters.get('codigo_de_producto'))
              
		if len(codigo_de_producto) > 1:
			conditions.append(f""" al.codigo_de_producto in {tuple(codigo_de_producto)}""")
		else:
			conditions.append(f""" al.codigo_de_producto in ('{codigo_de_producto[0]}')""")

	if filters.get('responsable'):
		responsable = get_list(filters.get('responsable'))
              
		if len(responsable) > 1:
			conditions.append(f""" al.responsable in {tuple(responsable)}""")
		else:
			conditions.append(f""" al.responsable in ('{responsable[0]}')""")

	if filters.get('ubicacion'):
		ubicacion = get_list(filters.get('ubicacion'))
              
		if len(ubicacion) > 1:
			conditions.append(f""" al.ubicacion in {tuple(ubicacion)}""")
		else:
			conditions.append(f""" al.ubicacion in ('{ubicacion[0]}')""")

	if filters.get('tipo_de_bien'):
		conditions.append(f""" al.tipo_de_bien = '{filters.tipo_de_bien}'""")

	if filters.get('unidad_de_medida'):
		conditions.append(f""" al.unidad_de_medida = '{filters.unidad_de_medida}'""")

	if filters.get('fecha_inicio'):
		conditions.append(f""" al.fecha >= '{filters.fecha_inicio}'""")

	if filters.get('fecha_fin'):
		conditions.append(f""" al.fecha <= '{filters.fecha_fin}'""")

	if filters.get('cambio'):
		conditions.append(f""" al.cambio = '{filters.cambio}'""")

	return "and {}".format(" and ".join(conditions)) if conditions else ""

def get_list(field_list):
	if not isinstance(field_list, list):
		field_list = [d.strip() for d in field_list.strip().split(',') if d]
	return list(set(field_list))

def get_columns():

	columns = [
		{
			"label": _("Name"),
			"fieldname": "name",
			"fieldtype": "Link",
			"options": "Actualizacion de Lecturas"
		},
		{
			"label": _("Hoja de Vida del Bien"),
			"fieldname": "cl_hoja_de_vida_bien",
			"fieldtype": "Link",
			"options": "Hoja de Vida del Bien"
		},
		{
			"label": _("Código de Producto"),
			"fieldname": "codigo_de_producto",
			"fieldtype": "Link",
			"options": "Item"
		},
		{
			"label": _("Nombre de Producto"),
			"fieldname": "nombre_de_producto",
			"fieldtype": "Data",
		},
		{
			"label": _("Responsable"),
			"fieldname": "responsable",
			"fieldtype": "Link",
			"options": "Equipo Tecnico"
		},
		{
			"label": _("Location"),
			"fieldname": "ubicacion",
			"fieldtype": "Link",
			"options": "Location"
		},
		{
			"label": _("Tipo de Bien"),
			"fieldname": "tipo_de_bien",
			"fieldtype": "Data",
		},
		{
			"label": _("Unidad de Medida"),
			"fieldname": "unidad_de_medida",
			"fieldtype": "Data",
		},
		{
			"label": _("Cambio de Odometro"),
			"fieldname": "cambio",
			"fieldtype": "Check",
		},
		{
			"label": _("Fecha"),
			"fieldname": "fecha",
			"fieldtype": "Date",
		},
		{
			"label": _("Lectura Actual"),
			"fieldname": "lectura_actual",
			"fieldtype": "Float",
		},
		{
			"label": _("Lectura Anterior"),
			"fieldname": "lectura_anterior",
			"fieldtype": "Float",
		},
		{
			"label": _("Lectura Acumulada"),
			"fieldname": "lectura_acumulada",
			"fieldtype": "Float",
		},
		
	]



	return columns