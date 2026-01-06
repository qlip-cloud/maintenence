// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Orden de Servicio', {
	refresh:function(frm){
		if(frm.is_new()){
			frm.doc.novedades = []
			refresh_field("novedades")
		}

		if(['ITS', 'INNGTECH'].includes(frappe.defaults.get_default("Company"))){
			if(frm.doc.tipo_de_servicio == 'Mantenimiento Preventivo Planificado')
			{
				frm.toggle_display('detalle_del_servicio_realizado', true)
				frm.toggle_display('cl_plantilla_de_mantenimiento', true)
				frm.toggle_reqd('cl_plantilla_de_mantenimiento', true)
				frm.toggle_reqd('tasks', true);
			}
			else{
				frm.toggle_display('detalle_del_servicio_realizado', false)
				frm.toggle_display('cl_plantilla_de_mantenimiento', false)
				frm.toggle_reqd('cl_plantilla_de_mantenimiento', false)
				frm.toggle_reqd('tasks', false);
			}
		}else{
			if(frm.doc.tipo_de_servicio == 'Mantenimiento Preventivo')
			{
				frm.toggle_display('detalle_del_servicio_realizado', true)
				frm.toggle_display('cl_plantilla_de_mantenimiento', true)
				frm.toggle_reqd('cl_plantilla_de_mantenimiento', true)
				frm.toggle_reqd('tasks', true);
			}
			else{
				frm.toggle_display('detalle_del_servicio_realizado', false)
				frm.toggle_display('cl_plantilla_de_mantenimiento', false)
				frm.toggle_reqd('cl_plantilla_de_mantenimiento', false)
				frm.toggle_reqd('tasks', false);
			}
		}

	},
	cl_plantilla_de_mantenimiento:function(frm){
		if(frm.doc.cl_plantilla_de_mantenimiento){
			frm.doc.project_type = frm.doc.cl_plantilla_de_mantenimiento
			frm.refresh_field('project_type')
			frm.trigger('project_type');
		}
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
	},
	onload_post_render:function(frm){
		frm.fields_dict['ver_novedades'].$wrapper.css({'margin-top': '0'});
	},
	before_submit: function(frm) {
        // Your JavaScript code here
        // For example, to show a confirmation dialog:
		if(frm.doc.valor_de_lectura_actual){
			frappe.confirm('El Valor de Lectura Actual ha sido completado, ¿Desea crear una Actualización de Lectura?',
				() => {

					 frappe.db.get_list('Hoja de Vida del Bien', { filters:{'item_code':frm.doc.producto}, fields:['*']}).then((result)=>{
						var mr = frappe.model.get_new_doc('Actualizacion de Lecturas');

						mr.cl_hoja_de_vida_bien =  result[0].name 
						mr.lectura_actual = frm.doc.valor_de_lectura_actual
						mr.fecha = frm.doc.fecha_y_hora_inicio_real_os
						mr.observaciones = frm.doc.name
						frappe.set_route("Form", 'Actualizacion de Lecturas', mr.name);

					});

					
				}, () => {
					true
			})
		}
	},
	producto:function(frm){
		if(frm.doc.producto){
			 frappe.db.get_list('Hoja de Vida del Bien', { filters:{'item_code':frm.doc.producto}, fields:['*']}).then((result)=>{
                frm.doc.hoja_de_vida_del_bien = result[0].name   
				refresh_field('hoja_de_vida_del_bien')       
			 });
		}
		
		if(frm.doc.tipo_de_servicio == 'Mantenimiento Preventivo'){
			frm.set_query("cl_plantilla_de_mantenimiento", function() {
				return {
					query:"qp_maintenence.qp_maintenence.services.plan_de_mantenimiento.handler",
					filters: {"item": frm.doc.producto}
				};
			});
		}
	},
	tipo_de_servicio:function(frm){
		if(frm.doc.tipo_de_servicio == 'Mantenimiento Preventivo'){
			if(frm.doc.producto){
				frm.set_query("cl_plantilla_de_mantenimiento", function() {
					return {
						query:"qp_maintenence.qp_maintenence.services.plan_de_mantenimiento.handler",
						filters: {"item": frm.doc.producto}
					};
				});
			}
		}

		if(['ITS', 'INNGTECH'].includes(frappe.defaults.get_default("Company"))){
			if(frm.doc.tipo_de_servicio == 'Mantenimiento Preventivo Planificado')
			{
				frm.toggle_display('detalle_del_servicio_realizado', true)
				frm.toggle_display('cl_plantilla_de_mantenimiento', true)
				frm.toggle_reqd('cl_plantilla_de_mantenimiento', true)
				frm.toggle_reqd('tasks', true);
			}
			else{
				frm.toggle_display('detalle_del_servicio_realizado', false)
				frm.toggle_display('cl_plantilla_de_mantenimiento', false)
				frm.toggle_reqd('cl_plantilla_de_mantenimiento', false)
				frm.toggle_reqd('tasks', false);
			}
		}else{
			if(frm.doc.tipo_de_servicio == 'Mantenimiento Preventivo')
			{
				frm.toggle_display('detalle_del_servicio_realizado', true)
				frm.toggle_display('cl_plantilla_de_mantenimiento', true)
				frm.toggle_reqd('cl_plantilla_de_mantenimiento', true)
				frm.toggle_reqd('tasks', true);
			}
			else{
				frm.toggle_display('detalle_del_servicio_realizado', false)
				frm.toggle_display('cl_plantilla_de_mantenimiento', false)
				frm.toggle_reqd('cl_plantilla_de_mantenimiento', false)
				frm.toggle_reqd('tasks', false);
			}
		}
		
	},
	
	hoja_de_vida_del_bien:function(frm){
		if(['ITS', 'INNGTECH'].includes(frappe.defaults.get_default("Company"))){
			frappe.db.get_value('Hoja de Vida del Bien', frm.doc.hoja_de_vida_del_bien, 'item_code')
			.then(r => {
				frm.set_value('producto', r.message.item_code)
			});	
		}
	},
	entrada_del_bien:function(frm){

		if(!['ITS', 'INNGTECH'].includes(frappe.defaults.get_default("Company"))){
			frappe.db.get_value('Entrada de Bienes', frm.doc.entrada_del_bien, 'item_code')
			.then(r => {
				frm.set_value('producto', r.message.item_code)
			});	
		}
		
	}
});

