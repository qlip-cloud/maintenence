// Copyright (c) 2016, Mentum Group and contributors
// For license information, please see license.txt
/* eslint-disable */


// ============================================================
// CALENDARIO MANTENIMIENTO PREVENTIVO
// QLIP BUSINESS / FRAPPE
//
// - Vista Año
// - Vista Mes
// - Vista Semana
// - Vista Día
// - Filtro Nombre del Producto tipo Link a Item
// - Pantalla completa
// - PDF
// - Excel
// - Columnas alineadas
// - Solo link Hoja de Vida en tarjeta
// ============================================================


// ============================================================
// ESTADO
// ============================================================

var cm_vista_actual = "mes";
var cm_fecha_actual = null;


// ============================================================
// REPORTE
// ============================================================

frappe.query_reports["Calendario Mantenimientos Preventivos"] = {

    filters: [

        // ====================================================
        // AÑO
        // ====================================================

        {
            fieldname: "anio",
            label: __("Año"),
            fieldtype: "Int",
            default: new Date().getFullYear(),
            on_change: function () {

                var anio =
                    Number(
                        frappe.query_report
                            .get_filter_value(
                                "anio"
                            )
                    );


                if (!anio) {
                    return;
                }


                var mes =
                    obtener_numero_mes_filtro();


                if (!mes) {

                    if (cm_fecha_actual) {

                        mes =
                            cm_fecha_actual.getMonth() + 1;

                    }

                    else {

                        mes =
                            new Date().getMonth() + 1;

                    }

                }


                var dia =
                    Number(
                        frappe.query_report
                            .get_filter_value(
                                "dia"
                            )
                    );


                if (!dia) {
                    dia = 1;
                }


                cm_fecha_actual =
                    crear_fecha_segura(
                        anio,
                        mes,
                        dia
                    );


                render_calendario_mantenimiento();

            }
        },


        // ====================================================
        // MES
        // ====================================================

        {
            fieldname: "mes",
            label: __("Mes"),
            fieldtype: "Select",

            options:
                "\nEnero\nFebrero\nMarzo\nAbril\nMayo\nJunio\nJulio\nAgosto\nSeptiembre\nOctubre\nNoviembre\nDiciembre",

            default:
                nombre_mes_completo(
                    new Date()
                ),

            on_change: function () {

                var mes =
                    obtener_numero_mes_filtro();


                if (!mes) {

                    render_calendario_mantenimiento();

                    return;

                }


                var anio =
                    Number(
                        frappe.query_report
                            .get_filter_value(
                                "anio"
                            )
                    );


                if (!anio) {

                    anio =
                        new Date().getFullYear();

                }


                var dia =
                    Number(
                        frappe.query_report
                            .get_filter_value(
                                "dia"
                            )
                    );


                if (!dia) {

                    if (cm_fecha_actual) {

                        dia =
                            cm_fecha_actual.getDate();

                    }

                    else {

                        dia = 1;

                    }

                }


                cm_fecha_actual =
                    crear_fecha_segura(
                        anio,
                        mes,
                        dia
                    );


                render_calendario_mantenimiento();

            }
        },


        // ====================================================
        // DÍA
        // ====================================================

        {
            fieldname: "dia",
            label: __("Día"),
            fieldtype: "Select",

            options:
                "\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28\n29\n30\n31",

            on_change: function () {

                var valorDia =
                    frappe.query_report
                        .get_filter_value(
                            "dia"
                        );


                if (!valorDia) {

                    render_calendario_mantenimiento();

                    return;

                }


                var anio =
                    Number(
                        frappe.query_report
                            .get_filter_value(
                                "anio"
                            )
                    );


                if (!anio) {

                    anio =
                        new Date().getFullYear();

                }


                var mes =
                    obtener_numero_mes_filtro();


                if (!mes) {

                    if (cm_fecha_actual) {

                        mes =
                            cm_fecha_actual.getMonth() + 1;

                    }

                    else {

                        mes =
                            new Date().getMonth() + 1;

                    }

                }


                cm_fecha_actual =
                    crear_fecha_segura(
                        anio,
                        mes,
                        Number(valorDia)
                    );


                cm_vista_actual =
                    "dia";


                render_calendario_mantenimiento();

            }
        },


        // ====================================================
        // NOMBRE DEL PRODUCTO
        //
        // LINK A ITEM
        // ====================================================

        {
            fieldname: "producto",
            label: __("Nombre del Producto"),
            fieldtype: "Link",
            options: "Item",

            on_change: function () {

                frappe.query_report.refresh();

            }
        },


        // ====================================================
        // CLIENTE
        // ====================================================

        {
            fieldname: "customer",
            label: __("Cliente"),
            fieldtype: "Link",
            options: "Customer",

            on_change: function () {

                frappe.query_report.refresh();

            }
        },


        // ====================================================
        // HOJA DE VIDA
        // ====================================================

        {
            fieldname: "hoja_de_vida",
            label: __("Hoja de Vida"),
            fieldtype: "Link",
            options: "Hoja de Vida del Bien",

            on_change: function () {

                frappe.query_report.refresh();

            }
        },


        // ====================================================
        // PLAN
        // ====================================================

        {
            fieldname: "plan_mantenimiento",
            label: __("Plan de Mantenimiento"),
            fieldtype: "Link",
            options: "Project Template",

            get_query: function () {

                return {

                    filters: {

                        taller_y_mantenimiento: 1

                    }

                };

            },

            on_change: function () {

                frappe.query_report.refresh();

            }
        },


        // ====================================================
        // UNIDAD
        // ====================================================

        {
            fieldname: "unidad_de_medida",
            label: __("Unidad"),
            fieldtype: "Select",

            options:
                "\nHoras\nKilómetros",

            on_change: function () {

                frappe.query_report.refresh();

            }
        },


        // ====================================================
        // RESPONSABLE
        // ====================================================

        {
            fieldname: "responsable",
            label: __("Responsable"),
            fieldtype: "Link",
            options: "User",

            on_change: function () {

                frappe.query_report.refresh();

            }
        },


        // ====================================================
        // ESTADO
        // ====================================================

        {
            fieldname: "semaforo",
            label: __("Estado"),
            fieldtype: "Select",

            options:
                "\nVIGENTE\nPRÓXIMO A VENCER\nVENCIDO\nSIN INFORMACIÓN",

            on_change: function () {

                frappe.query_report.refresh();

            }
        }

    ],


    // ========================================================
    // ONLOAD
    // ========================================================

    onload: function (report) {


        if (!cm_fecha_actual) {

            var hoy =
                new Date();


            cm_fecha_actual =
                new Date(
                    hoy.getFullYear(),
                    hoy.getMonth(),
                    hoy.getDate()
                );

        }


        // ====================================================
        // PANTALLA COMPLETA
        // ====================================================

        report.page.add_inner_button(

            __("Pantalla completa"),

            function () {

                activar_pantalla_completa_calendario();

            }

        );


        // ====================================================
        // HOY
        // ====================================================

        report.page.add_inner_button(

            __("Hoy"),

            function () {

                var hoy =
                    new Date();


                cm_fecha_actual =
                    new Date(
                        hoy.getFullYear(),
                        hoy.getMonth(),
                        hoy.getDate()
                    );


                report.set_filter_value(
                    "anio",
                    hoy.getFullYear()
                );


                report.set_filter_value(
                    "mes",
                    nombre_mes_completo(hoy)
                );


                report.set_filter_value(
                    "dia",
                    ""
                );


                cm_vista_actual =
                    "mes";


                render_calendario_mantenimiento();

            }

        );


        // ====================================================
        // EXPORTAR PDF
        // ====================================================

        report.page.add_inner_button(

            __("Exportar PDF"),

            function () {

                exportar_calendario_pdf();

            }

        );


        // ====================================================
        // EXPORTAR EXCEL
        // ====================================================

        report.page.add_inner_button(

            __("Exportar Excel"),

            function () {

                exportar_calendario_excel();

            }

        );

    },


    after_datatable_render: function () {

        setTimeout(

            function () {

                render_calendario_mantenimiento();

            },

            150

        );

    }

};


// ============================================================
// PANTALLA COMPLETA
// ============================================================

function activar_pantalla_completa_calendario() {


    var elemento =
        document.getElementById(
            "calendario-mantenimiento-container"
        );


    if (!elemento) {

        frappe.msgprint(
            __("No se encontró el calendario.")
        );

        return;

    }


    if (!document.fullscreenElement) {

        if (elemento.requestFullscreen) {

            elemento.requestFullscreen();

        }

        else if (elemento.webkitRequestFullscreen) {

            elemento.webkitRequestFullscreen();

        }

    }

    else {

        if (document.exitFullscreen) {

            document.exitFullscreen();

        }

        else if (document.webkitExitFullscreen) {

            document.webkitExitFullscreen();

        }

    }

}


// ============================================================
// EXPORTAR PDF
// ============================================================

