import frappe
from frappe.utils import flt


def handle(sales_invoice, method):

    si_from_os = frappe.db.get_single_value('configurar_sistema', "op_si_os")

    if si_from_os:

        for d in sales_invoice.get("items"):
            if d.service_order and d.so_maint_detail:

                billed_qty = frappe.db.sql("""select sum(qty) from `tabSales Invoice Item`
                    where so_maint_detail=%s and docstatus=1""", d.so_maint_detail)

                ordered_qty = frappe.db.sql("""select sum(qty) from `tabOpportunity Item`
                    where name=%s""", d.so_maint_detail)

                billed_qty = billed_qty and flt(billed_qty[0][0]) or 0.0
                ordered_qty = ordered_qty and flt(ordered_qty[0][0]) or 0.0

                if billed_qty + flt(d.qty) > ordered_qty:
                    frappe.msgprint("Superada la cantidad a facturar en el producto: {0} {1}".format(d.item_code, d.item_name), raise_exception=1)