cur_frm.cscript.ver_novedades = function(doc) {
	frappe.call({
		method: 'qp_maintenence.qp_maintenence.doctype.orden_de_servicio.orden_de_servicio.get_novedades', // Replace with your actual method path
		args: cur_frm.doc,
		callback: function(r) {
			if (r.message) {
					get_novedades(r.message);
			}
		}
	});
}

function get_novedades(v){
	
	let nv = []

	if(v.length > 0){
		v.forEach((rn) => {

			nv.push({
				fecha_reporte:rn.fecha_reporte,
				descripcion:rn.descripcion,
				tipo_de_novedad:rn.tipo_de_novedad,
				quien_reporta:rn.quien_reporta,
				area_ejecutora:rn.area_ejecutora,
				fuente_de_la_novedad:rn.fuente_de_la_novedad,
				state:__(rn.state),
				orden_de_servicio:rn.orden_de_servicio,
				fecha_de_cierre_os:rn.fecha_de_cierre_os,
				novedad:rn.name
			})
		});

		let dialog = new frappe.ui.Dialog({
			title: 'Novedades Abiertas',
			size: "extra-large",
			fields: [
				{
					label: 'Novedades',
					fieldname: 'novedades_abiertas',
					fieldtype: 'Table',
					cannot_add_rows: true,
					cannot_delete_rows: true,
					in_place_edit: false,
					data: nv,
					fields: [
						{ fieldname: 'fecha_reporte', fieldtype: 'Read Only', label: 'Fecha de reporte',in_list_view: 1},
						{ fieldname: 'descripcion', fieldtype: 'Read Only', label: 'Descripcion',in_list_view: 1},
						{ fieldname: 'tipo_de_novedad', fieldtype: 'Read Only', label: 'Tipo de novedad',in_list_view: 1},
						{ fieldname: 'quien_reporta', fieldtype: 'Read Only', label: 'Quien Reporta'},
						{ fieldname: 'area_ejecutora', fieldtype: 'Read Only', label: 'Area ejecutora'},
						{ fieldname: 'fuente_de_la_novedad', fieldtype: 'Read Only', label: 'Fuente de la novedad'},
						{ fieldname: 'state', fieldtype: 'Read Only', label: 'Estado',in_list_view: 1},
						{ fieldname: 'orden_de_servicio', fieldtype: 'Read Only', label: 'Orden de Servicio',in_list_view: 1},
						{ fieldname: 'fecha_de_cierre_os', fieldtype: 'Read Only', label: 'Fecha de cierre os'},
						{ fieldname: 'novedad', fieldtype: 'Read Only', label: 'Novedad'},
					]
				}
			],
			primary_action_label: __('Tomar Novedades'),
			primary_action: function() {
				let selectedRows = dialog.fields_dict.novedades_abiertas.grid.get_selected_children();

				if(selectedRows.length == 0){
					frappe.msgprint('No ha seleccionado ninguna novedad')
				}else{
					
					var error = false;

					selectedRows.forEach((sr) => {
						if(cur_frm.doc.novedades.some(n => n.actividad_referencia == sr.novedad)){
							frappe.msgprint(`Novedad ${sr.novedad} ya se encuentra tomada, por favor revise.`)
							error = true
						}
					});

					if(!error){
						selectedRows.forEach((sr) => {

							var r = cur_frm.add_child("novedades", {
								fecha_reporte:sr.fecha_reporte,
								descripcion:sr.descripcion,
								tipo_de_novedad:sr.tipo_de_novedad,
								quien_reporta:sr.quien_reporta,
								area_ejecutora:sr.area_ejecutora,
								fuente_de_la_novedad:sr.fuente_de_la_novedad,
								state: sr.state == 'Cerrado' ? "Closed" : "Open",
								orden_de_servicio:sr.orden_de_servicio,
								fecha_de_cierre_os:sr.fecha_de_cierre_os,
								por_realizar:true
							})

							//r.orden_transitoria = cur_frm.doc.name,
							r.actividad_referencia = sr.novedad

						});

						refresh_field("novedades")

						dialog.hide();
					}
					
				}
			},
			secondary_action_label: __('Quitar Novedades'),
			secondary_action:function() {
				let selectedRows = dialog.fields_dict.novedades_abiertas.grid.get_selected_children();

				if(selectedRows.length == 0){
					frappe.msgprint('No ha seleccionado ninguna novedad')
				}else{
					selectedRows.forEach((sr) => {
						cur_frm.doc.novedades = cur_frm.doc.novedades.filter(n => n.actividad_referencia != sr.novedad);
						refresh_field("novedades")
					});
						
					var st = cur_frm.doc.status
					cur_frm.set_value('status', '')
					cur_frm.set_value('status', st)

					dialog.hide();
				}
			}

		});
	
		dialog.show();

	}else{
		frappe.msgprint('No se encontraron novedades abiertas')
	}
}