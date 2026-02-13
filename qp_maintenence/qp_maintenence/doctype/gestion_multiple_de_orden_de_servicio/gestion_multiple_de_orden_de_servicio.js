// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

const mp_datatable = null;

frappe.ui.form.on('Gestion Multiple de Orden de Servicio', {
	refresh: function(frm) {
		frm.add_custom_button(__('Crear Ordenes'), function() {
			crear_orders(frm);
        })
	},
	item_code:function(frm){
		refresh_data();
	},
	status:function(frm){
		refresh_data();
	},
	hoja_de_vida_del_bien:function(frm){
		refresh_data();
	},
	ubicacion:function(frm){
		refresh_data();
	},
	desde:function(frm){
		refresh_data();
	},
	hasta:function(frm){
		refresh_data();
	},
	incluir_asociados:function(frm){
		refresh_data();
	},
	onload_post_render:function(frm){

		// Sample columns definition

		const mp_wrapper = frm.fields_dict['lista_hoja_de_vida_del_bien'].wrapper
		mp_wrapper.innerHTML = '<div id="datatable-container"></div>';
		const datatable_container = mp_wrapper.querySelector('#datatable-container');

		// Initialize the DataTable
		frm.lista_hoja_de_vida_del_bien_data_table = new frappe.DataTable(
			datatable_container, // The target DOM element
			{
				columns: get_columns(false),
				data: [],
				inlineFilters: true, // Optional: adds search filters to columnsSSSSSSS
				editable:false,
				checkboxColumn: true,
				noDataMessage:"No se encontraron Hojas de Vida del Bien",
				page_length: [10,20,50,100]
			}
		)

		refresh_data();

	},
});

function crear_orders(frm) {
	
	let indexes = frm.lista_hoja_de_vida_del_bien_data_table.rowmanager.getCheckedRows();
	
	if (indexes.length == 0) frappe.msgprint(__("Debe seleccionar al menos un registro de la lista"));
	else {

		let data_table = frm.lista_hoja_de_vida_del_bien_data_table.rowmanager.datamanager.data
		let data_selected = []

		Object.keys(indexes).forEach(i => {
			data_table[i].cl_plantilla_de_mantenimiento = null;
			data_selected.push(data_table[i])
		})

		modal_data(data_selected)

	}

}

function get_columns(is_modal){

	let col = [{
			label:'Código del Producto', 
			name:'Código del Producto', 
			reqd:1,
			id:'item_code', 
			fieldname:'item_code',
			fieldtype:'Link',
			options:'Item',
			editable: false,
			in_list_view: is_modal,
		}]

	if(is_modal){
		col.push({
			label:'Tipo de servicio', 
			name:'Tipo de servicio', 
			id:'tipo_de_servicio',
			fieldname:'tipo_de_servicio',
			fieldtype: 'Select',
			options: ['ITS', 'INNGTECH'].includes(frappe.defaults.get_default("Company")) ? " \nGarantía\nMantenimiento Preventivo\nMantenimiento Preventivo Planificado\nMantenimiento Correctivo\nMantenimineto Predictivo\nMejora (Reingenieria)\nDiagnóstico" : " \nGarantía\nMantenimiento Preventivo\nMantenimiento Correctivo\nDiagnóstico",
			editable: is_modal,
			in_list_view:  is_modal,
			reqd:1,
			sortable: true
		},
		{
			label:'Responsable', 
			name:'Responsable', 
			id:'responsable',
			fieldname:'responsable',
			fieldtype: 'Link',
			options:"Equipo Tecnico",
			editable: is_modal,
			in_list_view:  is_modal,
			reqd:1,
			get_query() {
				return {
					filters: { deshabilitado:0}
				}
			},
			sortable: true
		},
		{
			label:'Causa Raiz', 
			name:'Causa Raiz', 
			id:'causa_raiz',
			fieldname:'causa_raiz',
			fieldtype: 'Select',
			options:" \nOperacional\nDiseño\nHumano\nAmbiental\nDesgaste normal por uso",
			editable: is_modal,
			in_list_view:  is_modal,
			reqd:1,
			sortable: true
		})
	}

	col.push(
		{
			name:'Nombre del Producto', 
			id:'item_name', 
			fieldname:'item_name',
			fieldtype:'Data',
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			name:'Hoja de Vida', 
			id:'hoja_de_vida_del_bien',
			fieldname:'hoja_de_vida_del_bien',
			fieldtype:'Link',
			options:'Hoja de Vida del Bien',
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			name:'Estado', 
			id:'estado',
			fieldname:'estado',
			fieldtype:'Select',
			options: " \nDisponible\nEn mantenimiento\nDeshabilitado",
			editable: false,
			hidden: is_modal,
			sortable: true			
		},
		{
			name:'Ubicacion', 
			id:'ubicacion',
			fieldname:'ubicacion',
			fieldtype:'Link',
			options: "Location",
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			label:'Plan de Mantenimiento', 
			name:'Plan de Mantenimiento', 
			id:'cl_plantilla_de_mantenimiento',
			fieldname:'cl_plantilla_de_mantenimiento',
			fieldtype: 'Link',
			options:"Project Template",
			editable: is_modal,
			in_list_view:  is_modal,
			reqd:1,
			sortable: true
		},
		{
			name:'Fecha Ultimo Mantenimiento Preventivo', 
			id:'fecha_ultimo_mantenimiento',
			fieldname:'fecha_ultimo_mantenimiento',
			fieldtype:'Date',
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			name:'Fecha Proximo Mantenimiento Preventivo', 
			name:'Fecha Proximo Mantenimiento Preventivo', 
			id:'fecha_proximo_mantenimiento',
			fieldname:'fecha_proximo_mantenimiento',
			fieldtype:'Date',
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			name:'Nro. Ordenes de Servicio Abiertas', 
			fieldname:'nro_ordenes',
			id:'nro_ordenes',
			fieldtype:'Int',
			editable: false,
			hidden: is_modal,
			sortable: true
		},{
			name:'Vigencia Prox. Servicio', 
			id:'vig_prox_serv', 
			fieldname:'vig_prox_serv',
			fieldtype:'Data',
			editable: false,
			hidden: is_modal,
			sortable: true,
			format: (value) => {
				if(!value){
					return value
				}
				else if (value > 0 && value < 5) {
                    return `<b style="color: orange;">${value}</b>`;
                } 
				else if (value <= 0) {
                    return `<b style="color: red;">${value}</b>`;
                }else (value > 5){
                    return `<b style="color: green;">${value}</b>`;
				}
            }
		})

	// Sample columns definition
	return col

}

