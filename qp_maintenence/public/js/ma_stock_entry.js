frappe.ui.form.on('Stock Entry', {
	setup: function(frm) {

        frappe.db.get_value('Property Setter', 
            {
                'doc_type': 'Hoja de Vida del Bien', 
                'property':'options', 
                'field_name':'naming_series'
            }, 'value', (value) => {
			
                if(Object.keys(value).length > 0){
                    frm.add_custom_button(__('Hoja de Vida del Bien'), function() {
                        var mr = frappe.model.get_new_doc('Hoja de Vida del Bien');
                        frappe.set_route('Form', 'Hoja de Vida del Bien', mr.name);
                    }, __("Create"));
                }
		});
	}
})