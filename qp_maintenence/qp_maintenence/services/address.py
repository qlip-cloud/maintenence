import frappe
from six import iteritems, string_types
import json

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def handler(doctype, txt, searchfield, start, page_len, filters):

	condition = ""
	doc = ""

	if isinstance(filters, string_types):
		filters = json.loads(filters)

	if filters.get("customer"):
		condition += " AND dyl.link_name = {value}".format(value=frappe.db.escape(filters.get("customer")))
		doc = 'Customer'
	if filters.get("supplier"):
		condition += " AND dyl.link_name = {value}".format(value=frappe.db.escape(filters.get("supplier")))
		doc = 'Supplier'

	
	return frappe.db.sql("""
		SELECT addr.name
		FROM `tabAddress` addr, `tabDynamic Link` dyl
		WHERE dyl.parent = addr.name
		AND dyl.parenttype = 'Address'
		AND dyl.link_doctype = '{doc}'
		{condition}                 
		LIMIT %(start)s, %(page_len)s
		""".format(**{
			'condition': condition,
			'doc':doc
		}), {
		'start': start,
		'page_len': page_len
	})

