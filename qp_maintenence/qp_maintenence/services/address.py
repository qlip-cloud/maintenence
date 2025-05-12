import frappe
from six import iteritems, string_types

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def handler(doctype, txt, searchfield, start, page_len, filters):

	condition = ""

	for fieldname, value in iteritems(filters):
		if fieldname == 'customer':
			condition += " AND dyl.link_name = {value}".format(value=frappe.db.escape(value))
		
	return frappe.db.sql("""
	SELECT addr.*
	FROM `tabAddress` addr, `tabDynamic Link` dyl
	WHERE dyl.parent = addr.name
	AND dyl.parenttype = 'Address'
	AND dyl.link_doctype = 'Customer'  
	{condition}                 
	LIMIT %(start)s, %(page_len)s
	""".format(**{
	'condition': condition
	}), {
	'start': start,
	'page_len': page_len
	})

