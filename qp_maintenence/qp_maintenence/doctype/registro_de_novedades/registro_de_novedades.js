// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Registro de Novedades', {
	refresh: function(frm) {
		if(frm.is_new()){
			frm.doc.novedades = [];
			refresh_field('novedades')
		}
	},
	item_code:function(frm){

		if(frm.doc.item_code){
			 frappe.db.get_list('Hoja de Vida del Bien', { filters:{'item_code':frm.doc.item_code}, fields:['*']}).then((result)=>{
                frm.doc.hoja_de_vida_del_bien = result[0].name   
				refresh_field('hoja_de_vida_del_bien')       
			 });
		}
		
	}
});
