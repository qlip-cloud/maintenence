frappe.ui.form.on("Asset", {
    refresh:function(frm){
		if (!frm.is_new()){
            frm.add_custom_button(__('Hoja de Vida del Bien'), function() {
                frappe.model.with_doctype('Hoja de Vida del Bien', function() {

                    var mr = frappe.model.get_new_doc('Hoja de Vida del Bien');

                    mr.item_code = frm.doc.item_code
                    mr.item_name = frm.doc.item_name
                    mr.descripcion_del_producto = frm.doc.asset_name
                    mr.categoria_del_activo = frm.doc.asset_category
                    mr.custodio = frm.doc.custodian
                    mr.departamento = frm.doc.department
                    mr.ubicacion = frm.doc.location
                    mr.centro_de_costos = frm.doc.cost_center
                    mr.asset = frm.doc.name
                    mr.asset_naming_serie = frm.doc.qp_serie
                    frappe.set_route("Form", 'Hoja de Vida del Bien', mr.name);

                });
            }, __("Create"));
        }
	}
});