frappe.ui.form.on("Sales Invoice", {
    refresh: function (frm) {
		// Mostrar si está activa la opción para facturar desde orden de servicio
		// Show buttons only when pos view is active
		if (cint(frappe.boot.op_si_os) === 1  && cint(frm.doc.docstatus==0) && cur_frm.page.current_view_name!=="pos" && !frm.doc.is_return) {

			frm.remove_custom_button("Orden de Mantenimiento.", __("Get Items From"))
			frm.add_custom_button(("Orden de Mantenimiento."), function() {
				erpnext.utils.map_current_doc({
					method: "qp_maintenence.qp_maintenence.services.sales_invoice_from_maint.make_sales_invoice",
					source_doctype: "Orden de Servicio",
					target: me.frm,
					setters: [{
						fieldtype: 'Link',
						label: __('Customer'),
						options: 'Customer',
						fieldname: 'customer',
						default: me.frm.doc.customer,
					}],
					get_query_filters: {
						docstatus: 1,
						company: me.frm.doc.company
					}
				})
			}, __("Get Items From"));

		}
	},

});
