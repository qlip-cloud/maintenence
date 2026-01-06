

import frappe
from six import iteritems, string_types

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def handler(doctype, txt, searchfield, start, page_len, filters):
		
	r = frappe.db.sql("""
		SELECT pdtm.name
		FROM `tabPlantilla datos tecnicos de mantenimiento` pdtm, `tabProductos Asociados DT` padt
		WHERE padt.parent = pdtm.name
		AND padt.parenttype = 'Plantilla datos tecnicos de mantenimiento'
		AND padt.item = '{item}'                  
		LIMIT %(start)s, %(page_len)s
		""".format(**{
			'item': filters.get('item'),
		}), {
		'start': start,
		'page_len': page_len
	})

	if len(r) == 0:

		r = frappe.db.sql("""
			SELECT pdtm.name
			FROM `tabPlantilla datos tecnicos de mantenimiento` pdtm,
			LIMIT %(start)s, %(page_len)s
			""", {
			'start': start,
			'page_len': page_len
		})

	return r