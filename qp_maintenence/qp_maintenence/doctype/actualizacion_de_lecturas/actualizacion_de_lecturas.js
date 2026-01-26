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
		if(!frm.is_new() && frm.doc.codigo_de_producto && frm.doc.docstatus == 0){
			frm.trigger('codigo_de_producto')
		}
	},
	codigo_de_producto:function(frm){
		if(frm.is_new()){
			if(frm.doc.codigo_de_producto){
				frappe.db.get_list('Actualizacion de Lecturas', 
				{
					fields: ['lectura_actual'],
					filters:{
						"docstatus": 1, 
						"codigo_de_producto":frm.doc.codigo_de_producto
					},
					order_by: 'creation desc',
				}
				).then(ld => {
					
					if(ld.length > 0){
						frm.set_value("lectura_anterior", ld[0].lectura_actual)

						let total = 0
						ld.forEach((value) => {
							total += value.lectura_actual;
						});

						frm.set_value("lectura_acumulada", total)

					}else{
						frm.set_value("lectura_anterior", 0)
						frm.set_value("lectura_acumulada", 0)
					}

					refresh_field('lectura_anterior')
					refresh_field('lectura_acumulada')
					
				})
			}
		}else{
			if(frm.doc.codigo_de_producto){
				frappe.db.get_list('Actualizacion de Lecturas', 
					{
						fields: ['lectura_actual'],
						filters:{
							"docstatus": 1, 
							"codigo_de_producto":frm.doc.codigo_de_producto, 
							"name":["not in", frm.doc.name]
						},
						order_by: 'creation desc',
					}
				).then(ld => {

					if(ld.length > 0){
						
						frm.set_value("lectura_anterior", ld[0].lectura_actual)

						let total = 0
						ld.forEach((value) => {
							total += value.lectura_actual;
						});

						frm.set_value("lectura_acumulada", total)
					}else{
						frm.set_value("lectura_anterior", 0)
						frm.set_value("lectura_acumulada", 0)
					}

					
					refresh_field('lectura_anterior')
					refresh_field('lectura_acumulada')

					if(frm.is_dirty()) frm.save();

				})
			}

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
		if(frm.doc.lectura_actual <= 0){
			frappe.msgprint("Señor Usuario, por favor revise la información digitada en el campo de lectura actual, ya que está ingresando un valor negativo o un cero que alterará la lectura acumulada del equipo. Si lo anterior es 	correcto, favor diligenciar la columna de observaciones con la respectiva explicación.");
		}
	},
	tipo_de_bien:function(frm){
		if(frm.doc.tipo_de_bien == 'Equipo') frm.set_value("unidad_de_medida",'Horas')
		if(frm.doc.tipo_de_bien == 'Vehículo') frm.set_value("unidad_de_medida",'Kms')
	},
	before_submit: function(frm) {
		frm.doc.lectura_acumulada += frm.doc.lectura_actual;
		refresh_field('lectura_acumulada');
	}
});
