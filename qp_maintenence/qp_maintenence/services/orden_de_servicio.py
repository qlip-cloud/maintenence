import frappe

from six import iteritems, string_types

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def handler(doctype, txt, searchfield, start, page_len, filters):

	condition = ""

	for fieldname, value in iteritems(filters):
		if fieldname == 'item_code':
			condition += " AND sle.item_code = {value}".format(value=frappe.db.escape(value))

	return frappe.db.sql("""
		SELECT DISTINCT war.name
		FROM `tabStock Ledger Entry` sle, `tabWarehouse` war
		WHERE sle.warehouse = war.name
		AND sle.qty_after_transaction > 0
		{condition}                   
		LIMIT %(start)s, %(page_len)s
		""".format(**{
		'condition': condition
		}), {
		'start': start,
		'page_len': page_len
	})