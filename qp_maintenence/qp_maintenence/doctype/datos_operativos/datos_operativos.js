// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Datos Operativos', {
	// refresh: function(frm) {

	// }
});

frappe.ui.form.on('Datos Operativos Mesa', {
	lectura_inicial: function(frm, cdt,cdn){
		frm.doc.lectura_acumulada = frm.doc.lectura_inicial + frm.doc.lectura_final
	},
	lectura_final: function(frm, cdt,cdn){
		frm.doc.lectura_acumulada = frm.doc.lectura_inicial + frm.doc.lectura_final
	}
});