function exportar_calendario_pdf() {


    var calendario =
        document.getElementById(
            "calendario-mantenimiento-container"
        );


    if (!calendario) {

        frappe.msgprint(
            __("No se encontró el calendario.")
        );

        return;

    }


    var estilos =
        document.getElementById(
            "cm-calendar-styles"
        );


    var estilosHtml =
        estilos
            ? estilos.innerHTML
            : "";


    var ventana =
        window.open(
            "",
            "_blank"
        );


    if (!ventana) {

        frappe.msgprint(
            __("El navegador bloqueó la ventana de impresión.")
        );

        return;

    }


    var titulo =
        "Calendario Mantenimiento Preventivo - "
        +
        obtener_titulo_vista();


    ventana.document.open();


    ventana.document.write(

        '<!DOCTYPE html>' +

        '<html>' +

        '<head>' +

            '<meta charset="UTF-8">' +

            '<title>' +
                escapar_html(titulo) +
            '</title>' +

            '<style>' +

                estilosHtml +

                '@page{' +
                    'size:A3 landscape;' +
                    'margin:7mm;' +
                '}' +

                'html,body{' +
                    'margin:0;' +
                    'padding:0;' +
                    'background:#ffffff;' +
                    'font-family:Arial,Helvetica,sans-serif;' +
                    '-webkit-print-color-adjust:exact !important;' +
                    'print-color-adjust:exact !important;' +
                '}' +

                '.cm-container{' +
                    'box-shadow:none !important;' +
                    'border:none !important;' +
                    'margin:0 !important;' +
                    'width:100% !important;' +
                '}' +

                '.cm-toolbar-actions{' +
                    'display:none !important;' +
                '}' +

                '.cm-card-links{' +
                    'display:none !important;' +
                '}' +

                '.cm-weekdays,' +
                '.cm-days{' +
                    'grid-template-columns:repeat(7,minmax(0,1fr)) !important;' +
                '}' +

                '.cm-day{' +
                    'min-width:0 !important;' +
                    'box-sizing:border-box !important;' +
                '}' +

            '</style>' +

        '</head>' +

        '<body>' +

            calendario.outerHTML +

        '</body>' +

        '</html>'

    );


    ventana.document.close();


    setTimeout(

        function () {

            ventana.focus();

            ventana.print();

        },

        500

    );

}


// ============================================================
// EXPORTAR EXCEL
// ============================================================

function exportar_calendario_excel() {

	console.log(frappe.query_report)
	
    if (!frappe.query_report) {
        return;
    }


    var datos =
        frappe.query_report.data || [];


    var datosExportar =
        obtener_datos_vista(
            datos
        );


    if (!datosExportar.length) {

        frappe.msgprint(
            __("No existen datos para exportar en la vista actual.")
        );

        return;

    }


    var titulo =
        "Calendario Mantenimiento Preventivo - "
        +
        obtener_titulo_vista();


    var html =

        '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
        'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
        'xmlns="http://www.w3.org/TR/REC-html40">' +

        '<head>' +

            '<meta charset="UTF-8">' +

            '<style>' +

                'body{font-family:Arial,sans-serif;}' +

                'table{' +
                    'border-collapse:collapse;' +
                    'width:100%;' +
                '}' +

                'th{' +
                    'background:#0B4C87;' +
                    'color:#FFFFFF;' +
                    'font-weight:bold;' +
                    'border:1px solid #D0D7DE;' +
                    'padding:8px;' +
                    'text-align:center;' +
                '}' +

                'td{' +
                    'border:1px solid #D0D7DE;' +
                    'padding:7px;' +
                '}' +

                '.titulo{' +
                    'background:#07376C;' +
                    'color:#FFFFFF;' +
                    'font-size:18px;' +
                    'font-weight:bold;' +
                    'padding:12px;' +
                '}' +

                '.subtitulo{' +
                    'background:#8DC63F;' +
                    'color:#07376C;' +
                    'font-weight:bold;' +
                    'padding:8px;' +
                '}' +

                '.estado-verde{' +
                    'background:#E6F7EA;' +
                    'color:#206B3F;' +
                    'font-weight:bold;' +
                '}' +

                '.estado-amarillo{' +
                    'background:#FFF1C9;' +
                    'color:#885A00;' +
                    'font-weight:bold;' +
                '}' +

                '.estado-rojo{' +
                    'background:#FDE2E2;' +
                    'color:#A52C28;' +
                    'font-weight:bold;' +
                '}' +

                '.estado-gris{' +
                    'background:#EDF0F3;' +
                    'color:#596879;' +
                    'font-weight:bold;' +
                '}' +

            '</style>' +

        '</head>' +

        '<body>' +

            '<table>' +

                '<tr>' +

                    '<td class="titulo" colspan="11">' +

                        escapar_html(titulo) +

                    '</td>' +

                '</tr>' +

                '<tr>' +

                    '<td class="subtitulo" colspan="11">' +

                        'Calendario de próximos mantenimientos' +

                    '</td>' +

                '</tr>' +

                '<tr>' +

                    '<th>Hoja de Vida</th>' +
                    '<th>Código</th>' +
                    '<th>Nombre del Producto</th>' +
                    '<th>Plan de Mantenimiento</th>' +
                    '<th>Cliente</th>' +
                    '<th>Responsable</th>' +
                    '<th>Última OS</th>' +
                    '<th>Fecha Último Mantenimiento</th>' +
                    '<th>Próximo Mantenimiento</th>' +
                    '<th>Días Restantes</th>' +
                    '<th>Estado</th>' +

                '</tr>';


    datosExportar.forEach(

        function (d) {


            var claseEstado =
                "estado-gris";


            if (
                d.semaforo_final === "VIGENTE"
            ) {

                claseEstado =
                    "estado-verde";

            }

            else if (
                d.semaforo_final === "PRÓXIMO A VENCER"
            ) {

                claseEstado =
                    "estado-amarillo";

            }

            else if (
                d.semaforo_final === "VENCIDO"
            ) {

                claseEstado =
                    "estado-rojo";

            }


            html +=

                '<tr>' +

                    '<td>' +
                        escapar_html(
                            d.hoja_de_vida || ""
                        ) +
                    '</td>' +

                    '<td>' +
                        escapar_html(
                            d.item_code || ""
                        ) +
                    '</td>' +

                    '<td>' +
                        escapar_html(
                            d.item_name || ""
                        ) +
                    '</td>' +

                    '<td>' +
                        escapar_html(
                            d.plan_mantenimiento || ""
                        ) +
                    '</td>' +

                    '<td>' +
                        escapar_html(
                            d.customer_name
                            ||
                            d.customer
                            ||
                            ""
                        ) +
                    '</td>' +

                    '<td>' +
                        escapar_html(
                            d.responsable || ""
                        ) +
                    '</td>' +

                    '<td>' +
                        escapar_html(
                            d.ultima_os || ""
                        ) +
                    '</td>' +

                    '<td>' +
                        formatear_fecha_visual(
                            d.fecha_ultimo_mantenimiento
                        ) +
                    '</td>' +

                    '<td>' +
                        formatear_fecha_visual(
                            d.fecha_proximo_mantenimiento
                        ) +
                    '</td>' +

                    '<td>' +

                        (
                            d.dias_restantes !== null
                            &&
                            d.dias_restantes !== undefined

                                ? escapar_html(
                                    d.dias_restantes
                                )

                                : ""
                        ) +

                    '</td>' +

                    '<td class="' +
                        claseEstado +
                    '">' +

                        escapar_html(
                            d.semaforo_final || ""
                        ) +

                    '</td>' +

                '</tr>';

        }

    );


    html +=

            '</table>' +

        '</body>' +

        '</html>';


    var blob =
        new Blob(

            [
                "\ufeff",
                html
            ],

            {
                type:
                    "application/vnd.ms-excel;charset=utf-8;"
            }

        );


    var url =
        URL.createObjectURL(
            blob
        );


    var enlace =
        document.createElement(
            "a"
        );


    enlace.href =
        url;


    enlace.download =
        "Calendario_Mantenimiento_"
        +
        limpiar_nombre_archivo(
            obtener_titulo_vista()
        )
        +
        ".xls";


    document.body.appendChild(
        enlace
    );


    enlace.click();


    document.body.removeChild(
        enlace
    );


    setTimeout(

        function () {

            URL.revokeObjectURL(
                url
            );

        },

        1000

    );

}


// ============================================================
// LIMPIAR NOMBRE ARCHIVO
// ============================================================

function limpiar_nombre_archivo(
    texto
) {


    return String(
        texto || ""
    )

        .replace(
            /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g,
            "_"
        )

        .replace(
            /_+/g,
            "_"
        );

}


// ============================================================
// MES -> NÚMERO
// ============================================================

function obtener_numero_mes_filtro() {


    var valor =
        frappe.query_report
            .get_filter_value(
                "mes"
            );


    if (!valor) {
        return 0;
    }


    var meses = {

        "Enero": 1,
        "Febrero": 2,
        "Marzo": 3,
        "Abril": 4,
        "Mayo": 5,
        "Junio": 6,
        "Julio": 7,
        "Agosto": 8,
        "Septiembre": 9,
        "Octubre": 10,
        "Noviembre": 11,
        "Diciembre": 12

    };


    return meses[valor] || 0;

}


// ============================================================
// FECHA SEGURA
// ============================================================

function crear_fecha_segura(
    anio,
    mes,
    dia
) {


    var ultimoDia =
        new Date(
            anio,
            mes,
            0
        ).getDate();


    if (dia > ultimoDia) {
        dia = ultimoDia;
    }


    if (dia < 1) {
        dia = 1;
    }


    return new Date(
        anio,
        mes - 1,
        dia
    );

}


// ============================================================
// RENDER PRINCIPAL
// ============================================================

