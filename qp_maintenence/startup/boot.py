import frappe
from frappe.utils import cint

def qp_maint_boot_session(bootinfo):
    """Get Settings"""

    if frappe.session['user']!='Guest':

        bootinfo.op_si_os = cint(frappe.db.get_single_value('configurar_sistema',
            'op_si_os'))
