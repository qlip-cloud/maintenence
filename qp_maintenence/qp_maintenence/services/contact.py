
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
		SELECT con.name
		FROM `tabContact` con, `tabDynamic Link` dyl
		WHERE dyl.parent = con.name
		AND dyl.parenttype = 'Contact'
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