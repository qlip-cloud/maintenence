# Copyright (c) 2025, Mentum Group and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import add_to_date, today, add_days, formatdate
from six import string_types
import json


class GestionMultipledeOrdendeServicio(Document):
	pass

@frappe.whitelist()
def get_data(**args):

	args = frappe._dict(args)
	
	conditions = ''
	all_hvc = []

	def get_hvc_tree(hvb, all_hvc):
		if frappe.db.exists("Hoja de Vida del Bien", {"name":hvb, "is_group":1}):
			children = frappe.get_all("Hoja de Vida del Bien", filters={"parent_hoja_de_vida_del_bien": ["in", hvb]})
			
			for child in children:
				if child.parent_hoja_de_vida_del_bien:
					get_hvc_tree(child.name, all_hvc)

				all_hvc += [child.name]

	if args.get("hoja_de_vida_del_bien"):
		all_hvc += [args.get("hoja_de_vida_del_bien")]

		if int(args.get("incluir_asociados")):
			get_hvc_tree(args.get("hoja_de_vida_del_bien"), all_hvc)

			if len(all_hvc) > 1:
				conditions += f""" AND HVB.name in {tuple(all_hvc)} """
			else:
				conditions += f""" AND HVB.name = '{all_hvc[0]}' """

	
		else:
			conditions += args.get("hoja_de_vida_del_bien") and " AND HVB.name = '%s' " % args.get("hoja_de_vida_del_bien") or ""
	
	if args.get("item_code"):
		if isinstance(args.get("item_code"), string_types):
			item_code = json.loads(args.get("item_code"))
			if len(item_code) > 0:
				ic_list = []
				for c in item_code:
					ic_list.append(c.get("item"))
				
				if len(ic_list) > 1:
					conditions += f""" AND HVB.item_code in {tuple(ic_list)} """
				else:
					conditions += f""" AND HVB.item_code = '{ic_list[0]}' """


	conditions += args.get("status") and " AND HVB.estado_del_bien = '%s' " % args.get("status") or ""
	conditions += args.get("ubicacion") and " AND HVB.ubicacion = '%s' " % args.get("ubicacion") or ""
	
	if args.get("desde") and args.get("hasta"):
		conditions += args.get("desde") and "HAVING DATE_ADD(fecha_ultimo_mantenimiento, INTERVAL fecha_proximo_mantenimiento DAY) >=  '%s'" % args.get("desde") or ""
		conditions += args.get("hasta") and "AND DATE_ADD(fecha_ultimo_mantenimiento, INTERVAL fecha_proximo_mantenimiento DAY) <=  '%s'" % args.get("hasta") or ""
	elif args.get("desde"):
		conditions += args.get("desde") and "HAVING DATE_ADD(fecha_ultimo_mantenimiento, INTERVAL fecha_proximo_mantenimiento DAY) >=  '%s'" % args.get("desde") or ""
	else:
		conditions += args.get("hasta") and "HAVING DATE_ADD(fecha_ultimo_mantenimiento, INTERVAL fecha_proximo_mantenimiento DAY) <=  '%s'" % args.get("hasta") or ""

	print(conditions)

	result = frappe.db.sql(f"""	
							SELECT HVB.item_code, 
									HVB.item_name, 
									HVB.name as hoja_de_vida_del_bien, 
									HVB.estado_del_bien as estado,
									HVB.ubicacion, 
									(SELECT fecha_y_hora_finalización_os
									FROM `tabOrden de Servicio` OS
									WHERE OS.cl_plantilla_de_mantenimiento = PT.name
									AND OS.producto = HVB.item_code
									AND OS.status = 'Completed'
									AND fecha_y_hora_finalización_os IS NOT NULL
									ORDER by fecha_y_hora_finalización_os DESC
									LIMIT 1) as fecha_ultimo_mantenimiento,
									PAPP.periodicidad as fecha_proximo_mantenimiento,
									PAPP.periodicidad as vig_prox_serv,
									(SELECT COUNT(*)  
									FROM `tabOrden de Servicio` ODS2
									WHERE ODS2.hoja_de_vida_del_bien =  HVB.name 
									AND ODS2.status != 'Completed') as nro_ordenes,
									PT.name as cl_plantilla_de_mantenimiento
							FROM `tabHoja de Vida del Bien` HVB
							LEFT JOIN `tabProductos Asociados PP` PAPP ON PAPP.item_code = HVB.item_code AND PAPP.parenttype = 'Project Template'
							LEFT JOIN `tabProject Template` PT ON PT.name = PAPP.parent AND PT.taller_y_mantenimiento = 1
							WHERE HVB.item_code IS NOT NULL
							{conditions}
						""", as_dict=1)
	
	for r in result:
		if r.fecha_ultimo_mantenimiento:
			r.fecha_ultimo_mantenimiento = formatdate(r.fecha_ultimo_mantenimiento, 'yyyy-MM-dd')
			r.fecha_proximo_mantenimiento =	add_to_date(r.fecha_ultimo_mantenimiento, days= r.fecha_proximo_mantenimiento)
			r.vig_prox_serv = frappe.utils.date_diff(frappe.utils.getdate(r.fecha_proximo_mantenimiento), frappe.utils.getdate())
		else:
			r.fecha_ultimo_mantenimiento = None
			r.fecha_proximo_mantenimiento =	None
			r.vig_prox_serv = None
		
	return result

