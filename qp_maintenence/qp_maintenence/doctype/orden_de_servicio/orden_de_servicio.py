# Copyright (c) 2025, Mentum Group and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class OrdendeServicio(Document):

	def save(self, *args, **kwargs):
		super().save(*args, **kwargs) # call the base save method
		self.update_novedades(self, *args, **kwargs) # eg: trigger an API call or a Rotating File Logger that "User X has tried updating this particular record"

	def update_novedades(self, *args, **kwargs):

		if self.status == 'Completed' and self.docstatus == 1:
			for tn in self.novedades:

				rn = frappe.db.get_value('')
				tn.state = 'Closed'
				tn.orden_transitoria = self.name
				tn.orden_de_servicio = self.name
				tn.fecha_de_cierre_os = self.fecha_y_hora_finalización_os
				source_nov = frappe.get_doc('Novedades', tn.actividad_referencia)

				if source_nov.state  == 'Open':	
					source_nov.state = 'Closed'
					source_nov.orden_transitoria = self.name
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

	return frappe.db.sql(f"""SELECT * 
							FROM `tabRegistro de Novedades` RN, tabNovedades N
							WHERE N.parent = RN.name
					  		AND N.parenttype = 'Registro de Novedades' 
							AND N.state = 'Open'
							AND N.docstatus = 1
							AND RN.item_code = '{args.producto}'
						""", as_dict=1)