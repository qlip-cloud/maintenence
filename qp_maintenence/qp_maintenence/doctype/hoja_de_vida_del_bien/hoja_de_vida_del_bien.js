// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

var mp_datatable = null;

frappe.ui.form.on('Hoja de Vida del Bien', {
	item_code: function(frm){
		frm.set_query("serial_no", function() {
            return {
                filters: {"item_code": frm.doc.item_code}
            };
        });

		frm.set_query("cl_plantilla_datos_tecnicos_de_mantenimiento", function() {
			return {
				query:"qp_maintenence.qp_maintenence.services.datos_tecnico.handler",
				filters: {"item": frm.doc.item_code}
			};
		});

        frm.refresh_field('serial_no')

		if(frm.doc.item_code) refresh_data()
	},
	cl_plantilla_datos_tecnicos_de_mantenimiento:function(frm){
		frm.set_query("cl_plantilla_datos_tecnicos_de_mantenimiento", function() {
			return {
				query:"qp_maintenence.qp_maintenence.services.datos_tecnico.handler",
				filters: {"item": frm.doc.item_code}
			};
		});
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
	supplier:function(frm){

		frm.set_query("customer_address", function() {
            return {
				query:"qp_maintenence.qp_maintenence.services.address.handler",
                filters: {"supplier": frm.doc.supplier}
            };
        });

		frm.set_query("contact_person", function() {
            return {
				query:"qp_maintenence.qp_maintenence.services.contact.handler",
                filters: {"supplier": frm.doc.supplier}
            };
        });
		
        frm.refresh_field('customer_address')
		frm.refresh_field('contact_person')

	},
	is_group:function(frm){
		if(frm.doc.is_group == 1){
			frm.set_query("parent_hoja_de_vida_del_bien", function() {
				return {
					filters: {"is_group": 1}
				};
			});
		}
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

				frm.set_value('datos_de_mantenimiento', '')

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
	},
	onload_post_render:function(frm){

		frm.fields_dict['refrescar_lista'].$wrapper.css({'margin-top': '0'});

		// Sample columns definition
		const columns = [{
			name:'Plan de mantenimiento', 
			dropdown: false,
			editable: false,
			format: (value) => {
                    return `<a href="/app/project-template/${value}">${value}</a>`;
                }
		}, 
		{
			name:'Periodicidad (días calendario)', 
			dropdown: false,
			editable: false
		}, 
		{
			name:'Horas/Kms', 
			dropdown: false,
			editable: false
		}, 
		{
			name:'Unidad de Medida', 
			dropdown: false,
			editable: false
		}, 
		{
			name:'Fecha último mantenimiento preventivo', 
			dropdown: false,
			editable: false
		}, 
		{
			name:'Fecha próximo mantenimiento preventivo', 
			dropdown: false,
			editable: false
		},
		{
			name:'Orden de Servicio', 
			dropdown: false,
			editable: false,
			format: (value) => {
                    return `<a href="/app/orden-de-servicio/${value}">${value}</a>`;
                }
		}
	];

		const mp_wrapper = frm.fields_dict['mantenimientos_preventivos'].wrapper
		mp_wrapper.innerHTML = '<div id="datatable-container"></div>';
		const datatable_container = mp_wrapper.querySelector('#datatable-container');

		// Initialize the DataTable
		mp_datatable = new frappe.DataTable(
			datatable_container, // The target DOM element
			{
				columns: columns,
				data: [],
				inlineFilters: true, // Optional: adds search filters to columns
				editable:false
			}
		)

		if(!frm.is_new()){
			refresh_data();
		}
	}
});

cur_frm.cscript.refrescar_lista = function(doc) {
	refresh_data()
}

function refresh_data(){
	frappe.call({
		method: 'qp_maintenence.qp_maintenence.doctype.hoja_de_vida_del_bien.hoja_de_vida_del_bien.get_mantenimientos_preventivos', // Replace with your actual method path
		args: cur_frm.doc,
		callback: function(r) {
			if (r.message){
				if(r.message.length > 0){
					cur_frm.toggle_display('mantenimiento_preventivo_section', true);
					mp_datatable.refresh(r.message);
				}  
				else cur_frm.toggle_display('mantenimiento_preventivo_section', false);
			}
		}
	});
}
