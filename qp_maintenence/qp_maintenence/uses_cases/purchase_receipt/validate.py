import re
import frappe
from frappe.utils import cint
from erpnext.stock.doctype.serial_no.serial_no import get_serial_nos, SerialNoQtyError
from frappe import _


def handle(purchase_receipt, method):

    for item in purchase_receipt.items:

        serial_nos = get_serial_nos(item.serial_no) if item.serial_no else []
        
        if len(serial_nos) and len(serial_nos) != abs(cint(item.qty)):
            frappe.throw(_("{0} Serial Numbers required for Item {1}. You have provided {2}.").format(abs(item.qty), item.item_code, len(serial_nos)), SerialNoQtyError)