function modal_data(data){
	let dialog = new frappe.ui.Dialog({
		title: 'Novedades Abiertas',
		size: "extra-large",
		fields: [
			{
				label: 'Datos de Ordenes',
				fieldname: 'datos_de_ordenes',
				fieldtype: 'Table',
				cannot_add_rows: true,
				cannot_delete_rows: true,
				data: data,
				fields: get_columns(true),
				is_selected: false
			}
		],
		primary_action_label: __('Crear'),
		primary_action: function(values) {

			let error_flag = false
			let error_message = []

			values.datos_de_ordenes.forEach(value => {
				console.log(value)

				if(!value.tipo_de_servicio){
					error_message.push(__(`Tipo de servicio es obligatorio en ${value.item_code}`));
					error_flag = true
				}

				if(["Mantenimiento Preventivo Planificado"].includes(value.tipo_de_servicio) && !value.cl_plantilla_de_mantenimiento){
					error_message.push(__(`Plan de Mantenimiento es obligatorio en ${value.item_code}`));
					error_flag = true
				}

				if(["Mantenimiento Correctivo"].includes(value.tipo_de_servicio) && !value.causa_raiz){
					error_message.push(__(`Causa raiz es obligatorio en ${value.item_code}`));
					error_flag = true
				}
				
			})
			
			if(!error_flag){
				frappe.call({
					method: 'qp_maintenence.qp_maintenence.doctype.gestion_multiple_de_orden_de_servicio.gestion_multiple_de_orden_de_servicio.create_orders', // Replace with your actual method path
					args: values,
					freeze: true,
					freeze_message: "Creando ordenes ...",
					callback: function(r) {
						if(r.message.status){
							dialog.hide();
							frappe.msgprint(r.message.message);
						}else{
							frappe.msgprint(__("No se pudieron crear las ordenes seleccionadas"));
						}
					}
				});
			}else{
				frappe.msgprint(error_message);
			}
			

		},
		secondary_action_label: __('Cancelar'),
		secondary_action:function() {dialog.hide();}
	});

	dialog.show();
}

function refresh_data(){
	frappe.call({
		method: 'qp_maintenence.qp_maintenence.doctype.gestion_multiple_de_orden_de_servicio.gestion_multiple_de_orden_de_servicio.get_data', // Replace with your actual method path
		args: cur_frm.doc,
		callback: function(r) {
			if (r.message){
				cur_frm.lista_hoja_de_vida_del_bien_data_table.refresh(r.message);
			}
		}
	});
}
