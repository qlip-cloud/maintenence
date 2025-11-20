// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.ui.form.on('Registro de Novedades', {
	refresh: function(frm) {
		if(frm.is_new()){
			frm.doc.novedades = [];
			refresh_field('novedades')
		}
	}
});
