# Copyright (c) 2025, Mentum Group and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class OrdendeServicio(Document):
	
	def save(self, *args, **kwargs):
		super().save(*args, **kwargs) # call the base save method

		if self.status == 'Completed' and self.docstatus == 1:
			self.update_novedades(self, *args, **kwargs) # eg: trigger an API call or a Rotating File Logger that "User X has tried updating this particular record"
			frappe.db.set_value("Hoja de Vida del Bien", self.hoja_de_vida_del_bien, "ubicacion", self.ubicacion)
			frappe.db.set_value("Actualizacion de Lecturas", {"cl_hoja_de_vida_bien": ["in", [self.hoja_de_vida_del_bien]], "docstatus":0}, "ubicacion", self.ubicacion)
		else:
			for tn in self.novedades:
				if frappe.db.exists("Novedades", {"actividad_referencia": tn.actividad_referencia, "parent":["!=", self.name]}):	
					frappe.db.rollback()
					frappe.throw(F"""La novedad {tn.descripcion} de tipo {tn.tipo_de_novedad} del registro de novedades {tn.parent} ya se encuentra tomada por otra orden""")

	def update_novedades(self, *args, **kwargs):

		for tn in self.novedades:

			tn.state = 'Closed'
			#tn.orden_transitoria = self.name
			tn.orden_de_servicio = self.name
			tn.fecha_de_cierre_os = self.fecha_y_hora_finalización_os
			source_nov = frappe.get_doc('Novedades', tn.actividad_referencia)

			if source_nov.state  == 'Open':	
				source_nov.state = 'Closed'
				#source_nov.orden_transitoria = self.name
				source_nov.orden_de_servicio = self.name
				source_nov.fecha_de_cierre_os = self.fecha_y_hora_finalización_os
				source_nov.save()
			else:
				frappe.db.rollback()
				frappe.throw(F"""La novedad {tn.descripcion} de tipo {tn.tipo_de_novedad} del registro de novedades {tn.parent} ya se encuentra cerrada por la orden de servicio {tn.orden_de_servicio}, por favor revise""")
			#search real novedades
		

@frappe.whitelist()
def get_novedades(**args):	

	args = frappe._dict(args)

	hvb_list = []

	def search_parent(hvb):

		hvb_list.append(hvb)
		parent_hoja_de_vida_del_bien = frappe.db.get_value('Hoja de Vida del Bien', hvb, 'parent_hoja_de_vida_del_bien')
		if parent_hoja_de_vida_del_bien:
			search_parent(parent_hoja_de_vida_del_bien)

	search_parent(args.hoja_de_vida_del_bien)

	search_hvb = f"""AND RN.hoja_de_vida_del_bien in {tuple(hvb_list)}""" if len(hvb_list) > 1 else f"""AND RN.hoja_de_vida_del_bien ='{hvb_list[0]}'"""

	return frappe.db.sql(f"""SELECT * 
							FROM `tabRegistro de Novedades` RN, tabNovedades N
							WHERE N.parent = RN.name
					  		AND N.parenttype = 'Registro de Novedades' 
							AND N.state = 'Open'
							AND N.docstatus = 1
							AND N.orden_de_servicio IS NULL
							{search_hvb}
						""", as_dict=1)

@frappe.whitelist()
def get_sales_invoice(dn):
	from qp_maintenence.qp_maintenence.services.sales_invoice_from_maint import make_sales_invoice

	# TODO: validaciones para permitir facturar
	si_doc = make_sales_invoice(dn)

	return si_doc
