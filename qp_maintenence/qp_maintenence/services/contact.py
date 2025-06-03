
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