function render_calendario_mantenimiento() {


    if (!frappe.query_report) {
        return;
    }


    var report =
        frappe.query_report;


    var datos =
        report.data || [];


    var page =
        report.page.main;


    if (!cm_fecha_actual) {

        cm_fecha_actual =
            new Date();

    }


    page
        .find(
            "#calendario-mantenimiento-container"
        )
        .remove();


    page
        .find(".datatable")
        .hide();


    page
        .find(".report-summary")
        .hide();


    // ========================================================
    // COMPAÑÍA
    // ========================================================

    var companyLogo = "";

    var companyName = "";


    for (
        var i = 0;
        i < datos.length;
        i++
    ) {


        if (
            !companyLogo
            &&
            datos[i].company_logo
        ) {

            companyLogo =
                datos[i].company_logo;

        }


        if (
            !companyName
            &&
            datos[i].company
        ) {

            companyName =
                datos[i].company;

        }


        if (
            companyLogo
            &&
            companyName
        ) {

            break;

        }

    }


    var logoHtml = "";


    if (companyLogo) {

        logoHtml =

            '<div class="cm-hero-logo-box">' +

                '<img ' +

                    'src="' +
                    escapar_html(
                        companyLogo
                    ) +
                    '" ' +

                    'class="cm-hero-logo">' +

            '</div>';

    }


    var datosVista =
        obtener_datos_vista(
            datos
        );


    var kpis =
        calcular_kpis(
            datosVista
        );


    var titulo =
        obtener_titulo_vista();


    var html =

        '<div ' +
            'id="calendario-mantenimiento-container" ' +
            'class="cm-container">' +


            // =================================================
            // BANNER
            // =================================================

            '<div class="cm-hero">' +

                '<div class="cm-hero-accent"></div>' +

                '<div class="cm-hero-content">' +

                    logoHtml +

                    '<div class="cm-hero-title-area">' +

                        '<div class="cm-hero-title">' +
                            'Calendario' +
                        '</div>' +

                        '<div class="cm-hero-title">' +
                            'Mantenimiento Preventivo' +
                        '</div>' +

                    '</div>' +

                    '<div class="cm-hero-separator"></div>' +

                    '<div class="cm-hero-message">' +

                        '<div>OPERACIÓN CONFIABLE</div>' +
                        '<div>EQUIPOS DISPONIBLES</div>' +
                        '<div>RESULTADOS SOSTENIBLES</div>' +

                    '</div>' +

                '</div>' +


                '<div class="cm-hero-right">' +

                    '<div class="cm-hero-right-small">' +
                        'EL MANTENIMIENTO' +
                    '</div>' +

                    '<div class="cm-hero-right-big">' +
                        'HOY, LA CONTINUIDAD' +
                    '</div>' +

                    '<div class="cm-hero-right-big">' +
                        'MAÑANA' +
                    '</div>' +

                '</div>' +

            '</div>' +


            // =================================================
            // TOOLBAR
            // =================================================

            '<div class="cm-calendar-toolbar">' +

                '<div class="cm-period-area">' +

                    '<div class="cm-period-icon">' +
                        '▣' +
                    '</div>' +

                    '<div>' +

                        '<div class="cm-period-title">' +

                            escapar_html(
                                titulo
                            ) +

                        '</div>' +

                        '<div class="cm-period-subtitle">' +

                            'Calendario de próximos mantenimientos' +

                        '</div>' +

                    '</div>' +

                '</div>' +


                '<div class="cm-toolbar-actions">' +

                    '<div class="cm-nav">' +

                        '<button ' +
                            'type="button" ' +
                            'class="cm-btn cm-prev">' +
                            '←' +
                        '</button>' +

                        '<button ' +
                            'type="button" ' +
                            'class="cm-btn cm-next">' +
                            '→' +
                        '</button>' +

                    '</div>' +


                    '<div class="cm-view">' +

                        crear_boton_vista(
                            "anio",
                            "Año"
                        ) +

                        crear_boton_vista(
                            "mes",
                            "Mes"
                        ) +

                        crear_boton_vista(
                            "semana",
                            "Semana"
                        ) +

                        crear_boton_vista(
                            "dia",
                            "Día"
                        ) +

                    '</div>' +

                '</div>' +

            '</div>' +


            // =================================================
            // KPIs
            // =================================================

            '<div class="cm-kpis">' +

                crear_kpi(
                    "▤",
                    kpis.total,
                    "Total mantenimientos",
                    "azul"
                ) +

                crear_kpi(
                    "✓",
                    kpis.vigentes,
                    "Vigentes",
                    "verde"
                ) +

                crear_kpi(
                    "◷",
                    kpis.proximos,
                    "Próximos a vencer",
                    "amarillo"
                ) +

                crear_kpi(
                    "!",
                    kpis.vencidos,
                    "Vencidos",
                    "rojo"
                ) +

                crear_kpi(
                    "?",
                    kpis.sin_info,
                    "Sin información",
                    "gris"
                ) +

            '</div>' +


            // =================================================
            // LEYENDA
            // =================================================

            '<div class="cm-legend">' +

                '<span class="cm-legend-title">' +
                    'Semáforo:' +
                '</span>' +

                '<span class="cm-legend-item">' +
                    '<i class="cm-dot cm-dot-green"></i>' +
                    'Vigente' +
                '</span>' +

                '<span class="cm-legend-item">' +
                    '<i class="cm-dot cm-dot-yellow"></i>' +
                    'Próximo a vencer' +
                '</span>' +

                '<span class="cm-legend-item">' +
                    '<i class="cm-dot cm-dot-red"></i>' +
                    'Vencido' +
                '</span>' +

                '<span class="cm-legend-item">' +
                    '<i class="cm-dot cm-dot-gray"></i>' +
                    'Sin información' +
                '</span>' +

            '</div>' +


            '<div id="cm-calendar-content">' +
            '</div>' +


            // =================================================
            // FOOTER
            // =================================================

            '<div class="cm-footer">' +

                '<div>' +

                    '<strong>' +
                        'MANTENIMIENTO PREVENTIVO' +
                    '</strong>' +

                    '<span class="cm-footer-separator">' +
                        '|' +
                    '</span>' +

                    '<span>' +
                        'EQUIPOS QUE IMPULSAN EL FUTURO' +
                    '</span>' +

                '</div>' +

                '<div class="cm-footer-right">' +

                    'EFICIENCIA &nbsp; • &nbsp; SEGURIDAD &nbsp; • &nbsp; DISPONIBILIDAD' +

                '</div>' +

            '</div>' +

        '</div>';


    var reportWrapper =
        page
            .find(".report-wrapper")
            .first();


    if (reportWrapper.length) {

        reportWrapper.before(
            html
        );

    }

    else {

        page.append(
            html
        );

    }


    insertar_estilos_calendario();


    // ========================================================
    // RENDER SEGÚN VISTA
    // ========================================================

    if (
        cm_vista_actual === "anio"
    ) {

        render_vista_anio(
            datos
        );

    }

    else if (
        cm_vista_actual === "mes"
    ) {

        render_vista_mes(
            datos
        );

    }

    else if (
        cm_vista_actual === "semana"
    ) {

        render_vista_semana(
            datos
        );

    }

    else {

        render_vista_dia(
            datos
        );

    }


    // ========================================================
    // BOTONES VISTA
    // ========================================================

    page
        .find(".cm-view-btn")
        .off("click")
        .on(

            "click",

            function () {

                cm_vista_actual =
                    $(this).attr(
                        "data-view"
                    );


                if (
                    cm_vista_actual === "dia"
                ) {

                    report.set_filter_value(

                        "dia",

                        String(
                            cm_fecha_actual.getDate()
                        )

                    );

                }


                render_calendario_mantenimiento();

            }

        );


    // ========================================================
    // ANTERIOR
    // ========================================================

    page
        .find(".cm-prev")
        .off("click")
        .on(

            "click",

            function () {

                mover_periodo(
                    -1
                );

            }

        );


    // ========================================================
    // SIGUIENTE
    // ========================================================

    page
        .find(".cm-next")
        .off("click")
        .on(

            "click",

            function () {

                mover_periodo(
                    1
                );

            }

        );


    // ========================================================
    // CLIC EN DÍA DE VISTA ANUAL
    // ========================================================

    page
        .find(".cm-year-day[data-date]")
        .off("click")
        .on(

            "click",

            function () {

                var valor =
                    $(this).attr(
                        "data-date"
                    );


                if (!valor) {
                    return;
                }


                var partes =
                    valor.split("-");


                cm_fecha_actual =
                    new Date(

                        Number(partes[0]),

                        Number(partes[1]) - 1,

                        Number(partes[2])

                    );


                cm_vista_actual =
                    "dia";


                report.set_filter_value(
                    "anio",
                    cm_fecha_actual.getFullYear()
                );


                report.set_filter_value(
                    "mes",
                    nombre_mes_completo(
                        cm_fecha_actual
                    )
                );


                report.set_filter_value(
                    "dia",
                    String(
                        cm_fecha_actual.getDate()
                    )
                );


                render_calendario_mantenimiento();

            }

        );

}


// ============================================================
// BOTÓN VISTA
// ============================================================

function crear_boton_vista(
    vista,
    texto
) {


    var clase =
        "cm-view-btn";


    if (
        cm_vista_actual === vista
    ) {

        clase +=
            " cm-view-active";

    }


    return (

        '<button ' +

            'type="button" ' +

            'class="' +
            clase +
            '" ' +

            'data-view="' +
            vista +
            '">' +

            texto +

        '</button>'

    );

}


