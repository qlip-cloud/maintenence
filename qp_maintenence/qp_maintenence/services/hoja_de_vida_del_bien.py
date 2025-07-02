import json
import frappe

@frappe.whitelist()
def make(doctype, docname, items):
	if isinstance(items, str):
		items = json.loads(items)

	hv = []
	
	for i in items:

		values = frappe.db.get_value("Item", i["item_code"], "*",as_dict=True)

		if values.crear_hoja_de_vida_del_bien == 1:
            
			try:

				hoja_vida = frappe.get_doc({
					"doctype": "Hoja de Vida del Bien",
					"item_code": i["item_code"],
					"item_name": i["item_name"],
					"tipo_de_bien":values.tipo_de_bien  if values.tipo_de_bien else None, 
					"serial_no": i["serial_no"],
				}).insert()
				
				hoja_vida.save()
				
				hv.append(hoja_vida.name)

			except frappe.DuplicateEntryError:
				pass		

	return hv