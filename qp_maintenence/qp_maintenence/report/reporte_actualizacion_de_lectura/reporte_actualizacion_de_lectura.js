// Copyright (c) 2016, Mentum Group and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Reporte Actualizacion de Lectura"] = {
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
			"fieldname":"responsable",
			"label": __("Responsable"),
			"fieldtype": "MultiSelectList",
			get_data: function(txt) {
				return frappe.db.get_link_options("Equipo Tecnico", txt);
			}
		},
		{
			"fieldname":"ubicacion",
			"label": __("Location"),
			"fieldtype": "MultiSelectList",
			get_data: function(txt) {
				return frappe.db.get_link_options("Location", txt);
			}
		},
		{
			"fieldname":"tipo_de_bien",
			"label": __("Tipo de Bien"),
			"fieldtype": "Select",
			"options":" \nEquipo\nVehículo"
		},
		{
			"fieldname":"unidad_de_medida",
			"label": __("Unidad de Medida"),
			"fieldtype": "Select",
			"options":" \nKms\nHoras"
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
		{
			"fieldname":"cambio",
			"label": __("Cambio de odómetro/horómetro"),
			"fieldtype": "Check"
		},
	]
};