// ============================================================
// DATOS VISTA
// ============================================================

function obtener_datos_vista(
    datos
) {


    // ========================================================
    // AÑO
    // ========================================================

    if (
        cm_vista_actual === "anio"
    ) {

        return datos.filter(

            function (d) {

                var f =
                    obtener_fecha(
                        d.fecha_proximo_mantenimiento
                    );


                if (!f) {
                    return false;
                }


                return (

                    f.getFullYear()
                    ===
                    cm_fecha_actual.getFullYear()

                );

            }

        );

    }


    // ========================================================
    // MES
    // ========================================================

    if (
        cm_vista_actual === "mes"
    ) {

        return datos.filter(

            function (d) {

                var f =
                    obtener_fecha(
                        d.fecha_proximo_mantenimiento
                    );


                if (!f) {
                    return false;
                }


                return (

                    f.getFullYear()
                    ===
                    cm_fecha_actual.getFullYear()

                    &&

                    f.getMonth()
                    ===
                    cm_fecha_actual.getMonth()

                );

            }

        );

    }


    // ========================================================
    // SEMANA
    // ========================================================

    if (
        cm_vista_actual === "semana"
    ) {

        var inicio =
            inicio_semana(
                cm_fecha_actual
            );


        var fin =
            sumar_dias(
                inicio,
                6
            );


        return datos.filter(

            function (d) {

                var f =
                    obtener_fecha(
                        d.fecha_proximo_mantenimiento
                    );


                if (!f) {
                    return false;
                }


                return (
                    f >= inicio
                    &&
                    f <= fin
                );

            }

        );

    }


    // ========================================================
    // DÍA
    // ========================================================

    var key =
        fecha_key(
            cm_fecha_actual
        );


    return datos.filter(

        function (d) {

            return (

                normalizar_fecha(
                    d.fecha_proximo_mantenimiento
                )
                ===
                key

            );

        }

    );

}


// ============================================================
// KPIs
// ============================================================

function calcular_kpis(
    datos
) {


    var resultado = {

        total: datos.length,
        vigentes: 0,
        proximos: 0,
        vencidos: 0,
        sin_info: 0

    };


    datos.forEach(

        function (d) {

            if (
                d.semaforo_final === "VIGENTE"
            ) {

                resultado.vigentes++;

            }

            else if (
                d.semaforo_final === "PRÓXIMO A VENCER"
            ) {

                resultado.proximos++;

            }

            else if (
                d.semaforo_final === "VENCIDO"
            ) {

                resultado.vencidos++;

            }

            else {

                resultado.sin_info++;

            }

        }

    );


    return resultado;

}


// ============================================================
// TÍTULO
// ============================================================

function obtener_titulo_vista() {


    var meses = [

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"

    ];


    if (
        cm_vista_actual === "anio"
    ) {

        return (

            "Año "

            +

            cm_fecha_actual.getFullYear()

        );

    }


    if (
        cm_vista_actual === "mes"
    ) {

        return (

            meses[
                cm_fecha_actual.getMonth()
            ]

            +

            " "

            +

            cm_fecha_actual.getFullYear()

        );

    }


    if (
        cm_vista_actual === "semana"
    ) {

        var inicio =
            inicio_semana(
                cm_fecha_actual
            );


        var fin =
            sumar_dias(
                inicio,
                6
            );


        return (

            "Semana "

            +

            inicio.getDate()

            +

            " "

            +

            meses[
                inicio.getMonth()
            ]

            +

            " - "

            +

            fin.getDate()

            +

            " "

            +

            meses[
                fin.getMonth()
            ]

        );

    }


    return (

        nombre_dia(
            cm_fecha_actual
        )

        +

        " "

        +

        cm_fecha_actual.getDate()

        +

        " de "

        +

        meses[
            cm_fecha_actual.getMonth()
        ]

        +

        " "

        +

        cm_fecha_actual.getFullYear()

    );

}


// ============================================================
// VISTA AÑO
// ============================================================

function render_vista_anio(
    datos
) {


    var contenido =
        $("#cm-calendar-content");


    var anio =
        cm_fecha_actual.getFullYear();


    var html =
        '<div class="cm-year-grid">';


    for (
        var mes = 0;
        mes < 12;
        mes++
    ) {


        var fechaMes =
            new Date(
                anio,
                mes,
                1
            );


        var ultimoDia =
            new Date(
                anio,
                mes + 1,
                0
            );


        var primerDiaSemana =
            fechaMes.getDay();


        var espacios =
            primerDiaSemana === 0
                ? 6
                : primerDiaSemana - 1;


        var datosMes =
            datos.filter(

                function (d) {

                    var f =
                        obtener_fecha(
                            d.fecha_proximo_mantenimiento
                        );


                    if (!f) {
                        return false;
                    }


                    return (

                        f.getFullYear()
                        ===
                        anio

                        &&

                        f.getMonth()
                        ===
                        mes

                    );

                }

            );


        html +=

            '<div class="cm-year-month">' +

                '<div class="cm-year-month-header">' +

                    '<span>' +

                        nombre_mes_completo(
                            fechaMes
                        ) +

                    '</span>' +

                    '<span class="cm-year-count">' +

                        datosMes.length +

                        (
                            datosMes.length === 1
                                ? ' mantenimiento'
                                : ' mantenimientos'
                        ) +

                    '</span>' +

                '</div>' +


                '<div class="cm-year-weekdays">' +

                    '<span>L</span>' +
                    '<span>M</span>' +
                    '<span>X</span>' +
                    '<span>J</span>' +
                    '<span>V</span>' +
                    '<span>S</span>' +
                    '<span>D</span>' +

                '</div>' +


                '<div class="cm-year-days">';


        for (
            var vacio = 0;
            vacio < espacios;
            vacio++
        ) {

            html +=

                '<div class="cm-year-day cm-year-empty"></div>';

        }


        for (
            var dia = 1;
            dia <= ultimoDia.getDate();
            dia++
        ) {


            var fecha =
                new Date(
                    anio,
                    mes,
                    dia
                );


            var key =
                fecha_key(
                    fecha
                );


            var eventos =
                eventos_fecha(
                    datos,
                    key
                );


            var indicadores =
                "";


            var maxIndicadores =
                3;


            for (
                var e = 0;
                e < eventos.length
                && e < maxIndicadores;
                e++
            ) {


                var claseDot =
                    "cm-year-dot-green";


                if (
                    eventos[e].semaforo_final
                    ===
                    "PRÓXIMO A VENCER"
                ) {

                    claseDot =
                        "cm-year-dot-yellow";

                }

                else if (
                    eventos[e].semaforo_final
                    ===
                    "VENCIDO"
                ) {

                    claseDot =
                        "cm-year-dot-red";

                }

                else if (
                    eventos[e].semaforo_final
                    ===
                    "SIN INFORMACIÓN"
                ) {

                    claseDot =
                        "cm-year-dot-gray";

                }


                indicadores +=

                    '<i class="cm-year-dot ' +

                        claseDot +

                    '"></i>';

            }


            if (
                eventos.length > maxIndicadores
            ) {

                indicadores +=

                    '<span class="cm-year-more">' +

                        '+' +

                        (
                            eventos.length
                            -
                            maxIndicadores
                        ) +

                    '</span>';

            }


            var claseEvento =
                "";


            if (
                eventos.length > 0
            ) {

                claseEvento =
                    " cm-year-has-event";

            }


            html +=

                '<div ' +

                    'class="cm-year-day' +
                    claseEvento +
                    '" ' +

                    'data-date="' +
                    key +
                    '">' +

                    '<span class="cm-year-day-number">' +

                        dia +

                    '</span>' +

                    '<div class="cm-year-indicators">' +

                        indicadores +

                    '</div>' +

                '</div>';

        }


        var total =
            espacios
            +
            ultimoDia.getDate();


        var resto =
            total % 7;


        if (
            resto !== 0
        ) {


            var faltan =
                7 - resto;


            for (
                var z = 0;
                z < faltan;
                z++
            ) {

                html +=

                    '<div class="cm-year-day cm-year-empty"></div>';

            }

        }


        html +=

                '</div>' +

            '</div>';

    }


    html +=
        '</div>';


    contenido.html(
        html
    );

}


// ============================================================
// VISTA MES
// ============================================================

