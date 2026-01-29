// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Registro de Novedades', {
	setup:function(frm){

		frm.set_query("hoja_de_vida_del_bien", function() {
			return {
				filters: {
					"estado_del_bien":["not in",["Deshabilitado"]]
				}
			};
		});

	},
	refresh: function(frm) {
		if(frm.is_new()){
			frm.doc.novedades = [];
			refresh_field('novedades')
		}

		if(frm.doc.docstatus == 2){
			frm.toggle_display('motivo_de_cancelacion', true);
		}
	},
	item_code:function(frm){

		if(frm.doc.item_code){

			frm.set_query("hoja_de_vida_del_bien", function() {
				return {
					filters: {
						'item_code':frm.doc.item_code,
						"estado_del_bien":["not in",["Deshabilitado"]]
					}
				};
			});

			frappe.db.get_list('Hoja de Vida del Bien', { filters:{'item_code':frm.doc.item_code, "estado_del_bien":["not in",["Deshabilitado"]]}, fields:['*']}).then((result)=>{
                frm.doc.hoja_de_vida_del_bien = result[0].name   
				refresh_field('hoja_de_vida_del_bien')       
			 });
		}
		
	},
	before_cancel: function(frm) {
		
		if (!frm.doc.motivo_de_cancelacion) {
			frm.toggle_display('motivo_de_cancelacion', true);
			frm.toggle_reqd('motivo_de_cancelacion', true);
			frappe.msgprint('Debe incluir un motivo de cancelación');
			frappe.validated = false;
		}
    }
});
