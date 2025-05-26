import frappe
from six import iteritems, string_types

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def handler(doctype, txt, searchfield, start, page_len, filters):

	condition = ""
	doc = ""

	for fieldname, value in iteritems(filters):
		if fieldname in ['customer']:
			condition += " AND dyl.link_name = {value}".format(value=frappe.db.escape(value))
			doc = 'Customer'
		if fieldname in ['supplier']:
			condition += " AND dyl.link_name = {value}".format(value=frappe.db.escape(value))
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