function render_vista_mes(
    datos
) {


    var contenido =
        $("#cm-calendar-content");


    contenido.html(

        '<div class="cm-calendar">' +

            '<div class="cm-weekdays">' +

                '<div>Lunes</div>' +
                '<div>Martes</div>' +
                '<div>Miércoles</div>' +
                '<div>Jueves</div>' +
                '<div>Viernes</div>' +
                '<div>Sábado</div>' +
                '<div>Domingo</div>' +

            '</div>' +

            '<div id="cm-days" class="cm-days"></div>' +

        '</div>'

    );


    var container =
        $("#cm-days");


    var anio =
        cm_fecha_actual.getFullYear();


    var mes =
        cm_fecha_actual.getMonth();


    var primerDia =
        new Date(
            anio,
            mes,
            1
        );


    var ultimoDia =
        new Date(
            anio,
            mes + 1,
            0
        );


    var diaSemana =
        primerDia.getDay();


    var espacios =
        diaSemana === 0
            ? 6
            : diaSemana - 1;


    for (
        var e = 0;
        e < espacios;
        e++
    ) {

        container.append(

            '<div class="cm-day cm-empty"></div>'

        );

    }


    var hoyKey =
        fecha_key(
            new Date()
        );


    for (
        var dia = 1;
        dia <= ultimoDia.getDate();
        dia++
    ) {


        var fecha =
            new Date(
                anio,
                mes,
                dia
            );


        var key =
            fecha_key(
                fecha
            );


        var eventos =
            eventos_fecha(
                datos,
                key
            );


        var eventosHtml =
            "";


        eventos.forEach(

            function (evento) {

                eventosHtml +=
                    crear_tarjeta_evento(
                        evento,
                        "mes"
                    );

            }

        );


        var claseHoy =
            "";


        var hoyHtml =
            "";


        if (
            key === hoyKey
        ) {

            claseHoy =
                " cm-today";


            hoyHtml =

                '<span class="cm-today-label">' +
                    'Hoy' +
                '</span>';

        }


        container.append(

            '<div class="cm-day' +
                claseHoy +
                '">' +

                '<div class="cm-day-header">' +

                    '<span class="cm-day-number">' +
                        dia +
                    '</span>' +

                    hoyHtml +

                '</div>' +

                '<div class="cm-events">' +

                    eventosHtml +

                '</div>' +

            '</div>'

        );

    }


    var totalCeldas =
        espacios
        +
        ultimoDia.getDate();


    var sobrantes =
        totalCeldas % 7;


    if (
        sobrantes !== 0
    ) {


        var faltantes =
            7 - sobrantes;


        for (
            var x = 0;
            x < faltantes;
            x++
        ) {

            container.append(

                '<div class="cm-day cm-empty"></div>'

            );

        }

    }

}


// ============================================================
// VISTA SEMANA
// ============================================================

function render_vista_semana(
    datos
) {


    var contenido =
        $("#cm-calendar-content");


    var inicio =
        inicio_semana(
            cm_fecha_actual
        );


    var headers =
        "";

    var columnas =
        "";


    for (
        var i = 0;
        i < 7;
        i++
    ) {


        var fecha =
            sumar_dias(
                inicio,
                i
            );


        var key =
            fecha_key(
                fecha
            );


        var eventos =
            eventos_fecha(
                datos,
                key
            );


        var tarjetas =
            "";


        eventos.forEach(

            function (evento) {

                tarjetas +=
                    crear_tarjeta_evento(
                        evento,
                        "semana"
                    );

            }

        );


        headers +=

            '<div class="cm-week-header-cell">' +

                '<div class="cm-week-name">' +
                    nombre_dia_corto(
                        fecha
                    ) +
                '</div>' +

                '<div class="cm-week-number">' +
                    fecha.getDate() +
                '</div>' +

                '<div class="cm-week-month">' +
                    nombre_mes_corto(
                        fecha
                    ) +
                '</div>' +

            '</div>';


        if (!tarjetas) {

            tarjetas =

                '<div class="cm-no-events">' +
                    'Sin mantenimientos' +
                '</div>';

        }


        columnas +=

            '<div class="cm-week-column">' +

                tarjetas +

            '</div>';

    }


    contenido.html(

        '<div class="cm-week-calendar">' +

            '<div class="cm-week-header">' +
                headers +
            '</div>' +

            '<div class="cm-week-body">' +
                columnas +
            '</div>' +

        '</div>'

    );

}


// ============================================================
// VISTA DÍA
// ============================================================

function render_vista_dia(
    datos
) {


    var contenido =
        $("#cm-calendar-content");


    var key =
        fecha_key(
            cm_fecha_actual
        );


    var eventos =
        eventos_fecha(
            datos,
            key
        );


    var tarjetas =
        "";


    eventos.forEach(

        function (evento) {

            tarjetas +=
                crear_tarjeta_evento(
                    evento,
                    "dia"
                );

        }

    );


    if (!tarjetas) {

        tarjetas =

            '<div class="cm-empty-day">' +

                '<div class="cm-empty-icon">' +
                    '📅' +
                '</div>' +

                '<div class="cm-empty-title">' +
                    'Sin mantenimientos programados' +
                '</div>' +

                '<div class="cm-empty-text">' +
                    'No existen próximos mantenimientos para esta fecha.' +
                '</div>' +

            '</div>';

    }


    contenido.html(

        '<div class="cm-daily">' +

            '<div class="cm-daily-header">' +

                '<div class="cm-daily-number">' +

                    cm_fecha_actual.getDate() +

                '</div>' +

                '<div>' +

                    '<div class="cm-daily-day">' +

                        nombre_dia(
                            cm_fecha_actual
                        ) +

                    '</div>' +

                    '<div class="cm-daily-date">' +

                        nombre_mes_completo(
                            cm_fecha_actual
                        )

                        +

                        ' '

                        +

                        cm_fecha_actual.getFullYear() +

                    '</div>' +

                '</div>' +

                '<div class="cm-daily-count">' +

                    eventos.length +

                    (
                        eventos.length === 1
                            ? ' mantenimiento'
                            : ' mantenimientos'
                    ) +

                '</div>' +

            '</div>' +

            '<div class="cm-daily-events">' +

                tarjetas +

            '</div>' +

        '</div>'

    );

}


// ============================================================
// EVENTOS
// ============================================================

function eventos_fecha(
    datos,
    key
) {


    return datos.filter(

        function (d) {

            return (

                normalizar_fecha(
                    d.fecha_proximo_mantenimiento
                )
                ===
                key

            );

        }

    );

}


// ============================================================
// TARJETA
// ============================================================

function crear_tarjeta_evento(
    d,
    vista
) {


    var claseEstado =
        "vigente";


    var textoEstado =
        "Vigente";


    var dotClass =
        "cm-card-dot-green";


    if (
        d.semaforo_final
        ===
        "PRÓXIMO A VENCER"
    ) {

        claseEstado =
            "proximo";

        textoEstado =
            "Próximo a vencer";

        dotClass =
            "cm-card-dot-yellow";

    }


    else if (
        d.semaforo_final
        ===
        "VENCIDO"
    ) {

        claseEstado =
            "vencido";

        textoEstado =
            "Vencido";

        dotClass =
            "cm-card-dot-red";

    }


    else if (
        d.semaforo_final
        ===
        "SIN INFORMACIÓN"
    ) {

        claseEstado =
            "sin-info";

        textoEstado =
            "Sin información";

        dotClass =
            "cm-card-dot-gray";

    }


    var hoja =
        escapar_html(
            d.hoja_de_vida || ""
        );


    var item =
        escapar_html(
            d.item_code || ""
        );


    var descripcion =
        escapar_html(
            d.item_name || ""
        );


    var plan =
        escapar_html(
            d.plan_mantenimiento
            ||
            "Sin plan"
        );


    var cliente =
        escapar_html(
            d.customer_name
            ||
            d.customer
            ||
            ""
        );


    var fechaProxima =
        formatear_fecha_visual(
            d.fecha_proximo_mantenimiento
        );


    var nombreCodigoHtml =
        "";


    if (descripcion) {

        nombreCodigoHtml =

            '<div class="cm-card-product">' +

                descripcion +

            '</div>';

    }


    var diasHtml =
        "";


    if (
        d.dias_restantes !== null
        &&
        d.dias_restantes !== undefined
    ) {


        var dias =
            Number(
                d.dias_restantes
            );


        if (
            dias < 0
        ) {

            var diasVencidos =
                Math.abs(
                    dias
                );


            diasHtml =

                '<span class="cm-card-days">' +

                    'Vencido hace ' +

                    '<strong>' +

                        diasVencidos +

                        (
                            diasVencidos === 1
                                ? ' día'
                                : ' días'
                        ) +

                    '</strong>' +

                '</span>';

        }


        else if (
            dias === 0
        ) {

            diasHtml =

                '<span class="cm-card-days">' +
                    'Vence hoy' +
                '</span>';

        }


        else {

            diasHtml =

                '<span class="cm-card-days">' +

                    'Faltan ' +

                    '<strong>' +

                        dias +

                        (
                            dias === 1
                                ? ' día'
                                : ' días'
                        ) +

                    '</strong>' +

                '</span>';

        }

    }


    var clienteHtml =
        "";


    if (
        vista !== "mes"
        &&
        cliente
    ) {

        clienteHtml =

            '<div class="cm-card-client">' +

                'Cliente: ' +

                cliente +

            '</div>';

    }


    return (

        '<div class="' +

            'cm-event ' +

            'cm-event-' +

            claseEstado +

            ' cm-event-' +

            vista +

        '">' +


            '<div class="cm-card-main">' +

                '<span class="cm-card-dot ' +

                    dotClass +

                '"></span>' +


                '<div class="cm-card-info">' +

                    '<div class="cm-card-hv">' +

                        hoja +

                    '</div>' +

                    '<div class="cm-card-item">' +

                        item +

                    '</div>' +

                    nombreCodigoHtml +

                    '<div class="cm-card-plan">' +

                        plan +

                    '</div>' +

                '</div>' +

            '</div>' +


            clienteHtml +


            '<div class="cm-card-bottom">' +

                '<div>' +

                    '<span class="cm-card-date-label">' +
                        'Próximo: ' +
                    '</span>' +

                    '<strong>' +

                        fechaProxima +

                    '</strong>' +

                '</div>' +

                diasHtml +

            '</div>' +


            '<div class="cm-card-status">' +

                textoEstado +

            '</div>' +


            // =================================================
            // SOLO HOJA DE VIDA
            // =================================================

            '<div class="cm-card-links">' +

                '<a ' +

                    'href="#" ' +

                    'class="cm-open-hv" ' +

                    'data-name="' +

                    escapar_html(
                        d.hoja_de_vida || ""
                    )

                    +

                    '">' +

                    'Hoja de Vida' +

                '</a>' +

            '</div>' +


        '</div>'

    );

}


