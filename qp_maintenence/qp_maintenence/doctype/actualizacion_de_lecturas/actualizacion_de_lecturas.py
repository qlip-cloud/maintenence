# Copyright (c) 2025, Mentum Group and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ActualizaciondeLecturas(Document):
	def save(self, *args, **kwargs):
		super().save(*args, **kwargs) # call the base save method
	
		if self.docstatus == 1:
			frappe.db.set_value("Hoja de Vida del Bien", self.cl_hoja_de_vida_bien, "ubicacion", self.ubicacion)
			frappe.db.set_value("Orden de Servicio", {"hoja_de_vida_del_bien": ["in", [self.cl_hoja_de_vida_bien]]}, "ubicacion", self.ubicacion)

