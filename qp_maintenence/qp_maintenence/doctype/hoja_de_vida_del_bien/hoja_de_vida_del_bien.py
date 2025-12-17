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

	result = frappe.db.sql(f"""SELECT PT.name, PAPP.periodicidad,
					  		(SELECT fecha_y_hora_finalización_os
							FROM `tabOrden de Servicio` OS
					  		WHERE OS.cl_plantilla_de_mantenimiento = PT.name
					  		AND OS.producto = '{args.item_code}'
							AND OS.status = 'Completed'
							AND fecha_y_hora_finalización_os IS NOT NULL
							ORDER by fecha_y_hora_finalización_os DESC
							LIMIT 1) as fecha_y_hora_finalizacion_os
							FROM `tabProductos Asociados PP` PAPP,
					  			 `tabProject Template` PT
							WHERE PAPP.parent = PT.name
					  		AND PAPP.parenttype = 'Project Template' 
							AND PT.taller_y_mantenimiento = 1
							AND PAPP.item_code = '{args.item_code}'
						""", as_dict=1)
	
	for r in result:
		if r.fecha_y_hora_finalizacion_os:
			result_list.append([
				r.name,
				r.periodicidad,
				formatdate(r.fecha_y_hora_finalizacion_os, 'yyyy-MM-dd'),
				add_to_date(formatdate(r.fecha_y_hora_finalizacion_os, 'yyyy-MM-dd'), days=r.periodicidad)
			])	

	return result_list