// ============================================================
// MOVER PERÍODO
// ============================================================

function mover_periodo(
    direccion
) {


    // ========================================================
    // AÑO
    // ========================================================

    if (
        cm_vista_actual === "anio"
    ) {

        cm_fecha_actual =
            new Date(

                cm_fecha_actual.getFullYear()
                +
                direccion,

                0,

                1

            );


        frappe.query_report
            .set_filter_value(
                "dia",
                ""
            );

    }


    // ========================================================
    // MES
    // ========================================================

    else if (
        cm_vista_actual === "mes"
    ) {

        cm_fecha_actual =
            new Date(

                cm_fecha_actual.getFullYear(),

                cm_fecha_actual.getMonth()
                +
                direccion,

                1

            );


        frappe.query_report
            .set_filter_value(
                "dia",
                ""
            );

    }


    // ========================================================
    // SEMANA
    // ========================================================

    else if (
        cm_vista_actual === "semana"
    ) {

        cm_fecha_actual =
            sumar_dias(

                cm_fecha_actual,

                direccion * 7

            );


        frappe.query_report
            .set_filter_value(
                "dia",
                ""
            );

    }


    // ========================================================
    // DÍA
    // ========================================================

    else {

        cm_fecha_actual =
            sumar_dias(

                cm_fecha_actual,

                direccion

            );


        frappe.query_report
            .set_filter_value(

                "dia",

                String(
                    cm_fecha_actual.getDate()
                )

            );

    }


    frappe.query_report
        .set_filter_value(

            "anio",

            cm_fecha_actual.getFullYear()

        );


    var filtroMes =
        frappe.query_report
            .get_filter_value(
                "mes"
            );


    if (
        filtroMes
        &&
        cm_vista_actual !== "anio"
    ) {

        frappe.query_report
            .set_filter_value(

                "mes",

                nombre_mes_completo(
                    cm_fecha_actual
                )

            );

    }


    render_calendario_mantenimiento();

}


// ============================================================
// KPI
// ============================================================

function crear_kpi(
    icono,
    valor,
    titulo,
    clase
) {


    return (

        '<div class="cm-kpi cm-' +
            clase +
        '">' +

            '<div class="cm-kpi-icon">' +

                icono +

            '</div>' +

            '<div class="cm-kpi-content">' +

                '<div class="cm-kpi-number">' +

                    valor +

                '</div>' +

                '<div class="cm-kpi-label">' +

                    titulo +

                '</div>' +

            '</div>' +

        '</div>'

    );

}


// ============================================================
// FECHAS
// ============================================================

function inicio_semana(
    fecha
) {


    var resultado =
        new Date(

            fecha.getFullYear(),

            fecha.getMonth(),

            fecha.getDate()

        );


    var dia =
        resultado.getDay();


    var diferencia =
        dia === 0
            ? -6
            : 1 - dia;


    resultado.setDate(

        resultado.getDate()
        +
        diferencia

    );


    return resultado;

}


function sumar_dias(
    fecha,
    dias
) {


    var resultado =
        new Date(

            fecha.getFullYear(),

            fecha.getMonth(),

            fecha.getDate()

        );


    resultado.setDate(

        resultado.getDate()
        +
        dias

    );


    return resultado;

}


function obtener_fecha(
    valor
) {


    var normal =
        normalizar_fecha(
            valor
        );


    if (!normal) {
        return null;
    }


    var partes =
        normal.split("-");


    return new Date(

        Number(
            partes[0]
        ),

        Number(
            partes[1]
        ) - 1,

        Number(
            partes[2]
        )

    );

}


function fecha_key(
    fecha
) {


    return (

        fecha.getFullYear()

        +

        "-"

        +

        String(
            fecha.getMonth() + 1
        ).padStart(
            2,
            "0"
        )

        +

        "-"

        +

        String(
            fecha.getDate()
        ).padStart(
            2,
            "0"
        )

    );

}


function normalizar_fecha(
    valor
) {


    if (!valor) {
        return "";
    }


    if (
        typeof valor
        ===
        "string"
    ) {

        if (
            /^\d{4}-\d{2}-\d{2}/
                .test(
                    valor
                )
        ) {

            return valor.substring(
                0,
                10
            );

        }

    }


    var fecha =
        new Date(
            valor
        );


    if (
        isNaN(
            fecha.getTime()
        )
    ) {

        return "";

    }


    return fecha_key(
        fecha
    );

}


function formatear_fecha_visual(
    valor
) {


    var fecha =
        normalizar_fecha(
            valor
        );


    if (!fecha) {
        return "";
    }


    var partes =
        fecha.split("-");


    return (

        partes[2]

        +

        "/"

        +

        partes[1]

        +

        "/"

        +

        partes[0]

    );

}


// ============================================================
// DÍAS
// ============================================================

function nombre_dia(
    fecha
) {


    var dias = [

        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"

    ];


    return dias[
        fecha.getDay()
    ];

}


function nombre_dia_corto(
    fecha
) {


    var dias = [

        "Dom",
        "Lun",
        "Mar",
        "Mié",
        "Jue",
        "Vie",
        "Sáb"

    ];


    return dias[
        fecha.getDay()
    ];

}


// ============================================================
// MESES
// ============================================================

function nombre_mes_completo(
    fecha
) {


    var meses = [

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"

    ];


    return meses[
        fecha.getMonth()
    ];

}


function nombre_mes_corto(
    fecha
) {


    var meses = [

        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic"

    ];


    return meses[
        fecha.getMonth()
    ];

}


// ============================================================
// HTML
// ============================================================

