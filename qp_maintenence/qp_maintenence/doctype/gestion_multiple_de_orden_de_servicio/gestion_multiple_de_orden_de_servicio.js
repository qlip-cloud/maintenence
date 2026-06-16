// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

const mp_datatable = null;

frappe.ui.form.on('Gestion Multiple de Orden de Servicio', {
	refresh: function(frm) {
		frm.add_custom_button(__('Crear Ordenes'), function() {
			create_orders(frm);
        }, 'Gestionar Ordenes')

		frm.add_custom_button(__('Imprimir PDF'), function() {
			print_orders(frm, 'PDF');
        }, 'Gestionar Ordenes')

		frm.add_custom_button(__('Imprimir Excel'), function() {
			print_orders(frm, 'EXCEL');
        }, 'Gestionar Ordenes')

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

function print_orders(frm, type) {

    // 1. Obtener filas seleccionadas
    let rowmanager = frm.lista_hoja_de_vida_del_bien_data_table.rowmanager;
    let indexes = rowmanager.getCheckedRows().map(crow => parseInt(crow));

    if (indexes.length == 0) {
        frappe.msgprint(__("Debe seleccionar al menos un registro de la lista"));
        return;
    }

    let data_table = rowmanager.datamanager.data;
    let rows = rowmanager.datamanager.rowViewOrder
        .map(index => indexes.includes(index) ? data_table[index] : null)
        .filter(Boolean);

    // 2. Obtener columnas visibles (limpias)
    let dt = frm.lista_hoja_de_vida_del_bien_data_table;

    let visible_columns = dt.datamanager.columns
        .filter(col => col.fieldname && !col.hidden)
        .sort((a, b) => a.colIndex - b.colIndex)
        .map(col => ({
            fieldname: col.fieldname,
            label: col.label || col.fieldname
        }));

    // 3. Limpiar filas según columnas visibles
    let cleaned_rows = rows.map(row => {
        let cleaned = {};
        visible_columns.forEach(col => {
            cleaned[col.fieldname] = row[col.fieldname];
        });
        return cleaned;
    });

    // 4. AHORA sí mostramos el popup
    let d = new frappe.ui.Dialog({
        title: "Ajustes de impresión",
        fields: [
            {
                fieldname: "con_membrete",
                label: "Con membrete",
                fieldtype: "Check",
                default: 1
            },
            {
                fieldname: "membrete",
                label: "Membrete",
                fieldtype: "Link",
                options: "Letter Head",
                depends_on: "eval:doc.con_membrete"
            }
        ],
        primary_action_label: "Imprimir",
        primary_action(values) {

            frappe.call({
                method: "qp_maintenence.qp_maintenence.doctype.gestion_multiple_de_orden_de_servicio.gestion_multiple_de_orden_de_servicio.print_data",
                args: {
                    doc: frm.doc,
                    selected_data: cleaned_rows,
                    columns: visible_columns,
                    type: type,
                    con_membrete: values.con_membrete,
                    letterhead: values.membrete
                },
                callback(r) {
                    if (r.message) window.open(r.message);
                }
            });

            d.hide();
        }
    });

    d.show();
}



function create_orders(frm) {
	
	let rowmanager = frm.lista_hoja_de_vida_del_bien_data_table.rowmanager;
	let indexes = rowmanager.getCheckedRows().map(crow => parseInt(crow));

	if (indexes.length == 0) frappe.msgprint(__("Debe seleccionar al menos un registro de la lista"));
	else {

		let data_table = rowmanager.datamanager.data
		let rows = rowmanager.datamanager.rowViewOrder.map(index => {
			if(indexes.includes(index)){
				data_table[index].cl_plantilla_de_mantenimiento = null;
				return data_table[index] 
			}
		}).filter(Boolean);

		modal_data(rows)

	}

}

// function print_orders(frm, type) {
	
// 	let rowmanager = frm.lista_hoja_de_vida_del_bien_data_table.rowmanager;
// 	let indexes = rowmanager.getCheckedRows().map(crow => parseInt(crow));
	
// 	if (indexes.length == 0) frappe.msgprint(__("Debe seleccionar al menos un registro de la lista"));
// 	else {

// 		let data_table = rowmanager.datamanager.data
// 		let rows = rowmanager.datamanager.rowViewOrder.map(index => {
// 			if(indexes.includes(index)){
// 				return data_table[index] 
// 			}
// 		}).filter(Boolean);

// 		let dt = frm.lista_hoja_de_vida_del_bien_data_table;

// 		let visible_columns = dt.datamanager.columns
// 			.filter(col => col.fieldname && !col.hidden)
// 			.sort((a, b) => a.colIndex - b.colIndex)
// 			.map(col => ({
// 				fieldname: col.fieldname,
// 				label: col.label
// 			}));

// 		let cleaned_rows = rows.map(row => {
// 			let cleaned = {};
// 			visible_columns.forEach(col => {
// 				cleaned[col.fieldname] = row[col.fieldname];
// 			});
// 			return cleaned;
// 		});


// 		frappe.call(
// 			{ 
// 				method: 'qp_maintenence.qp_maintenence.doctype.gestion_multiple_de_orden_de_servicio.gestion_multiple_de_orden_de_servicio.print_data', // Replace with your actual method path
// 				args: { 
// 					doc: frm.doc,
// 					selected_data: rows,
// 					columns: visible_columns,
// 					type:type
// 				}, 
// 				callback(r) {
// 					 if (r.message){ 
// 						const w = window.open(r.message); 
// 						if (!w) frappe.msgprint("Permite ventanas emergentes para ver el PDF"); 
// 					} 
// 				} 
// 			});

// 	}

// }

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
			label:'Nombre del Producto',
			name:'Nombre del Producto', 
			id:'item_name', 
			fieldname:'item_name',
			fieldtype:'Data',
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			label:'Hoja de Vida', 
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
			label:'Estado', 
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
			label:'Ubicacion',
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
			label:'Fecha Ultimo Mantenimiento Preventivo', 
			id:'fecha_ultimo_mantenimiento',
			fieldname:'fecha_ultimo_mantenimiento',
			fieldtype:'Date',
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			name:'Fecha próximo mantenimiento preventivo por periodicidad', 
			label:'Fecha próximo mantenimiento preventivo por periodicidad', 
			id:'fecha_proximo_mantenimiento',
			fieldname:'fecha_proximo_mantenimiento',
			fieldtype:'Date',
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			name:'Fecha última actualización de lectura', 
			label:'Fecha última actualización de lectura', 
			id:'fecha_ultima_actualizacion_de_lectura',
			fieldname:'fecha_ultima_actualizacion_de_lectura',
			fieldtype:'Date',
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			name:'Valor de la última lectura actual', 
			label:'Valor de la última lectura actual', 
			id:'ultima_lectura_actual',
			fieldname:'ultima_lectura_actual',
			fieldtype:'Int',
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			name:'Unidad de medida de lectura', 
			label:'Unidad de medida de lectura', 
			id:'unidad_de_medida',
			fieldname:'unidad_de_medida',
			fieldtype:'Data',
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			name:'Nro. Ordenes de Servicio Abiertas', 
			label:'Nro. Ordenes de Servicio Abiertas', 
			fieldname:'nro_ordenes',
			id:'nro_ordenes',
			fieldtype:'Int',
			editable: false,
			hidden: is_modal,
			sortable: true
		},
		{
			name:'Vigencia próximo servicio por periodicidad', 
			label:'Vigencia próximo servicio por periodicidad', 
			id:'vig_prox_serv', 
			fieldname:'vig_prox_serv',
			fieldtype:'Data',
			editable: false,
			hidden: is_modal,
			sortable: true,
			format: (value, row) => {
				if(!value) return "";
				else if (value > 0 && value < 30) return `<b style="color: orange;">${value}</b>`;
				else if (value <= 0) return `<b style="color: red;">${value}</b>`;
                else return `<b style="color: green;">${value}</b>`;
				
            }
		},
		{
			name:'Vigencia próximo servicio por horas/kms', 
			label:'Vigencia próximo servicio por horas/kms', 
			id:'vig_prox_serv_horas_kms',
			fieldname:'vig_prox_serv_horas_kms',
			fieldtype:'Data',
			editable: false,
			hidden: is_modal,
			sortable: true,
			format: (value, row, column, data) => {

				if(data.unidad_de_medida == 'Kms')
				{
					if(!value) return "";
					else if (value > 1 && value < 999) return `<b style="color: orange;">${value}</b>`;
					else if (value <= 0) return `<b style="color: red;">${value}</b>`;
					else return `<b style="color: green;">${value}</b>`;
				} else if(data.unidad_de_medida == 'Horas'){
					if(!value) return "";
					else if (value > 1 && value < 79) return `<b style="color: orange;">${value}</b>`;
					else if (value <= 0) return `<b style="color: red;">${value}</b>`;
					else return `<b style="color: green;">${value}</b>`;
				} else{
					return "";
				}
					
					
            }
		},)

	// Sample columns definition
	return col

}

function modal_data(data){
	let dialog;

	dialog = new frappe.ui.Dialog({
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
