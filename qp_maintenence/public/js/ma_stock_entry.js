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

            frm.add_custom_button(__('Quality Inspection(s)'), function() {
				let transaction_controller = new erpnext.TransactionController({ frm: frm });
				transaction_controller.make_quality_inspection();
            }, __("Create"));
        }  
	},
    setup_quality_inspection: function(frm) {
		if (!frm.doc.inspection_required) {
			return;
		}

		if (!frm.is_new()) {
			frm.add_custom_button(__("Quality Inspection(s)"), () => {
				let transaction_controller = new erpnext.TransactionController({ frm: frm });
				transaction_controller.make_quality_inspection();
			}, __("Create"));
			frm.page.set_inner_btn_group_as_primary(__('Create'));
		}

		let quality_inspection_field = frm.get_docfield("items", "quality_inspection");
		quality_inspection_field.get_route_options_for_new_doc = function(row) {
			if (frm.is_new()) return;
			return {
				"inspection_type": "Incoming",
				"reference_type": frm.doc.doctype,
				"reference_name": frm.doc.name,
				"item_code": row.doc.item_code,
				"description": row.doc.description,
				"item_serial_no": row.doc.serial_no ? row.doc.serial_no.split("\n")[0] : null,
				"batch_no": row.doc.batch_no
			}
		}

		frm.set_query("quality_inspection", "items", function(doc, cdt, cdn) {
			var d = locals[cdt][cdn];

			return {
				query:"erpnext.stock.doctype.quality_inspection.quality_inspection.quality_inspection_query",
				filters: {
					'item_code': d.item_code,
					'reference_name': doc.name
				}
			}
		});
	},
})