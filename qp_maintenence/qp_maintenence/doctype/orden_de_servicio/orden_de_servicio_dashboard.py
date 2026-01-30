import frappe

from frappe import _


def get_data():

	res = {}

	si_from_os = frappe.db.get_single_value('configurar_sistema', "op_si_os")

	if si_from_os:
		res = {
		'fieldname': 'service_order',
		'transactions': [
			{
				'label': 'Acciones',
				'items': ['Sales Invoice']
			}
		]
	}

	return res
