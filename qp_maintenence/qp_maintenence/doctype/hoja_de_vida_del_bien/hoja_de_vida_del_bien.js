// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Hoja de Vida del Bien', {
	// refresh: function(frm) {

	// }
	item_code: function(frm){
		frm.set_query("serial_no", function() {
            return {
                filters: {"item_code": frm.doc.item_code}
            };
        });
        frm.refresh_field('serial_no')
	},
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
	cl_plantilla_datos_tecnicos_de_mantenimiento:function(frm){
		if(frm.doc.cl_plantilla_datos_tecnicos_de_mantenimiento){
			frappe.db.get_list("Datos tecnicos de mantenimiento",
									{ 
										filters:{
											'parent':frm.doc.cl_plantilla_datos_tecnicos_de_mantenimiento
										},
										fields:["*"],
										order_by:"idx"
									})
			.then((r) => {
					r.forEach(element => {
						frm.add_child('datos_de_mantenimiento', 
							{	'idx':element.idx, 
								'cl_caracteristicas_del_producto':element.cl_caracteristicas_del_producto, 
								'cl_descripcion':element.cl_descripcion
							});
					});
					frm.refresh_field('datos_de_mantenimiento')
			});
					
		}else{
			frm.set_value('datos_de_mantenimiento', '')
		}

		frm.refresh_field('datos_de_mantenimiento')
	}
});
