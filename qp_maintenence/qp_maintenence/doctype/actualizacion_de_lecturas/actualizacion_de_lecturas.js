// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Actualizacion de Lecturas', {
	setup:function(frm){
		frm.set_query("responsable", function() {
			return {
				filters: {"deshabilitado": 0}
			};
		});

		frm.set_query("cl_hoja_de_vida_bien", function() {
			return {
				filters: {
					"estado_del_bien":["not in",["Deshabilitado"]]
				}
			};
		});

	},
	refresh:function(frm){
		if((frm.is_dirty() || !frm.is_new()) && frm.doc.codigo_de_producto && frm.doc.docstatus == 0){
			frm.trigger('tipo_de_bien')
			frm.trigger('codigo_de_producto')
			frm.trigger('lectura_actual')
		}
	},
	codigo_de_producto:function(frm){

		let filters = {}
		let save_flat = false;

		if(frm.doc.codigo_de_producto){

			frm.set_query("cl_hoja_de_vida_bien", function() {
				return {
					filters: {
						'item_code':frm.doc.codigo_de_producto,
						"estado_del_bien":["not in",["Deshabilitado"]]
					}
				};
			});

			 frappe.db.get_list('Hoja de Vida del Bien', { filters:{'item_code':frm.doc.codigo_de_producto, "estado_del_bien":["not in",["Deshabilitado"]]}, fields:['*']}).then((result)=>{
   				if(result.length > 0){
					frm.set_value("cl_hoja_de_vida_bien", result[0].name ) 
					refresh_field('cl_hoja_de_vida_bien') 
				}    
			 });
		}

		if(frm.is_new()){
			filters={
				"docstatus": 1, 
				"codigo_de_producto":frm.doc.codigo_de_producto,
				"name":["not in", frm.doc.name]
			}
		}else{
			
			save_flat = true;

			filters={
				"docstatus": 1, 
				"codigo_de_producto":frm.doc.codigo_de_producto,
				"name":["not in", frm.doc.name]
			}
		}

		if(frm.doc.codigo_de_producto){
			frappe.db.get_list('Actualizacion de Lecturas', 
			{
				fields: ['*'],
				filters:filters,
				order_by: 'modified desc',
				limit:1,
			}).then(v => {
				frm.set_value("lectura_anterior", v[0].lectura_actual)

				if(save_flat)
					if(frm.is_dirty()) frm.save();
			})
		}

	},
	lectura_actual:function(frm){
		get_lectura_acumulada(frm);
	},
	cambio:function(frm){
		get_lectura_acumulada(frm);
	},
	tipo_de_bien:function(frm){
		if(frm.doc.tipo_de_bien == 'Equipo') frm.set_value("unidad_de_medida",'Horas')
		if(frm.doc.tipo_de_bien == 'Vehículo') frm.set_value("unidad_de_medida",'Kms')
	},
	validate:function(frm){

		
		if((frm.doc.lectura_actual < frm.doc.lectura_anterior) && !(frm.doc.cambio)){
			frappe.msgprint("Lectura inválida: la Lectura Actual es menor que la Lectura Anterior. Para continuar, favor corregir valor ingresado o marcar checkbox de Cambio de odómetro/horómetro");
			frappe.validated = false;
		}

		if(frm.doc.lectura_actual > frm.doc.lectura_anterior){

			if((frm.doc.unidad_de_medida == 'Horas') &&  (frm.doc.lectura_actual - frm.doc.lectura_anterior > 100)){
				
				return new Promise(function(resolve, reject) {
					frappe.confirm('Variación atípica detectada. La diferencia supera el umbral (100 h / 3.000 km). ¿Confirma la lectura?',
					() => {
						resolve();
					}, () => {
						reject(frappe.validated = false);
					})
				})
			}

			if(frm.doc.unidad_de_medida == 'Kms'  &&  (frm.doc.lectura_actual - frm.doc.lectura_anterior > 3000)){
				return new Promise(function(resolve, reject) {
					frappe.confirm('Variación atípica detectada. La diferencia supera el umbral (100 h / 3.000 km). ¿Confirma la lectura?',
					() => {
						resolve();
					}, () => {
						reject(frappe.validated = false);
					})
				})
			}
		}
	}
});

function get_lectura_acumulada(frm){

		let filters = {}
		let save_flat = false;

		if(frm.is_new()){
			filters = {
				"docstatus": 1, 
				"codigo_de_producto":frm.doc.codigo_de_producto
			}
		}else{

			save_flat = true;

			filters = {
				"docstatus": 1, 
				"codigo_de_producto":frm.doc.codigo_de_producto,
				"name":["not in", frm.doc.name]
			}
		}

		if(frm.doc.codigo_de_producto){
			if(frm.doc.codigo_de_producto){
				frappe.db.get_list('Actualizacion de Lecturas', 
				{
					fields: ['*'],
					filters:filters,
					order_by: 'modified desc',
				}).then(als => {

					if(frm.doc.cambio){
						frm.set_value("lectura_acumulada", als[0].lectura_acumulada + frm.doc.lectura_actual)
					}
					else if(als.some(al => al.cambio)){
						frm.set_value("lectura_acumulada", als[0].lectura_acumulada + (frm.doc.lectura_actual - frm.doc.lectura_anterior))
					}else{
						frm.set_value("lectura_acumulada", frm.doc.lectura_actual)
					}	

					if(save_flat)
						if(frm.is_dirty()) frm.save();
				})
			}
		}
}