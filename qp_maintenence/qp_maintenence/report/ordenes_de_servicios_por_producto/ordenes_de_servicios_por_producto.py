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

	query = f"""SELECT os.name,
					   os.status,
					   os.producto,
					   os.descripcion_del_producto,
					   os.cl_plantilla_de_mantenimiento,
					   os.tipo_de_servicio,
					   os.fecha_y_hora_inicio_real_os,
					   os.fecha_y_hora_finalización_os,
					   os.observaciones,
					   no.descripcion descripcion_nov,
					   no.executed_prod,
					   os.responsable,
					   os.ubicacion
				FROM `tabOrden de Servicio` os
				LEFT JOIN `tabNovedades` no ON no.parent = os.name AND no.parenttype = 'Orden de Servicio'
				WHERE os.name IS NOT NULL
				{get_conditions(filters)}
				ORDER BY
				os.name
			
    """

	return frappe.db.sql(query, as_dict=1)


def validate_filters(filters):

	if filters.get("fecha_y_hora_inicio_real_os") and filters.get("fecha_y_hora_finalización_os"):
		if filters.get("fecha_y_hora_inicio_real_os") > filters.get("fecha_y_hora_finalización_os"):
			frappe.throw(_("Fecha Inicial OS debe ser menor a Fecha Final OS"))

def get_conditions(filters):
	conditions = []

	if filters.get('orden_de_servicio'):
		orden_de_servicio = get_list(filters.get('orden_de_servicio'))
              
		if len(orden_de_servicio) > 1:
			conditions.append(f""" os.name in {tuple(orden_de_servicio)}""")
		else:
			conditions.append(f""" os.name in ('{orden_de_servicio[0]}')""")

	if filters.get('responsable'):
		responsable = get_list(filters.get('responsable'))
              
		if len(responsable) > 1:
			conditions.append(f""" os.responsable in {tuple(responsable)}""")
		else:
			conditions.append(f""" os.responsable in ('{responsable[0]}')""")


	if filters.get('ubicacion'):
		ubicacion = get_list(filters.get('ubicacion'))
              
		if len(ubicacion) > 1:
			conditions.append(f""" os.ubicacion in {tuple(ubicacion)}""")
		else:
			conditions.append(f""" os.ubicacion in ('{ubicacion[0]}')""")

	if filters.get('producto'):
		producto = get_list(filters.get('producto'))
              
		if len(producto) > 1:
			conditions.append(f""" os.producto in {tuple(producto)}""")
		else:
			conditions.append(f""" os.producto in ('{producto[0]}')""")

	if filters.get('cl_plantilla_de_mantenimiento'):
		cl_plantilla_de_mantenimiento = get_list(filters.get('cl_plantilla_de_mantenimiento'))
              
		if len(cl_plantilla_de_mantenimiento) > 1:
			conditions.append(f""" os.cl_plantilla_de_mantenimiento in {tuple(cl_plantilla_de_mantenimiento)}""")
		else:
			conditions.append(f""" os.cl_plantilla_de_mantenimiento in ('{cl_plantilla_de_mantenimiento[0]}')""")

	if filters.get('status'):
		conditions.append(f""" os.status = '{filters.status}'""")

	if filters.get('tipo_de_servicio'):
		conditions.append(f""" os.tipo_de_servicio = '{filters.tipo_de_servicio}'""")

	if filters.get('fecha_y_hora_inicio_real_os'):
		conditions.append(f""" os.fecha_y_hora_finalización_os >= '{filters.fecha_y_hora_inicio_real_os}'""")

	if filters.get('fecha_y_hora_finalización_os'):
		conditions.append(f""" os.fecha_y_hora_finalización_os <= '{filters.fecha_y_hora_finalización_os}'""")

	if filters.get('descripcion_producto'):
		conditions.append(f""" os.descripcion_del_producto LIKE '{filters.descripcion_producto}'""")

	return "AND {}".format(" AND ".join(conditions)) if conditions else ""

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
			"options": "Orden de Servicio"
		},
		{
			"label": _("Fecha Inicio"),
			"fieldname": "fecha_y_hora_inicio_real_os",
			"fieldtype": "DateTime",
		},
		{
			"label": _("Fecha Fin"),
			"fieldname": "fecha_y_hora_finalización_os",
			"fieldtype": "DateTime",
		},
		{
			"label": _("Status"),
			"fieldname": "status",
			"fieldtype": "Data"
		},
		{
			"label": _("Item Code"),
			"fieldname": "producto",
			"fieldtype": "Link",
			"options": "Item"
		},
		{
			"label": _("Nombre de Producto"),
			"fieldname": "descripcion_del_producto",
			"fieldtype": "Data",
		},
		{
			"label": _("Plantilla de Mantenimiento"),
			"fieldname": "cl_plantilla_de_mantenimiento",
			"fieldtype": "Link",
			"options": "Project Template"
		},
		{
			"label": _("Tipo de Servicio"),
			"fieldname": "tipo_de_servicio",
			"fieldtype": "Data"
		},
		{
			"label": _("Solicitante"),
			"fieldname": "responsable",
			"fieldtype": "Link",
			"options": "Equipo Tecnico"
		},
		{
			"label": _("Ubicacion"),
			"fieldname": "ubicacion",
			"fieldtype": "Link",
			"options": "Location"
		},
		{
			"label": _("Procedimiento Ejecutado"),
			"fieldname": "executed_prod",
			"fieldtype": "Data",
		},
		{
			"label": _("Observaciones"),
			"fieldname": "observaciones",
			"fieldtype": "Data",
		},
		{
			"label": _("Descripcion Novedad"),
			"fieldname": "descripcion_nov",
			"fieldtype": "Data",
		}
	]



	return columns