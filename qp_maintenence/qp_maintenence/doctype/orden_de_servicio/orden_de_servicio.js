// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Orden de Servicio', {
	// refresh: function(frm) {

	// }
	customer:function(frm){

		frm.set_query("customer_address", function() {
            return {
				query:"qp_maintenence.qp_maintenence.services.address.handler",
                filters: {"customer": frm.doc.customer}
            };
        });

		frm.set_query("contact_person", function() {
            return {
				query:"qp_maintenence.qp_maintenence.services.contact.handler",
                filters: {"customer": frm.doc.customer}
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
	project_type:function(frm){
		if(frm.doc.project_type){
			frappe.db.get_list("Project Template Task",
				{ 
					filters:{
						'parent':frm.doc.project_type,
						'parenttype': "Project Template",
					},
					fields:["*"],
					order_by:"idx"
				})
				.then((r) => {

					frm.set_value('tasks','')
					
					r.forEach(element => {
						frm.add_child('tasks', 
							{	'idx':element.idx, 
								'task':element.task, 
								'subject':element.subject,
								'tiempo_promedio':element.tiempo_promedio,
								'tecnico_responsable':element.tecnico_responsable


							});
					});
					frm.refresh_field('tasks')
			});
		}else{
			frm.set_value('tasks','')
		}

		frm.refresh_field('tasks')
	}
});

frappe.ui.form.on("Opportunity Item", {
    item_code:function(frm, cdt, cdn){
		
		let d = frappe.get_doc(cdt, cdn);

		if(d.item_code){
			frappe.db.get_list("Stock Ledger Entry",
									{ 
										filters:{
											'item_code':d.item_code,
                                            'qty_after_transaction':['>','0']
										},
										fields:["*"],
									})
			.then((r) => {
                    var w = []
					r.forEach(element => {
						w.push(element.warehouse);
					});
					
					
					frappe.model.set_value(cdt, cdn, 'warehouse', w, 'Link');
			});
					
		}else{
			frappe.model.set_value(cdt, cdn, 'warehouse', '');
		}
	}
});