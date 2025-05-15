// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Equipo Tecnico', {
	id_de_empleado:function(frm){
		if(frm.doc.id_de_empleado){
			frappe.db.get_list("Employee Education", { 
				filters:{
					'parenttype':'Employee', 'parentfield':"education", 'parent':frm.doc.id_de_empleado
				},
				fields:["*"],
				order_by:"idx"
			}).then((r) => {
				if (r){
					frm.set_value('formacion_academica', r[0].school_univ);
				}
				frm.refresh_field('formacion_academica')
			});
		}else{
			frm.set_value('formacion_academica', '')
		}

		frm.refresh_field('formacion_academica')
	}// refresh: function(frm) {

	// }
});
