frappe.ui.form.on('Stock Entry', {
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
    
                                var items = frm.get_field('items').grid.get_selected_children();
    
                                if(!items.length) {
                                    items = frm.doc.items;
                                }
    
                                mr.item_code = items[0].item_code
                                mr.item_name = items[0].item_name
    
                                frappe.set_route('Form', 'Hoja de Vida del Bien', mr.name);
                            });
                        }, __("Create"));
                    }
            });

            frm.add_custom_button(__('Quality Inspection'), function() {
                frappe.model.with_doctype('Quality Inspection', function() {

                    var mr = frappe.model.get_new_doc('Quality Inspection');

                    var items = frm.get_field('items').grid.get_selected_children();

                    if(!items.length) {
                        items = frm.doc.items;
                    }

                    mr.item_code = items[0].item_code

                    frappe.set_route('Form', 'Quality Inspection', mr.name);
                });
                
            }, __("Create"));
        }  
	}
})