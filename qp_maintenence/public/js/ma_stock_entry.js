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
                                        }else{
                                            frappe.msgprint(
                                                msg= "No existen productos configurados",
                                                title='Mensaje',
                                                raise_exception=FileNotFoundError
                                            )
                                        }
                                    }
                                });
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
    validate:function(frm){
        $.each(frm.doc.items, function(i, v){
            if(v.serial_no){
                $.each(v.serial_no.split('\n'), function(index, value){
                    if (typeof value == 'undefined' || value.trim() == '') {
                        frappe.throw(__(`Por favor verifique el prodcuto ${v.item_code} ${v.item_name}. Número de serie en la posición  ${index + 1} tiene un espacio`));
                    }
                })
            }
        })
    }
})