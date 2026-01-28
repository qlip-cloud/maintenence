// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Registro de Novedades', {
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
			 frappe.db.get_list('Hoja de Vida del Bien', { filters:{'item_code':frm.doc.item_code}, fields:['*']}).then((result)=>{
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
    },
	validate:function(frm){
		if(frm.doc.item_code){
			frm.call({
				method:"frappe.client.get_value",
				args:{
					doctype:"Hoja de Vida del Bien",
					filters:{
						item_code: frm.doc.item_code, 
						estado_del_bien:"Deshabilitado"
					},
					fieldname:["name"]
				},
				async:false,
				callback:function(r){
					if(r.message){
						frappe.msgprint(`El equipo ${frm.doc.item_code} asociado a la Hoja de Vida del Bien ${r.message.name} se encuentra en estado Deshabilitado, y por tanto no puede ser utilizado ni relacionado en ningún proceso del sistema`);
						frappe.validated = false;
					}
				}

			})
		}
	}
});