function escapar_html(
    texto
) {


    if (
        texto === null
        ||
        texto === undefined
    ) {

        return "";

    }


    return String(
        texto
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// LINK HOJA DE VIDA
// ============================================================

$(document)

    .off(
        "click.cm_hv",
        ".cm-open-hv"
    )

    .on(

        "click.cm_hv",

        ".cm-open-hv",

        function (e) {


            e.preventDefault();


            var name =
                $(this).attr(
                    "data-name"
                );


            if (name) {

                frappe.set_route(

                    "Form",

                    "Hoja de Vida del Bien",

                    name

                );

            }

        }

    );


// ============================================================
// CSS
// ============================================================

function insertar_estilos_calendario() {


    $("#cm-calendar-styles")
        .remove();


    $("head").append(

        '<style id="cm-calendar-styles">' +


        // ====================================================
        // CONTENEDOR
        // ====================================================

        '.cm-container{' +
            'background:#ffffff;' +
            'border-radius:14px;' +
            'overflow:hidden;' +
            'margin-top:12px;' +
            'margin-bottom:24px;' +
            'box-shadow:0 4px 18px rgba(11,55,103,.10);' +
            'border:1px solid #e4eaf0;' +
            'box-sizing:border-box;' +
        '}' +


        // ====================================================
        // FULLSCREEN
        // ====================================================

        '#calendario-mantenimiento-container:fullscreen{' +
            'width:100vw !important;' +
            'height:100vh !important;' +
            'margin:0 !important;' +
            'border:0 !important;' +
            'border-radius:0 !important;' +
            'overflow:auto !important;' +
            'background:#fff !important;' +
        '}' +


        '#calendario-mantenimiento-container:-webkit-full-screen{' +
            'width:100vw !important;' +
            'height:100vh !important;' +
            'margin:0 !important;' +
            'border:0 !important;' +
            'border-radius:0 !important;' +
            'overflow:auto !important;' +
            'background:#fff !important;' +
        '}' +


        // ====================================================
        // HERO
        // ====================================================

        '.cm-hero{' +
            'min-height:108px;' +
            'background:linear-gradient(110deg,#07376c 0%,#0b4f91 58%,#073b74 100%);' +
            'position:relative;' +
            'display:flex;' +
            'align-items:center;' +
            'justify-content:space-between;' +
            'padding:0 32px;' +
            'overflow:hidden;' +
            'color:white;' +
        '}' +


        '.cm-hero:after{' +
            'content:"";' +
            'position:absolute;' +
            'right:24%;' +
            'top:-70px;' +
            'width:110px;' +
            'height:250px;' +
            'background:#96cf20;' +
            'transform:rotate(28deg);' +
        '}' +


        '.cm-hero:before{' +
            'content:"";' +
            'position:absolute;' +
            'right:18%;' +
            'top:-80px;' +
            'width:48px;' +
            'height:270px;' +
            'background:#0871c9;' +
            'transform:rotate(28deg);' +
        '}' +


        '.cm-hero-accent{' +
            'position:absolute;' +
            'left:0;' +
            'top:0;' +
            'bottom:0;' +
            'width:18px;' +
            'background:#8dc63f;' +
        '}' +


        '.cm-hero-content{' +
            'display:flex;' +
            'align-items:center;' +
            'gap:22px;' +
            'position:relative;' +
            'z-index:2;' +
        '}' +


        '.cm-hero-logo-box{' +
            'width:74px;' +
            'height:74px;' +
            'border-radius:50%;' +
            'background:white;' +
            'display:flex;' +
            'align-items:center;' +
            'justify-content:center;' +
            'padding:10px;' +
            'box-shadow:0 4px 15px rgba(0,0,0,.15);' +
            'box-sizing:border-box;' +
        '}' +


        '.cm-hero-logo{' +
            'max-width:100%;' +
            'max-height:100%;' +
            'object-fit:contain;' +
        '}' +


        '.cm-hero-title-area{' +
            'min-width:280px;' +
        '}' +


        '.cm-hero-title{' +
            'font-size:28px;' +
            'font-weight:800;' +
            'line-height:1.05;' +
        '}' +


        '.cm-hero-separator{' +
            'height:60px;' +
            'width:1px;' +
            'background:rgba(255,255,255,.5);' +
        '}' +


        '.cm-hero-message{' +
            'font-size:12px;' +
            'line-height:1.45;' +
            'letter-spacing:1.4px;' +
            'font-weight:700;' +
        '}' +


        '.cm-hero-right{' +
            'position:relative;' +
            'z-index:2;' +
            'text-align:right;' +
        '}' +


        '.cm-hero-right-small{' +
            'font-size:10px;' +
            'color:#a9dc45;' +
            'letter-spacing:2px;' +
            'font-weight:800;' +
        '}' +


        '.cm-hero-right-big{' +
            'font-size:13px;' +
            'font-weight:800;' +
        '}' +


        // ====================================================
        // TOOLBAR
        // ====================================================

        '.cm-calendar-toolbar{' +
            'display:flex;' +
            'justify-content:space-between;' +
            'align-items:center;' +
            'padding:20px 22px 12px 22px;' +
            'gap:20px;' +
        '}' +


        '.cm-period-area{' +
            'display:flex;' +
            'align-items:center;' +
            'gap:13px;' +
        '}' +


        '.cm-period-icon{' +
            'font-size:30px;' +
            'color:#0b4c87;' +
            'font-weight:800;' +
        '}' +


        '.cm-period-title{' +
            'font-size:26px;' +
            'font-weight:800;' +
            'color:#0b3d73;' +
        '}' +


        '.cm-period-subtitle{' +
            'font-size:12px;' +
            'color:#536983;' +
            'margin-top:5px;' +
        '}' +


        '.cm-toolbar-actions{' +
            'display:flex;' +
            'align-items:center;' +
            'gap:12px;' +
        '}' +


        '.cm-nav{' +
            'display:flex;' +
            'gap:6px;' +
        '}' +


        '.cm-btn{' +
            'border:1px solid #0b4c87;' +
            'border-radius:7px;' +
            'background:#fff;' +
            'color:#0b4c87;' +
            'width:35px;' +
            'height:32px;' +
            'font-weight:800;' +
            'cursor:pointer;' +
        '}' +


        '.cm-view{' +
            'display:flex;' +
        '}' +


        '.cm-view-btn{' +
            'border:1px solid #0b4c87;' +
            'background:white;' +
            'color:#0b4c87;' +
            'padding:7px 13px;' +
            'font-size:11px;' +
            'font-weight:800;' +
            'cursor:pointer;' +
        '}' +


        '.cm-view-btn:first-child{' +
            'border-radius:7px 0 0 7px;' +
        '}' +


        '.cm-view-btn:last-child{' +
            'border-radius:0 7px 7px 0;' +
        '}' +


        '.cm-view-active{' +
            'background:#0b4c87;' +
            'color:white;' +
        '}' +


        // ====================================================
        // KPI
        // ====================================================

        '.cm-kpis{' +
            'display:grid;' +
            'grid-template-columns:repeat(5,minmax(0,1fr));' +
            'gap:10px;' +
            'padding:0 22px;' +
            'margin-bottom:10px;' +
        '}' +


        '.cm-kpi{' +
            'min-height:65px;' +
            'border-radius:10px;' +
            'padding:11px 14px;' +
            'display:flex;' +
            'align-items:center;' +
            'gap:12px;' +
            'box-sizing:border-box;' +
        '}' +


        '.cm-kpi-icon{' +
            'width:36px;' +
            'height:36px;' +
            'border-radius:50%;' +
            'background:rgba(255,255,255,.75);' +
            'display:flex;' +
            'align-items:center;' +
            'justify-content:center;' +
            'font-size:17px;' +
            'font-weight:900;' +
        '}' +


        '.cm-kpi-number{' +
            'font-size:21px;' +
            'font-weight:900;' +
        '}' +


        '.cm-kpi-label{' +
            'font-size:10px;' +
            'font-weight:700;' +
            'margin-top:5px;' +
        '}' +


        '.cm-azul{' +
            'background:#e8f3ff;' +
            'color:#145da0;' +
        '}' +


        '.cm-verde{' +
            'background:#e6f7ea;' +
            'color:#3a8d39;' +
        '}' +


        '.cm-amarillo{' +
            'background:#fff1c9;' +
            'color:#b47700;' +
        '}' +


        '.cm-rojo{' +
            'background:#fde2e2;' +
            'color:#c1332e;' +
        '}' +


        '.cm-gris{' +
            'background:#edf0f3;' +
            'color:#5e6d7d;' +
        '}' +


        // ====================================================
        // LEYENDA
        // ====================================================

        '.cm-legend{' +
            'display:flex;' +
            'justify-content:flex-end;' +
            'align-items:center;' +
            'gap:11px;' +
            'padding:0 24px 10px 24px;' +
            'font-size:10px;' +
            'color:#66778a;' +
        '}' +


        '.cm-legend-title{' +
            'font-weight:800;' +
        '}' +


        '.cm-legend-item{' +
            'display:flex;' +
            'align-items:center;' +
            'gap:4px;' +
        '}' +


        '.cm-dot{' +
            'width:8px;' +
            'height:8px;' +
            'border-radius:50%;' +
            'display:inline-block;' +
        '}' +


        '.cm-dot-green{background:#51a84f;}' +

        '.cm-dot-yellow{background:#f0b400;}' +

        '.cm-dot-red{background:#d64038;}' +

        '.cm-dot-gray{background:#8996a5;}' +


        // ====================================================
        // CONTENIDO
        // ====================================================

        '#cm-calendar-content{' +
            'padding:0 16px 12px 16px;' +
            'width:100%;' +
            'box-sizing:border-box;' +
        '}' +


        // ====================================================
        // VISTA AÑO
        // ====================================================

        '.cm-year-grid{' +
            'display:grid;' +
            'grid-template-columns:repeat(3,minmax(0,1fr));' +
            'gap:14px;' +
            'width:100%;' +
        '}' +


        '.cm-year-month{' +
            'border:1px solid #d8e0e8;' +
            'border-radius:10px;' +
            'overflow:hidden;' +
            'background:#fff;' +
            'box-shadow:0 2px 6px rgba(11,55,103,.05);' +
        '}' +


        '.cm-year-month-header{' +
            'background:#0b4c87;' +
            'color:#fff;' +
            'padding:8px 10px;' +
            'display:flex;' +
            'justify-content:space-between;' +
            'align-items:center;' +
            'font-size:13px;' +
            'font-weight:900;' +
        '}' +


        '.cm-year-count{' +
            'font-size:9px;' +
            'font-weight:700;' +
            'opacity:.85;' +
        '}' +


        '.cm-year-weekdays{' +
            'display:grid;' +
            'grid-template-columns:repeat(7,minmax(0,1fr));' +
            'background:#eef4f8;' +
            'color:#49667f;' +
        '}' +


        '.cm-year-weekdays span{' +
            'text-align:center;' +
            'padding:5px 1px;' +
            'font-size:9px;' +
            'font-weight:900;' +
        '}' +


        '.cm-year-days{' +
            'display:grid;' +
            'grid-template-columns:repeat(7,minmax(0,1fr));' +
        '}' +


        '.cm-year-day{' +
            'height:42px;' +
            'padding:3px;' +
            'border-top:1px solid #edf0f3;' +
            'border-right:1px solid #edf0f3;' +
            'box-sizing:border-box;' +
            'position:relative;' +
            'cursor:default;' +
            'overflow:hidden;' +
        '}' +


        '.cm-year-day:nth-child(7n){' +
            'border-right:none;' +
        '}' +


        '.cm-year-empty{' +
            'background:#fafbfc;' +
        '}' +


        '.cm-year-has-event{' +
            'cursor:pointer;' +
            'background:#fbfdff;' +
        '}' +


        '.cm-year-has-event:hover{' +
            'background:#edf6ff;' +
        '}' +


        '.cm-year-day-number{' +
            'font-size:9px;' +
            'font-weight:800;' +
            'color:#183b59;' +
        '}' +


        '.cm-year-indicators{' +
            'display:flex;' +
            'align-items:center;' +
            'gap:2px;' +
            'margin-top:4px;' +
            'flex-wrap:wrap;' +
        '}' +


        '.cm-year-dot{' +
            'width:6px;' +
            'height:6px;' +
            'border-radius:50%;' +
            'display:inline-block;' +
        '}' +


        '.cm-year-dot-green{background:#47a447;}' +

        '.cm-year-dot-yellow{background:#f0b400;}' +

        '.cm-year-dot-red{background:#d73a35;}' +

        '.cm-year-dot-gray{background:#8794a3;}' +


        '.cm-year-more{' +
            'font-size:7px;' +
            'font-weight:800;' +
            'color:#5d7184;' +
        '}' +


        // ====================================================
        // MES
        // ====================================================

        '.cm-calendar,' +
        '.cm-week-calendar,' +
        '.cm-daily{' +
            'width:100%;' +
            'border:1px solid #d8e0e8;' +
            'border-radius:9px;' +
            'overflow:hidden;' +
            'background:white;' +
            'box-sizing:border-box;' +
        '}' +


        '.cm-weekdays,' +
        '.cm-days{' +
            'display:grid;' +
            'grid-template-columns:repeat(7,minmax(0,1fr));' +
            'width:100%;' +
        '}' +


        '.cm-weekdays{' +
            'background:#0b4c87;' +
            'color:white;' +
        '}' +


        '.cm-weekdays>div{' +
            'padding:8px 6px;' +
            'text-align:center;' +
            'font-size:11px;' +
            'font-weight:800;' +
            'box-sizing:border-box;' +
        '}' +


        '.cm-day{' +
            'min-height:145px;' +
            'padding:6px;' +
            'border-right:1px solid #dfe5eb;' +
            'border-top:1px solid #dfe5eb;' +
            'background:#fff;' +
            'min-width:0;' +
            'box-sizing:border-box;' +
            'overflow:hidden;' +
        '}' +


        '.cm-day:nth-child(7n){' +
            'border-right:none;' +
        '}' +


        '.cm-empty{' +
            'background:#fafbfd;' +
        '}' +


        '.cm-day-header{' +
            'display:flex;' +
            'justify-content:space-between;' +
            'align-items:center;' +
            'margin-bottom:5px;' +
        '}' +


        '.cm-day-number{' +
            'font-size:11px;' +
            'font-weight:900;' +
            'color:#123c63;' +
        '}' +


        '.cm-today{' +
            'box-shadow:inset 0 0 0 2px #54b947;' +
        '}' +


        '.cm-today-label{' +
            'background:#54b947;' +
            'color:white;' +
            'border-radius:10px;' +
            'font-size:8px;' +
            'padding:2px 6px;' +
        '}' +


        // ====================================================
        // TARJETAS
        // ====================================================

        '.cm-events{' +
            'width:100%;' +
            'min-width:0;' +
            'overflow:hidden;' +
        '}' +


        '.cm-event{' +
            'width:100%;' +
            'min-width:0;' +
            'max-width:100%;' +
            'box-sizing:border-box;' +
            'border-radius:7px;' +
            'padding:7px 8px;' +
            'font-size:9px;' +
            'line-height:1.25;' +
            'margin-bottom:5px;' +
            'border:1px solid transparent;' +
        '}' +


        '.cm-event-vigente{' +
            'background:#e6f7eb;' +
            'border-color:#cdebd6;' +
            'color:#206b3f;' +
        '}' +


        '.cm-event-proximo{' +
            'background:#fff1bf;' +
            'border-color:#f5df95;' +
            'color:#885a00;' +
        '}' +


        '.cm-event-vencido{' +
            'background:#fde0df;' +
            'border-color:#f3c7c5;' +
            'color:#a52c28;' +
        '}' +


        '.cm-event-sin-info{' +
            'background:#f1f3f5;' +
            'color:#596879;' +
        '}' +


        '.cm-card-main{' +
            'display:flex;' +
            'gap:7px;' +
            'width:100%;' +
            'min-width:0;' +
        '}' +


        '.cm-card-dot{' +
            'width:8px;' +
            'height:8px;' +
            'border-radius:50%;' +
            'margin-top:4px;' +
            'flex:0 0 auto;' +
        '}' +


        '.cm-card-dot-green{background:#47a447;}' +

        '.cm-card-dot-yellow{background:#f0b400;}' +

        '.cm-card-dot-red{background:#d73a35;}' +

        '.cm-card-dot-gray{background:#8794a3;}' +


        '.cm-card-info{' +
            'min-width:0;' +
            'overflow:hidden;' +
            'flex:1;' +
        '}' +


        '.cm-card-hv,' +
        '.cm-card-item,' +
        '.cm-card-product,' +
        '.cm-card-plan{' +
            'max-width:100%;' +
            'white-space:nowrap;' +
            'overflow:hidden;' +
            'text-overflow:ellipsis;' +
        '}' +


        '.cm-card-hv{' +
            'font-weight:900;' +
        '}' +


        '.cm-card-item,' +
        '.cm-card-product,' +
        '.cm-card-plan{' +
            'font-weight:700;' +
        '}' +


        '.cm-card-bottom{' +
            'margin-top:6px;' +
            'padding-top:5px;' +
            'border-top:1px solid rgba(0,0,0,.08);' +
            'display:flex;' +
            'flex-direction:column;' +
            'gap:2px;' +
        '}' +


        '.cm-card-days{' +
            'font-size:8.5px;' +
        '}' +


        '.cm-card-status{' +
            'display:inline-block;' +
            'background:rgba(255,255,255,.76);' +
            'border-radius:9px;' +
            'padding:2px 6px;' +
            'margin-top:5px;' +
            'font-size:8px;' +
            'font-weight:900;' +
        '}' +


        '.cm-card-links{' +
            'display:flex;' +
            'gap:8px;' +
            'margin-top:5px;' +
            'padding-top:4px;' +
            'border-top:1px solid rgba(0,0,0,.07);' +
        '}' +


        '.cm-card-links a{' +
            'color:inherit;' +
            'font-weight:900;' +
            'text-decoration:none;' +
        '}' +


        // ====================================================
        // SEMANA
        // ====================================================

        '.cm-week-header,' +
        '.cm-week-body{' +
            'display:grid;' +
            'grid-template-columns:repeat(7,minmax(0,1fr));' +
            'width:100%;' +
        '}' +


        '.cm-week-header{' +
            'background:#0b4c87;' +
            'color:white;' +
        '}' +


        '.cm-week-header-cell{' +
            'text-align:center;' +
            'padding:10px;' +
            'min-width:0;' +
        '}' +


        '.cm-week-name{' +
            'font-size:10px;' +
            'font-weight:700;' +
        '}' +


        '.cm-week-number{' +
            'font-size:21px;' +
            'font-weight:900;' +
        '}' +


        '.cm-week-column{' +
            'min-height:420px;' +
            'padding:7px;' +
            'border-right:1px solid #e1e6eb;' +
            'overflow:hidden;' +
            'min-width:0;' +
            'box-sizing:border-box;' +
        '}' +


        '.cm-week-column:last-child{' +
            'border-right:none;' +
        '}' +


        '.cm-no-events{' +
            'text-align:center;' +
            'font-size:9px;' +
            'margin-top:25px;' +
            'color:#9aa6b2;' +
        '}' +


        // ====================================================
        // DÍA
        // ====================================================

        '.cm-daily-header{' +
            'display:flex;' +
            'align-items:center;' +
            'gap:14px;' +
            'padding:16px;' +
            'background:#0b4c87;' +
            'color:white;' +
        '}' +


        '.cm-daily-number{' +
            'width:52px;' +
            'height:52px;' +
            'background:white;' +
            'color:#0b4c87;' +
            'border-radius:10px;' +
            'display:flex;' +
            'justify-content:center;' +
            'align-items:center;' +
            'font-size:23px;' +
            'font-weight:900;' +
        '}' +


        '.cm-daily-day{' +
            'font-size:18px;' +
            'font-weight:900;' +
        '}' +


        '.cm-daily-count{' +
            'margin-left:auto;' +
            'background:rgba(255,255,255,.16);' +
            'padding:6px 12px;' +
            'border-radius:18px;' +
        '}' +


        '.cm-daily-events{' +
            'padding:14px;' +
            'display:grid;' +
            'grid-template-columns:repeat(auto-fit,minmax(290px,1fr));' +
            'gap:10px;' +
        '}' +


        '.cm-empty-day{' +
            'grid-column:1/-1;' +
            'text-align:center;' +
            'padding:45px;' +
        '}' +


        // ====================================================
        // FOOTER
        // ====================================================

        '.cm-footer{' +
            'background:#07376c;' +
            'color:white;' +
            'padding:13px 28px;' +
            'display:flex;' +
            'justify-content:space-between;' +
            'font-size:10px;' +
        '}' +


        '.cm-footer-separator{' +
            'margin:0 10px;' +
        '}' +


        '.cm-footer span{' +
            'color:#34a9eb;' +
            'font-weight:700;' +
        '}' +


        '.cm-footer-right{' +
            'color:#b4df32;' +
            'font-weight:900;' +
        '}' +


        // ====================================================
        // RESPONSIVE
        // ====================================================

        '@media(max-width:1300px){' +

            '.cm-year-grid{' +
                'grid-template-columns:repeat(2,minmax(0,1fr));' +
            '}' +

        '}' +


        '@media(max-width:900px){' +

            '.cm-year-grid{' +
                'grid-template-columns:1fr;' +
            '}' +

            '.cm-kpis{' +
                'grid-template-columns:repeat(2,minmax(0,1fr));' +
            '}' +

            '.cm-hero-right{' +
                'display:none;' +
            '}' +

        '}' +


        '</style>'

    );

}