// Copyright (c) 2016, Mentum Group and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Reporte Registro de Novedades"] = {
	"filters": [
		{
			"fieldname":"cl_hoja_de_vida_bien",
			"label": __("Hoja de Vida del Bien"),
			"fieldtype": "MultiSelectList",
			get_data: function(txt) {
				return frappe.db.get_link_options("Hoja de Vida del Bien", txt);
			}
		},
		{
			"fieldname":"codigo_de_producto",
			"label": __("Código de producto"),
			"fieldtype": "MultiSelectList",
			get_data: function(txt) {
				return frappe.db.get_link_options("Item", txt);
			}
		},
		{
			"fieldname":"tipo_de_novedad",
			"label": __("Tipo de novedad"),
			"fieldtype": "Select",
			"options":" \nEléctrica\nMecánica\nHidráulica\nNeumática\nInfraestructura\nSeguridad Industrial\nTecnológica"
		},
		{
			"fieldname":"quien_reporta",
			"label": __("Quien Reporta"),
			"fieldtype": "MultiSelectList",
			get_data: function(txt) {
				return frappe.db.get_link_options("Employee", txt);
			}
		},
		{
			"fieldname":"area_ejecutora",
			"label": __("Área Ejecutora"),
			"fieldtype": "Select",
			"options":" \nMantenimiento\nOperaciones\nInspección\nOtro"
		},
		{
			"fieldname":"fuente_de_la_novedad",
			"label": __("Fuente de la novedad"),
			"fieldtype": "Select",
			"options":" \nEmail\nTarjeta de observación Sharp\nOrden de servicio\nWhatsApp\nInspección\nAuditoria\nOtro"
		},
		{
			"fieldname":"state",
			"label": __("Estado de la novedad"),
			"fieldtype": "Select",
			"options":" \nClosed\nOpen"
		},
		{
			"fieldname":"orden_de_servicio",
			"label": __("Orden de Servicio"),
			"fieldtype": "MultiSelectList",
			get_data: function(txt) {
				return frappe.db.get_link_options("Orden de Servicio", txt);
			},
		},
		{
			"fieldname":"fecha_inicio",
			"label": __("Fecha Inicio de Reporte"),
			"fieldtype": "Date"
		},
		{
			"fieldname":"fecha_fin",
			"label": __("Fecha Fin de Reporte"),
			"fieldtype": "Date"
		},
		
	]
};
