
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
	SELECT con.*
	FROM `tabContact` con, `tabDynamic Link` dyl
	WHERE dyl.parent = con.name
	AND dyl.parenttype = 'Contact'
	AND dyl.link_doctype = 'Customer'  
	{condition}                   
	LIMIT %(start)s, %(page_len)s
	""".format(**{
	'condition': condition
	}), {
	'start': start,
	'page_len': page_len
})