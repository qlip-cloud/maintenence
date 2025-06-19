erpnext.TransactionController.prototype.setup_quality_inspection = function() {
		if(!in_list(["Delivery Note", "Sales Invoice", "Purchase Receipt", "Purchase Invoice"], this.frm.doc.doctype)) {
			return;
		}

		const me = this;

		if(this.frm.doc.doctype in ["Purchase Receipt"]){
			if (!this.frm.is_new()) {
				this.frm.add_custom_button(__("Quality Inspection(s)"), () => {
					me.make_quality_inspection();
				}, __("Create"));
				this.frm.page.set_inner_btn_group_as_primary(__('Create'));
			}
		}else{
			if (!this.frm.is_new() && this.frm.doc.docstatus === 0) {
				this.frm.add_custom_button(__("Quality Inspection(s)"), () => {
					me.make_quality_inspection();
				}, __("Create"));
				this.frm.page.set_inner_btn_group_as_primary(__('Create'));
			}
		}

		const inspection_type = in_list(["Purchase Receipt", "Purchase Invoice"], this.frm.doc.doctype)
			? "Incoming" : "Outgoing";

		let quality_inspection_field = this.frm.get_docfield("items", "quality_inspection");
		quality_inspection_field.get_route_options_for_new_doc = function(row) {
			if(me.frm.is_new()) return;
			return {
				"inspection_type": inspection_type,
				"reference_type": me.frm.doc.doctype,
				"reference_name": me.frm.doc.name,
				"item_code": row.doc.item_code,
				"description": row.doc.description,
				"item_serial_no": row.doc.serial_no ? row.doc.serial_no.split("\n")[0] : null,
				"batch_no": row.doc.batch_no
			}
		}

		this.frm.set_query("quality_inspection", "items", function(doc, cdt, cdn) {
			let d = locals[cdt][cdn];
			return {
				filters: {
					docstatus: 1,
					inspection_type: inspection_type,
					reference_name: doc.name,
					item_code: d.item_code
				}
			}
		});
}

erpnext.TransactionController.prototype.make_quality_inspection = function() {

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
						doctype: me.frm.doc.doctype,
						docname: me.frm.doc.name,
						items: data.items
					},
					freeze: true,
					callback: function (r) {
						if (r.message.length > 0) {
							if (r.message.length === 1) {
								frappe.set_route("Form", "Quality Inspection", r.message[0]);
							} else {
								frappe.route_options = {
									"reference_type": me.frm.doc.doctype,
									"reference_name": me.frm.doc.name
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

		this.frm.doc.items.forEach(item => {
			if (!item.quality_inspection) {
				let dialog_items = dialog.fields_dict.items;

				if(item.serial_no && item.serial_no.split("\n").length > 1){
					item.serial_no.split("\n").forEach(i => {
						dialog_items.df.data.push({
							"docname": item.name,
							"item_code": item.item_code,
							"item_name": item.item_name,
							"qty": 1,
							"description": item.description,
							"serial_no": i,
							"batch_no": item.batch_no
						});
					})
				}else{
					dialog_items.df.data.push({
						"docname": item.name,
						"item_code": item.item_code,
						"item_name": item.item_name,
						"qty": item.qty,
						"description": item.description,
						"serial_no": item.serial_no,
						"batch_no": item.batch_no
					});
				}
				
				
				dialog_items.grid.refresh();
			}
		});

		data = dialog.fields_dict.items.df.data;
		if (!data.length) {
			frappe.msgprint(__("All items in this document already have a linked Quality Inspection."));
		} else {
			dialog.show();
		}
}