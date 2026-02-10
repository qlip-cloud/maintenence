// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Entrada de Bienes', {
	setup:function(frm){

		frm.set_query("cl_hoja_de_vida_bien", function() {
			return {
				filters: {
					"estado_del_bien":["not in",["Deshabilitado"]]
				}
			};
		});

	},
	refresh: function(frm) {
		if (!frm.is_new()) {
			frm.add_custom_button(__('Quality Inspection(s)'), function() {
				frm.trigger('make_quality_inspection');
            }, __("Create"));
			frm.page.set_inner_btn_group_as_primary(__('Create'));
		}
	},
	cliente:function(frm, cdt, cdn){

		frm.set_query("customer_address", function() {
            return {
				query:"qp_maintenence.qp_maintenence.services.address.handler",
                filters: {"customer": frm.doc.cliente}
            };
        });

		frm.set_query("contact_person", function() {
            return {
				query:"qp_maintenence.qp_maintenence.services.contact.handler",
                filters: {"customer": frm.doc.cliente}
            };
        });

		
        frm.refresh_field('customer_address')
		frm.refresh_field('contact_person')
	
	},
	customer_address:function(frm){
		if(frm.doc.customer_address){
			frappe.db.get_value("Address", frm.doc.customer_address, "*", (r) => {
				frm.set_value('address_display',
					`${r.address_line1}\n${r.city}\n${r.state}\n${r.pincode}\n${r.country}`);
			});
		}else{
			frm.set_value('address_display', '')
		}

		frm.refresh_field('address_display')
	},
	contact_person:function(frm){
		if(frm.doc.contact_person){
			frappe.db.get_value("Contact", frm.doc.contact_person, "*", (r) => {
					frm.set_value('contact_display', 
						`${r.first_name}\nNúmero móvil: ${r.mobile_no}\nDirección de correo electrónico: ${r.email_id}`);
			});
		}else{
			frm.set_value('contact_display', '')
		}

		frm.refresh_field('contact_display')
	},
	plantilla_inspeccion_entrada_del_bien:function(frm){
		if(frm.doc.plantilla_inspeccion_entrada_del_bien){
			frappe.db.get_list("Inspeccion Entrada del Bien",
									{ 
										filters:{
											'parent':frm.doc.plantilla_inspeccion_entrada_del_bien
										},
										fields:["*"],
										order_by:"idx"
									})
			.then((r) => {

					frm.set_value('table_29', '')

					r.forEach(element => {
						frm.add_child('table_29', 
							{	'idx':element.idx, 
								'cl_detalle':element.cl_detalle, 
								'cl_cantidad':element.cl_cantidad,
								'status':element.status,
								'cl_observaciones':element.cl_observaciones


							});
					});
					
					frm.refresh_field('table_29')
			});
					
		}else{
			frm.set_value('table_29', '')
		}

		frm.refresh_field('table_29')
	},
	make_quality_inspection(frm) {

			let data = [];
			const fields = [
				{
					label: "Items",
					fieldtype: "Table",
					fieldname: "items",
					cannot_add_rows: true,
					in_place_edit: true,
					data: data,
					get_data: () => {
						return data;
					},
					fields: [
						{
							fieldtype: "Data",
							fieldname: "docname",
							hidden: true
						},
						{
							fieldtype: "Read Only",
							fieldname: "item_code",
							label: __("Item Code"),
							in_list_view: true
						},
						{
							fieldtype: "Read Only",
							fieldname: "item_name",
							label: __("Item Name"),
							in_list_view: true
						},
						{
							fieldtype: "Read Only",
							fieldname: "serial_no",
							label: __("Serial No"),
							in_list_view: true
						},
						{
							fieldtype: "Float",
							fieldname: "qty",
							label: __("Accepted Quantity"),
							in_list_view: true,
							read_only: true
						},
						{
							fieldtype: "Float",
							fieldname: "sample_size",
							label: __("Sample Size"),
							reqd: true,
							in_list_view: true
						},
						{
							fieldtype: "Data",
							fieldname: "description",
							label: __("Description"),
							hidden: true
						},
						{
							fieldtype: "Data",
							fieldname: "batch_no",
							label: __("Batch No"),
							hidden: true
						}
					]
				}
			];

			const me = this;
			const dialog = new frappe.ui.Dialog({
				title: __("Select Items for Quality Inspection"),
				fields: fields,
				primary_action: function () {
					const data = dialog.get_values();
					frappe.call({
						method: "erpnext.controllers.stock_controller.make_quality_inspections",
						args: {
							doctype: frm.doc.doctype,
							docname: frm.doc.name,
							items: data.items
						},
						freeze: true,
						callback: function (r) {
							if (r.message.length > 0) {
								if (r.message.length === 1) {
									frappe.set_route("Form", "Quality Inspection", r.message[0]);
								} else {
									frappe.route_options = {
										"reference_type": frm.doc.doctype,
										"reference_name": frm.doc.name
									};
									frappe.set_route("List", "Quality Inspection");
								}
							}
							dialog.hide();
						}
					});
				},
				primary_action_label: __("Create")
			});

			frappe.model.with_doc("Item", frm.doc.item_code, function(r) {

				let dialog_items = dialog.fields_dict.items;

				var it = frappe.model.get_doc("Item", frm.doc.item_code);

				dialog_items.df.data.push({
					"docname": it.name,
					"item_code": it.item_code,
					"item_name": it.item_name,
					"qty": frm.doc.cantidad,
					"sample_size":1,
					"description": it.description,
					"serial_no": frm.doc.serie,
					"batch_no": it.batch_no
				});

				dialog_items.grid.refresh();

				data = dialog.fields_dict.items.df.data;

				if (!data.length) {
					frappe.msgprint(__("All items in this document already have a linked Quality Inspection."));
				} else {
					dialog.show();
				}

			});

			
	}
});
