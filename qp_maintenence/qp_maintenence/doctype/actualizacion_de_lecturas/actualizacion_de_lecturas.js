// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Actualizacion de Lecturas', {
	setup:function(frm){
		frm.set_query("responsable", function() {
			return {
				filters: {"deshabilitado": 0}
			};
		});
	},
	refresh:function(frm){
		if((frm.is_dirty() || !frm.is_new()) && frm.doc.codigo_de_producto && frm.doc.docstatus == 0){
			frm.trigger('codigo_de_producto')
			frm.trigger('lectura_actual')
		}
	},
	codigo_de_producto:function(frm){

		let filters = {}
		let save_flat = false;

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
		

		if(frm.doc.codigo_de_producto){
			 frappe.db.get_list('Hoja de Vida del Bien', { filters:{'item_code':frm.doc.codigo_de_producto}, fields:['*']}).then((result)=>{
   				if(result.length > 0){
					frm.set_value("cl_hoja_de_vida_bien", result[0].name ) 
					refresh_field('cl_hoja_de_vida_bien') 
				}    
			 });
		}

	},
	lectura_actual:function(frm){

		let filters = {}
		let save_flat = false;

		if(!frm.is_new()){
			save_flat = true;
		}

		if(frm.doc.codigo_de_producto){
			if(frm.doc.codigo_de_producto){
				frappe.db.get_list('Actualizacion de Lecturas', 
				{
					fields: ['*'],
					filters:filters = {
						"docstatus": 1, 
						"codigo_de_producto":frm.doc.codigo_de_producto
					},
					order_by: 'modified desc',
				}).then(als => {
					if(als.some(al => al.cambio)){
						frm.set_value("lectura_acumulada", als[0].lectura_acumulada + frm.doc.lectura_actual)
					}else{
						frm.set_value("lectura_acumulada", frm.doc.lectura_actual)
					}	

					if(save_flat)
						if(frm.is_dirty()) frm.save();
				})
			}
		}
	},
	tipo_de_bien:function(frm){
		if(frm.doc.tipo_de_bien == 'Equipo') frm.set_value("unidad_de_medida",'Horas')
		if(frm.doc.tipo_de_bien == 'Vehículo') frm.set_value("unidad_de_medida",'Kms')
	},
	validate:function(frm){
		if(frm.is_dirty()){
			if(frm.doc.lectura_actual < frm.doc.lectura_anterior){
				frappe.msgprint("Señor Usuario, por favor revise la información digitada en el campo de lectura actual, ya que está ingresando un valor inferior que alterará la lectura acumulada del equipo. Si lo anterior es correcto, favor diligenciar la columna de observaciones con la respectiva explicación.");
			}


		}
	}
});
