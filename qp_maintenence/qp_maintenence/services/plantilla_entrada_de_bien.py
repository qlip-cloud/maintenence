

import frappe
from six import iteritems, string_types

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def handler(doctype, txt, searchfield, start, page_len, filters):
		
	r = frappe.db.sql("""
		SELECT peb.name
		FROM `tabPlantilla Entrada del Bien` peb, `tabProductos Asociados PEB` papeb
		WHERE papeb.parent = peb.name
		AND papeb.parenttype = 'Plantilla Entrada del Bien'
		AND papeb.item_code = '{item}'                  
		LIMIT %(start)s, %(page_len)s
		""".format(**{
			'item': filters.get('item'),
		}), {
		'start': start,
		'page_len': page_len
	})

	if len(r) == 0:

		r = frappe.db.sql("""
			SELECT peb.name
			FROM `tabPlantilla Entrada del Bien` peb
			LIMIT %(start)s, %(page_len)s
			""", {
			'start': start,
			'page_len': page_len
		})

	return r