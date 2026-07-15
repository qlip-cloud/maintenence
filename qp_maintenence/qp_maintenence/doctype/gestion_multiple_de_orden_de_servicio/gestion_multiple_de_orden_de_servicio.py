# Copyright (c) 2025, Mentum Group and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import add_to_date, today, add_days, formatdate, get_url
from frappe.utils.pdf import get_pdf
from six import string_types
import json
from frappe.utils.xlsxutils import make_xlsx


class GestionMultipledeOrdendeServicio(Document):
	pass

@frappe.whitelist()
def print_data(doc, selected_data, columns, type, letterhead=None, con_membrete=False):

	if isinstance(selected_data, str):
		selected_data = json.loads(selected_data)

	if isinstance(columns, str):
		columns = json.loads(columns)

	if isinstance(doc, str):
		doc = json.loads(doc)
	
	if type == 'PDF':
		return generate_pdf(doc, selected_data, columns, letterhead, con_membrete)
	if type == 'EXCEL':
		return generate_excel(doc, selected_data, columns)

def generate_excel(doc, selected_data, columns):

	safe_columns = []

	# Filtrar columnas válidas
	for col in columns:
		if not col:
			continue
		if not col.get("fieldname"):
			continue
		safe_columns.append(col)

	header = []
	for col in safe_columns:
		label = col.get("label") or col.get("fieldname")
		header.append(label)

	data = [header]

	for row in selected_data:
		row_values = []
		for col in columns:
			if not col:
				continue
			fieldname = col.get("fieldname")

			if not fieldname:
				continue

			row_values.append(row.get(fieldname, ""))
		data.append(row_values)

	xlsx_file = make_xlsx(data, "Gestion Multiple OS")

	# Guardar archivo en File doctype
	file = frappe.get_doc({
		"doctype": "File",
		"file_name": "Gestion Multiple de Orden de Servicio.xlsx",
		"is_private": 0,
		"content": xlsx_file.getvalue(),
	})

	file.insert()

	return file.file_url

