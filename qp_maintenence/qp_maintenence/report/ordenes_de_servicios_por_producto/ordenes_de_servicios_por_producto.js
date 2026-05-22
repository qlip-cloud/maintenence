// Copyright (c) 2016, Mentum Group and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Ordenes de Servicios por Producto"] = {
	formatter: function(value, row, column, data, default_formatter) {
        if (column.fieldname === "seleccionar") {
            return `<input type="checkbox" class="row-select" data-name="${data.name}">`;
        }
        return default_formatter(value, row, column, data);
    },
	onload: function(report) {

        frappe.query_report.selected_rows = [];

        $(document).on("change", ".row-select", function() {
            let name = $(this).data("name");

            if (this.checked) {
                frappe.query_report.selected_rows.push(name);
            } else {
                frappe.query_report.selected_rows =
                    frappe.query_report.selected_rows.filter(x => x !== name);
            }
        });
	
		// Guardamos referencia al original
		//Exportar EXCEL
        const original_get_filter_values = frappe.query_report.get_filter_values;

       	frappe.query_report.get_filter_values = function(for_export) {

			let filters = original_get_filter_values.call(this, for_export);

			// SIEMPRE enviar seleccionados
			filters.seleccionados = frappe.query_report.selected_rows.join(",");

			if (for_export) {
				filters.report_action = "Export";
			}

			return filters;
		};

		// Guardamos referencia al original
		//Exportar CSV
		const original_get_data_for_csv = frappe.query_report.get_data_for_csv;

		frappe.query_report.get_data_for_csv = function(include_indentation) {

			console.log("get_data_for_csv")
			
			let data = original_get_data_for_csv.call(this, include_indentation);

			const seleccionados = frappe.query_report.selected_rows;

			if (seleccionados && seleccionados.length > 0) {
				data = data.filter(row => seleccionados.includes(row[1]));
			}

			return data;
		};

		// Guardamos referencia al original
		// Imprimir PDF
		const original_pdf_report = frappe.query_report.__proto__.pdf_report;

		frappe.query_report.__proto__.pdf_report = function(print_settings) {

			if (this.report_name === "Ordenes de Servicios por Producto") {

				const seleccionados = frappe.query_report.selected_rows;

				if (seleccionados.length > 0) {

					// Guardar data original
					const original_data = this.data;

					// Filtrar data visible
					this.data = original_data.filter(row => seleccionados.includes(row.name));

					// Ejecutar PDF
					original_pdf_report.call(this, print_settings);

					// Restaurar data original
					this.data = original_data;

					return;
				}
			}

			return original_pdf_report.call(this, print_settings);
		};

    },
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
			"label": __("Tipo de Bien"),
			"fieldname": "tipo_de_bien",
			"fieldtype": "Select",
			"options":" \nEquipo\nVehículo\nLocativo"
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
		},
		{
            "fieldname": "seleccionados",
            "label": "Seleccionados",
            "fieldtype": "Data",
            "hidden": 1
        }
	]
};