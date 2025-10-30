// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Orden de Servicio', {
	cl_plantilla_de_mantenimiento:function(frm){
		if(frm.doc.cl_plantilla_de_mantenimiento){
			frm.doc.project_type = frm.doc.cl_plantilla_de_mantenimiento
			frm.refresh_field('project_type')
			frm.trigger('project_type');
		}
	},
	refresh: function(frm) {

		if(!frm.is_new()){
			frappe.db.get_list('Novedades', { filters:{'orden_de_servicio':frm.doc.name}, fields:['*']})
					 .then(v => {

						if(v.length > 0){
							v.forEach((rn) => {

								frm.add_child('novedades', {
									fecha_reporte:rn.fecha_reporte,
									descripcion:rn.descripcion,
									tipo_de_novedad:rn.tipo_de_novedad,
									quien_reporta:rn.quien_reporta,
									area_ejecutora:rn.area_ejecutora,
									fuente_de_la_novedad:rn.fuente_de_la_novedad,
									state:rn.state,
									orden_de_servicio:rn.orden_de_servicio,
									fecha_de_cierre_os:rn.fecha_de_cierre_os
								})
							})
						}

						refresh_field("novedades")
					})
		}
	},
	validate:function(frm){
		frm.doc.novedades = null;
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
	project_type:function(frm){
		if(frm.doc.project_type){
			frappe.db.get_list("Project Template Task",
				{ 
					filters:{
						'parent':frm.doc.project_type,
						'parenttype': "Project Template",
					},
					fields:["*"],
					order_by:"idx",
					limit:500
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
	},
	onload: function() {

		function get_data(doc, cdt, cdn){
			const row = locals[cdt][cdn];
			
			return { 
				query: "qp_maintenence.qp_maintenence.services.orden_de_servicio.handler",
				filters:{
					item_code: row.item_code
				}
			};
		}

		me.frm.set_query('warehouse', 'replacement_items', function(doc, cdt, cdn) {
			return get_data(doc, cdt, cdn);			
		});

		me.frm.set_query('warehouse', 'consumable_items', function(doc, cdt, cdn) {
			return get_data(doc, cdt, cdn);	
		});
	}
});