def generate_pdf(doc, selected_data, columns, letterhead=None, con_membrete=False):

	# Renderizar plantilla Jinja 
	html = frappe.render_template(
		"qp_maintenence/templates/print_format/print_format_HVB.html", 
		{
			"doc": doc, 
			"selected_data": selected_data,
			"columns": columns,
			"letterhead": letterhead if con_membrete else None
		}) 
	
	# Generar PDF 
	pdf = get_pdf(
		html, 
		options={ 
			"orientation": "Landscape",
			"margin-top": "10mm", 
			"margin-bottom": "10mm",
			"footer-right": "Página [page] de [topage]",
			'zoom': '1' 
		}) 
	
	# Guardar archivo temporal 
	file = frappe.get_doc(
		{ 
			"doctype": "File", 
			"file_name": f"Gestion Multiple de Orden de Servicio.pdf", 
			"content": pdf, 
			"is_private": 1 
		}
	) 
	
	file.save() 
	
	return file.file_url

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
		conditions += args.get("desde") and "HAVING DATE_ADD(fecha_ultimo_mantenimiento, INTERVAL periodicidad DAY) >=  '%s'" % args.get("desde") or ""
		conditions += args.get("hasta") and "AND DATE_ADD(fecha_ultimo_mantenimiento, INTERVAL periodicidad DAY) <=  '%s'" % args.get("hasta") or ""
	elif args.get("desde"):
		conditions += args.get("desde") and "HAVING DATE_ADD(fecha_ultimo_mantenimiento, INTERVAL periodicidad DAY) >=  '%s'" % args.get("desde") or ""
	else:
		conditions += args.get("hasta") and "HAVING DATE_ADD(fecha_ultimo_mantenimiento, INTERVAL periodicidad DAY) <=  '%s'" % args.get("hasta") or ""

	result = frappe.db.sql(f"""	
							SELECT  HVB.name, 
									HVB.item_code, 
									HVB.item_name, 
									HVB.name as hoja_de_vida_del_bien, 
									HVB.estado_del_bien as estado,
									HVB.ubicacion, 
									(SELECT fecha_y_hora_finalización_os
									FROM `tabOrden de Servicio` OS
									WHERE OS.cl_plantilla_de_mantenimiento = PT.name 
									AND OS.producto = HVB.item_code
									AND OS.status = 'Completed'
									AND OS.docstatus != 2
									AND fecha_y_hora_finalización_os IS NOT NULL
									ORDER by fecha_y_hora_finalización_os DESC
									LIMIT 1) as fecha_ultimo_mantenimiento,
									NULL as fecha_proximo_mantenimiento,
									PAPP.periodicidad,
									PAPP.horas_kms,	
									NULL as vig_prox_serv,
									(SELECT COUNT(*)  
									FROM `tabOrden de Servicio` ODS2
									WHERE ODS2.hoja_de_vida_del_bien =  HVB.name 
									AND ODS2.status != 'Completed') as nro_ordenes,
									PT.name as cl_plantilla_de_mantenimiento,
									NULL as vig_prox_serv_horas_kms,
									NULL as fecha_ultima_actualizacion_de_lectura,
									NULL as ultima_lectura_actual,
									NULL as unidad_de_medida
							FROM `tabHoja de Vida del Bien` HVB
							LEFT JOIN `tabProductos Asociados PP` PAPP ON PAPP.item_code = HVB.item_code AND PAPP.parenttype = 'Project Template'
							LEFT JOIN `tabProject Template` PT ON PT.name = PAPP.parent AND PT.taller_y_mantenimiento = 1
							WHERE HVB.item_code IS NOT NULL
							{conditions}
						""", as_dict=True)
	
	for r in result:

		r.fecha_ultimo_mantenimiento = None

		actualizacion_de_lectura = frappe.db.sql(
										f"""
										SELECT fecha, 
											   lectura_actual,
											   unidad_de_medida
										FROM `tabActualizacion de Lecturas` AL
										WHERE AL.cl_hoja_de_vida_bien = '{r.name}'
										AND AL.codigo_de_producto = '{r.item_code}'
										AND AL.docstatus = 1
										ORDER by fecha DESC
										LIMIT 1
										""", 
										as_dict=True
									)
		
		orden_de_servicio = frappe.db.sql(f"""
									SELECT fecha_y_hora_finalización_os, valor_de_lectura_actual
									FROM `tabOrden de Servicio` OS
									WHERE OS.cl_plantilla_de_mantenimiento = '{r.cl_plantilla_de_mantenimiento}'
									AND OS.producto = '{r.item_code}'
									AND OS.status = 'Completed'
									AND OS.docstatus != 2
									AND fecha_y_hora_finalización_os IS NOT NULL
									ORDER by fecha_y_hora_finalización_os DESC
									LIMIT 1
									""", 
									as_dict=True
								)

		if actualizacion_de_lectura:
			r.fecha_ultima_actualizacion_de_lectura = formatdate(actualizacion_de_lectura[0].fecha, 'yyyy-MM-dd')
			r.ultima_lectura_actual = actualizacion_de_lectura[0].lectura_actual
			r.unidad_de_medida = actualizacion_de_lectura[0].unidad_de_medida
		
		if orden_de_servicio:
			if orden_de_servicio[0].fecha_y_hora_finalización_os:
				r.fecha_ultimo_mantenimiento = formatdate(orden_de_servicio[0].fecha_y_hora_finalización_os, 'yyyy-MM-dd')

			if r.horas_kms != 0:
				if r.ultima_lectura_actual:
					r.vig_prox_serv_horas_kms = (orden_de_servicio[0].valor_de_lectura_actual + r.horas_kms) - r.ultima_lectura_actual

			if r.periodicidad != 0:
				if orden_de_servicio[0].fecha_y_hora_finalización_os:
					r.fecha_proximo_mantenimiento =	add_to_date(r.fecha_ultimo_mantenimiento, days= r.periodicidad)
					r.vig_prox_serv = frappe.utils.date_diff(frappe.utils.getdate(r.fecha_proximo_mantenimiento), frappe.utils.getdate())

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