@frappe.whitelist()
def create_orders(datos_de_ordenes):

	message_ok = [f"""Señor {frappe.session.user}, el sistema acaba de crear:"""]

	if isinstance(datos_de_ordenes, string_types):
		datos_de_ordenes = json.loads(datos_de_ordenes)

	try:

		for os in datos_de_ordenes:

			if os.get("tipo_de_servicio", None) not in ['Mantenimiento Preventivo Planificado','Mantenimiento Preventivo']:
					if os.get("cl_plantilla_de_mantenimiento", None):
						os["cl_plantilla_de_mantenimiento"] = None

			orden_de_servicio = frappe.new_doc('Orden de Servicio')
			orden_de_servicio.producto =  os.get('item_code', None)
			orden_de_servicio.descripción_del_producto =  os.get('item_name', None)
			orden_de_servicio.hoja_de_vida_del_bien =  os.get('hoja_de_vida_del_bien', None)
			orden_de_servicio.estado =  os.get('estado', None)
			orden_de_servicio.ubicacion =  os.get('ubicacion', None)
			orden_de_servicio.fecha_ultimo_mantenimiento =  os.get('fecha_ultimo_mantenimiento', None)
			orden_de_servicio.fecha_proximo_mantenimiento =  os.get('fecha_proximo_mantenimiento', None)
			orden_de_servicio.nro_ordenes =  os.get('nro_ordenes', None)
			orden_de_servicio.cl_plantilla_de_mantenimiento =  os.get('cl_plantilla_de_mantenimiento', None)
			orden_de_servicio.tipo_de_servicio =  os.get('tipo_de_servicio', None)
			orden_de_servicio.responsable =  os.get('responsable', None)
			orden_de_servicio.causa_raiz =  os.get('causa_raiz', None)
			orden_de_servicio.fecha_y_hora_de_solicitud = today()
			orden_de_servicio.project_type = orden_de_servicio.cl_plantilla_de_mantenimiento

			
			orden_de_servicio.insert()

			message_ok.append(f"""Para el producto {orden_de_servicio.producto} la Orden de Servicio {orden_de_servicio.name}""")

		frappe.db.commit()
		frappe.response['message'] = message_ok
		frappe.response['http_status_code']= 200
        
	except Exception as error:

		frappe.response['message'] = str(error)
		frappe.response['http_status_code'] = 500
		return {
			"status":False
		}
	
	else:
		return {
			"status":True,
			"message":message_ok
		}