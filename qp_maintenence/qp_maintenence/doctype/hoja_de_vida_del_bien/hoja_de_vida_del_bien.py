# Copyright (c) 2025, Mentum Group and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import add_to_date, today, add_days, formatdate
from six import iteritems, string_types
from frappe.utils import today


        
class HojadeVidadelBien(Document):
	pass

@frappe.whitelist()
def get_mantenimientos_preventivos(**args):
	
	result_list = []

	args = frappe._dict(args)

	result = frappe.db.sql(f"""SELECT PT.name, PAPP.periodicidad, PAPP.horas_kms, PAPP.unidad_de_medida,
					  		(SELECT fecha_y_hora_finalización_os
							FROM `tabOrden de Servicio` OS
					  		WHERE OS.cl_plantilla_de_mantenimiento = PT.name
					  		AND OS.producto = '{args.item_code}'
							AND OS.status = 'Completed'
							AND OS.docstatus != 2
							AND fecha_y_hora_finalización_os IS NOT NULL
							ORDER by fecha_y_hora_finalización_os DESC
							LIMIT 1) as fecha_y_hora_finalizacion_os,
							(SELECT name
							FROM `tabOrden de Servicio` OS
					  		WHERE OS.cl_plantilla_de_mantenimiento = PT.name
					  		AND OS.producto = '{args.item_code}'
							AND OS.status = 'Completed'
							AND OS.docstatus != 2
							AND fecha_y_hora_finalización_os IS NOT NULL
							ORDER by fecha_y_hora_finalización_os DESC
							LIMIT 1) as last_order
							FROM `tabProductos Asociados PP` PAPP,
					  			 `tabProject Template` PT
							WHERE PAPP.parent = PT.name
					  		AND PAPP.parenttype = 'Project Template' 
							AND PT.taller_y_mantenimiento = 1
							AND PAPP.item_code = '{args.item_code}'
						""", as_dict=1)
	
	for r in result:
			result_list.append([
				r.name,
				r.periodicidad,
				r.horas_kms,
				r.unidad_de_medida,
				formatdate(r.fecha_y_hora_finalizacion_os, 'yyyy-MM-dd') if r.fecha_y_hora_finalizacion_os else '',
				add_to_date(formatdate(r.fecha_y_hora_finalizacion_os, 'yyyy-MM-dd'), days=r.periodicidad) if r.fecha_y_hora_finalizacion_os else '',
				r.last_order if r.fecha_y_hora_finalizacion_os else ''
			])	

	return result_list

@frappe.whitelist()
def get_children(doctype, parent='', **filters):
	return _get_children(doctype, parent)

def _get_children(doctype, parent='', ignore_permissions=False):
	parent_field = 'parent_' + doctype.lower().replace(' ', '_')
	filters = [['ifnull(`{0}`,"")'.format(parent_field), '=', parent],
		['docstatus', '<' ,'2']]

	meta = frappe.get_meta(doctype)

	return frappe.get_list(
		doctype,
		fields=[
			'name as value',
			'{0} as title'.format(meta.get('title_field') or 'name'),
			'is_group as expandable',
			'item_code as item_code',
			'item_name as item_name'
		],
		filters=filters,
		order_by='name',
		ignore_permissions=ignore_permissions
	)
