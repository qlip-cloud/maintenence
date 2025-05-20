// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Entrada de Bienes', {
	// refresh: function(frm) {

	// }
	cliente:function(frm){

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
	}
});
