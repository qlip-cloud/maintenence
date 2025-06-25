frappe.ui.form.on('Purchase Receipt', {
	refresh: function(frm) {
        if (!frm.is_new()){
            frappe.db.get_value('Property Setter', 
                {
                    'doc_type': 'Hoja de Vida del Bien', 
                    'property':'options', 
                    'field_name':'naming_series'
                }, 'value', (value) => {
                
                    if(Object.keys(value).length > 0){
                        frm.add_custom_button(__('Hoja de Vida del Bien'), function() {
                            frappe.model.with_doctype('Hoja de Vida del Bien', function() {

                                var mr = frappe.model.get_new_doc('Hoja de Vida del Bien');

                                var items = frm.get_field('items').grid.grid_rows;
    
                                if(!items.length) {
                                    items = frm.doc.items;
                                }
                                
                                let items_hv = [];

                                items.forEach( i => {
                                    if(i.doc.serial_no){
                                        i.doc.serial_no.split("\n").forEach(it => {
                                            items_hv.push({
                                                "item_code": i.doc.item_code,
                                                "item_name": i.doc.item_name,
                                                "serial_no": it,
                                            });
                                        });
                                    }else{
                                        items_hv.push({
                                            "item_code": i.doc.item_code,
                                            "item_name": i.doc.item_name,
                                            "serial_no":""
                                        });
                                    }
                                })

                                frappe.call({
                                    method: "qp_maintenence.qp_maintenence.services.hoja_de_vida_del_bien.make",
                                    args: {
                                        doctype: frm.doc.doctype,
                                        docname: frm.doc.name,
                                        items: items_hv
                                    },
                                    freeze: true,
                                    callback: function (r) {
                                        if (r.message.length > 0) {
                                            if (r.message.length === 1) {
                                                frappe.set_route("Form", 'Hoja de Vida del Bien', r.message[0]);
                                            } else {
                                                frappe.route_options = {
                                                    "reference_type": frm.doc.doctype,
                                                    "reference_name": frm.doc.name
                                                };
                                                frappe.set_route("List", 'Hoja de Vida del Bien');
                                            }
                                        }
                                    }
                                });
                            });
                            
                        }, __("Create"));
                    }
            });
        }
	}
})