// Copyright (c) 2016, Mentum Group and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Ordenes de Servicios por Producto"] = {
	"filters": [
		{
			"fieldname":"orden_de_servicio",
			"label": __("Número de OT"),
			"fieldtype": "MultiSelectList",
			get_data: function(txt) {
				return frappe.db.get_link_options("Orden de Servicio", txt);
			}
		},
		{
			"label": __("Estado de la OT"),
			"fieldname": "status",
			"fieldtype": "Select",
			"options":" \nDraft\nIn Process\nCompleted\nCancelled"
		},
		{
			"fieldname":"producto",
			"label": __("Item Code"),
			"fieldtype": "MultiSelectList",
			get_data: function(txt) {
				return frappe.db.get_link_options("Item", txt);
			}
		},
		{
			"label": __("Nombre de Producto"),
			"fieldname": "descripcion_del_producto",
			"fieldtype": "Data",
		},
		{
			"fieldname":"cl_plantilla_de_mantenimiento",
			"label": __("Plantilla de Mantenimiento"),
			"fieldtype": "MultiSelectList",
			get_data: function(txt) {
				return frappe.db.get_link_options("Project Template", txt);
			}
		},
		{
			"label": __("Tipo de Servicio"),
			"fieldname": "tipo_de_servicio",
			"fieldtype": "Select",
			"options":" \nGarantía\nMantenimiento Preventivo Planificado\nMantenimiento Preventivo\nMantenimiento Correctivo\nMantenimiento Predictivo\nMejora (Reingeniería)\nDiagnóstico"
		},
		{
			"fieldname":"responsable",
			"label": __("Solicitante"),
			"fieldtype": "MultiSelectList",
			get_data: function(txt) {
				return frappe.db.get_link_options("Equipo Tecnico", txt);
			}
		},
		{
			"fieldname":"ubicacion",
			"label": __("Ubicacion"),
			"fieldtype": "MultiSelectList",
			get_data: function(txt) {
				return frappe.db.get_link_options("Location", txt);
			}
		},
		{
			"label": __("Fecha Inicio"),
			"fieldname": "fecha_y_hora_inicio_real_os",
			"fieldtype": "Datetime",
		},
		{
			"label": __("Fecha Fin"),
			"fieldname": "fecha_y_hora_finalización_os",
			"fieldtype": "Datetime",
		}
	],
	formatter: function(value, row, column, data, default_formatter) {
		return default_formatter(__(value), row, column, data);
	}
};
