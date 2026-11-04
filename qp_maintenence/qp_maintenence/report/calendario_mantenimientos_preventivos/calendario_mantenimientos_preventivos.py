# Copyright (c) 2013, Mentum Group and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def execute(filters=None):
	# ============================================================
	# CALENDARIO MANTENIMIENTO PREVENTIVO
	# QLIP BUSINESS / FRAPPE
	#
	# - Hoja de Vida
	# - Producto
	# - Nombre Producto
	# - Plan de mantenimiento
	# - Productos Asociados PP
	# - Última OS por Bien + Plan
	# - Semáforo Fecha
	# - Cálculo Horas / Km conservado internamente
	# - Estado visual basado únicamente en FECHA
	# - Filtro Producto tipo Link
	# - Logo Company
	# ============================================================


	columns = [

		{
			"label": "Hoja de Vida",
			"fieldname": "hoja_de_vida",
			"fieldtype": "Link",
			"options": "Hoja de Vida del Bien",
			"width": 150
		},
		{
			"label": "Serial",
			"fieldname": "serial_no",
			"fieldtype": "Data",
			"width": 130
		},
		{
			"label": "Producto",
			"fieldname": "item_code",
			"fieldtype": "Link",
			"options": "Item",
			"width": 150
		},
		{
			"label": "Nombre del Producto",
			"fieldname": "item_name",
			"fieldtype": "Data",
			"width": 220
		},
		{
			"label": "Cliente",
			"fieldname": "customer_name",
			"fieldtype": "Data",
			"width": 200
		},
		{
			"label": "Compañía",
			"fieldname": "company",
			"fieldtype": "Link",
			"options": "Company",
			"width": 160
		},
		{
			"label": "Logo",
			"fieldname": "company_logo",
			"fieldtype": "Data",
			"width": 100
		},
		{
			"label": "Plan de Mantenimiento",
			"fieldname": "plan_mantenimiento",
			"fieldtype": "Link",
			"options": "Project Template",
			"width": 260
		},
		{
			"label": "Periodicidad",
			"fieldname": "periodicidad",
			"fieldtype": "Int",
			"width": 110
		},
		{
			"label": "Horas/Kms",
			"fieldname": "horas_kms",
			"fieldtype": "Float",
			"width": 110
		},
		{
			"label": "Unidad",
			"fieldname": "unidad_de_medida",
			"fieldtype": "Data",
			"width": 110
		},
		{
			"label": "Última OS",
			"fieldname": "ultima_os",
			"fieldtype": "Link",
			"options": "Orden de Servicio",
			"width": 160
		},
		{
			"label": "Fecha Último Mtto.",
			"fieldname": "fecha_ultimo_mantenimiento",
			"fieldtype": "Date",
			"width": 150
		},
		{
			"label": "Lectura Último Mtto.",
			"fieldname": "lectura_ultimo_mantenimiento",
			"fieldtype": "Float",
			"width": 150
		},
		{
			"label": "Lectura Actual",
			"fieldname": "lectura_actual",
			"fieldtype": "Float",
			"width": 130
		},
		{
			"label": "Próxima Lectura",
			"fieldname": "proxima_lectura",
			"fieldtype": "Float",
			"width": 140
		},
		{
			"label": "Restante",
			"fieldname": "restante_lectura",
			"fieldtype": "Float",
			"width": 120
		},
		{
			"label": "Próxima Fecha",
			"fieldname": "fecha_proximo_mantenimiento",
			"fieldtype": "Date",
			"width": 145
		},
		{
			"label": "Días Restantes",
			"fieldname": "dias_restantes",
			"fieldtype": "Int",
			"width": 120
		},
		{
			"label": "Semáforo Lectura",
			"fieldname": "semaforo_lectura",
			"fieldtype": "Data",
			"width": 130
		},
		{
			"label": "Semáforo Fecha",
			"fieldname": "semaforo_fecha",
			"fieldtype": "Data",
			"width": 130
		},
		{
			"label": "Estado",
			"fieldname": "semaforo_final",
			"fieldtype": "Data",
			"width": 170
		},
		{
			"label": "Responsable",
			"fieldname": "responsable",
			"fieldtype": "Data",
			"width": 170
		}
	]


	# ============================================================
	# FILTROS
	# ============================================================

	if not filters:
		filters = {}


	conditions = ""
	values = {}


	# ============================================================
	# CLIENTE
	# ============================================================

	if filters.get("customer"):

		conditions = (
			conditions
			+ " AND hv.customer = %(customer)s"
		)

		values["customer"] = filters.get(
			"customer"
		)


	# ============================================================
	# HOJA DE VIDA
	# ============================================================

	if filters.get("hoja_de_vida"):

		conditions = (
			conditions
			+ " AND hv.name = %(hoja_de_vida)s"
		)

		values["hoja_de_vida"] = filters.get(
			"hoja_de_vida"
		)


	# ============================================================
	# PRODUCTO
	#
	# El filtro es Link a Item.
	# Frappe devuelve el NAME del Item, normalmente item_code.
	# ============================================================

	if filters.get("producto"):

		conditions = (
			conditions
			+ " AND hv.item_code = %(producto)s"
		)

		values["producto"] = filters.get(
			"producto"
		)


	# ============================================================
	# PLAN
	# ============================================================

	if filters.get("plan_mantenimiento"):

		conditions = (
			conditions
			+ """
			AND os.cl_plantilla_de_mantenimiento
				= %(plan_mantenimiento)s
			"""
		)

		values["plan_mantenimiento"] = filters.get(
			"plan_mantenimiento"
		)


	# ============================================================
	# UNIDAD
	# ============================================================

	if filters.get("unidad_de_medida"):

		conditions = (
			conditions
			+ """
			AND pp.unidad_de_medida
				= %(unidad_de_medida)s
			"""
		)

		values["unidad_de_medida"] = filters.get(
			"unidad_de_medida"
		)


	# ============================================================
	# RESPONSABLE
	# ============================================================

	if filters.get("responsable"):

		conditions = (
			conditions
			+ """
			AND os.responsable
				= %(responsable)s
			"""
		)

		values["responsable"] = filters.get(
			"responsable"
		)


	# ============================================================
	# CONSULTA
	# ============================================================

	sql = """

	SELECT

		hv.name AS hoja_de_vida,

		hv.serial_no AS serial_no,

		hv.item_code AS item_code,

		hv.item_name AS item_name,

		hv.customer AS customer,

		hv.customer_name AS customer_name,

		os.company AS company,

		cmp.company_logo AS company_logo,

		os.cl_plantilla_de_mantenimiento
			AS plan_mantenimiento,

		pp.periodicidad AS periodicidad,

		pp.horas_kms AS horas_kms,

		pp.unidad_de_medida AS unidad_de_medida,

		os.name AS ultima_os,

		DATE(
			os.`fecha_y_hora_finalización_os`
		) AS fecha_ultimo_mantenimiento,

		os.valor_de_lectura_actual
			AS lectura_ultimo_mantenimiento,

		os.responsable AS responsable,


		(
			SELECT

				os_actual.valor_de_lectura_actual

			FROM

				`tabOrden de Servicio` os_actual

			WHERE

				os_actual.hoja_de_vida_del_bien
					= hv.name

				AND os_actual.valor_de_lectura_actual
					IS NOT NULL

			ORDER BY

				os_actual.creation DESC

			LIMIT 1

		) AS lectura_actual,


		CASE

			WHEN
				pp.periodicidad IS NOT NULL
				AND pp.periodicidad > 0

			THEN

				DATE(

					DATE_ADD(

						os.`fecha_y_hora_finalización_os`,

						INTERVAL pp.periodicidad DAY

					)

				)

			ELSE NULL

		END AS fecha_proximo_mantenimiento,


		CASE

			WHEN
				pp.periodicidad IS NOT NULL
				AND pp.periodicidad > 0

			THEN

				DATEDIFF(

					DATE(

						DATE_ADD(

							os.`fecha_y_hora_finalización_os`,

							INTERVAL pp.periodicidad DAY

						)

					),

					CURDATE()

				)

			ELSE NULL

		END AS dias_restantes


	FROM

		`tabOrden de Servicio` os


	INNER JOIN

		`tabHoja de Vida del Bien` hv

		ON hv.name =
		os.hoja_de_vida_del_bien


	INNER JOIN

		`tabProductos Asociados PP` pp

		ON pp.parent =
		os.cl_plantilla_de_mantenimiento

		AND pp.parenttype =
			'Project Template'

		AND pp.item_code =
			hv.item_code


	LEFT JOIN

		`tabCompany` cmp

		ON cmp.name =
		os.company


	WHERE

		os.cl_plantilla_de_mantenimiento
			IS NOT NULL

		AND os.cl_plantilla_de_mantenimiento
			!= ''

		AND os.hoja_de_vida_del_bien
			IS NOT NULL

		AND os.hoja_de_vida_del_bien
			!= ''

		AND os.`fecha_y_hora_finalización_os`
			IS NOT NULL


		AND os.name = (

			SELECT

				os2.name

			FROM

				`tabOrden de Servicio` os2

			WHERE

				os2.hoja_de_vida_del_bien =
					os.hoja_de_vida_del_bien

				AND os2.cl_plantilla_de_mantenimiento =
					os.cl_plantilla_de_mantenimiento

				AND os2.`fecha_y_hora_finalización_os`
					IS NOT NULL

			ORDER BY

				os2.`fecha_y_hora_finalización_os`
					DESC,

				os2.creation DESC

			LIMIT 1

		)

	"""


	sql = sql + conditions


	sql = sql + """

	ORDER BY

		fecha_proximo_mantenimiento ASC,

		hv.name ASC,

		os.cl_plantilla_de_mantenimiento ASC

	"""


	rows = frappe.db.sql(
		sql,
		values,
		as_dict=True
	)


	# ============================================================
	# PROCESAMIENTO
	# ============================================================

	report_rows = []


	for row in rows:

		periodicidad = row.get(
			"periodicidad"
		)

		horas_kms = row.get(
			"horas_kms"
		)

		unidad = row.get(
			"unidad_de_medida"
		)

		lectura_ultimo = row.get(
			"lectura_ultimo_mantenimiento"
		)

		lectura_actual = row.get(
			"lectura_actual"
		)


		if periodicidad is None:
			periodicidad = 0


		if horas_kms is None:
			horas_kms = 0


		if not unidad:
			unidad = ""


		unidad_normalizada = unidad.lower()


		# ========================================================
		# PRÓXIMA LECTURA
		# ========================================================

		proxima_lectura = None


		if (
			lectura_ultimo is not None
			and
			horas_kms > 0
		):

			proxima_lectura = (
				float(lectura_ultimo)
				+
				float(horas_kms)
			)


		row["proxima_lectura"] = proxima_lectura


		# ========================================================
		# RESTANTE
		# ========================================================

		restante_lectura = None


		if (
			proxima_lectura is not None
			and
			lectura_actual is not None
		):

			restante_lectura = (
				float(proxima_lectura)
				-
				float(lectura_actual)
			)


		row["restante_lectura"] = restante_lectura


		# ========================================================
		# SEMÁFORO HORAS / KM
		# SOLO REFERENCIA INTERNA
		# ========================================================

		semaforo_lectura = "SIN DATOS"
		nivel_lectura = 0


		if restante_lectura is not None:

			if "hora" in unidad_normalizada:

				if restante_lectura <= 0:

					semaforo_lectura = "ROJO"
					nivel_lectura = 3

				elif restante_lectura <= 79:

					semaforo_lectura = "AMARILLO"
					nivel_lectura = 2

				else:

					semaforo_lectura = "VERDE"
					nivel_lectura = 1


			elif (
				"km" in unidad_normalizada
				or
				"kilomet" in unidad_normalizada
			):

				if restante_lectura <= 0:

					semaforo_lectura = "ROJO"
					nivel_lectura = 3

				elif restante_lectura <= 999:

					semaforo_lectura = "AMARILLO"
					nivel_lectura = 2

				else:

					semaforo_lectura = "VERDE"
					nivel_lectura = 1


		row["semaforo_lectura"] = semaforo_lectura


		# ========================================================
		# SEMÁFORO FECHA
		# ========================================================

		dias_restantes = row.get(
			"dias_restantes"
		)

		semaforo_fecha = "SIN DATOS"
		nivel_fecha = 0


		if (
			periodicidad > 0
			and
			dias_restantes is not None
		):

			dias_restantes = int(
				dias_restantes
			)


			if dias_restantes <= 0:

				semaforo_fecha = "ROJO"
				nivel_fecha = 3


			elif dias_restantes <= 30:

				semaforo_fecha = "AMARILLO"
				nivel_fecha = 2


			else:

				semaforo_fecha = "VERDE"
				nivel_fecha = 1


		row["semaforo_fecha"] = semaforo_fecha


		# ========================================================
		# ESTADO FINAL
		# ÚNICAMENTE POR FECHA
		# ========================================================

		if nivel_fecha == 3:

			row["semaforo_final"] = "VENCIDO"


		elif nivel_fecha == 2:

			row["semaforo_final"] = "PRÓXIMO A VENCER"


		elif nivel_fecha == 1:

			row["semaforo_final"] = "VIGENTE"


		else:

			row["semaforo_final"] = "SIN INFORMACIÓN"


		# ========================================================
		# FILTRO ESTADO
		# ========================================================

		incluir = True


		if filters.get("semaforo"):

			if (
				row.get("semaforo_final")
				!=
				filters.get("semaforo")
			):

				incluir = False


		if incluir:

			report_rows.append(
				row
			)


	# ============================================================
	# RESUMEN
	# ============================================================

	total = 0
	verdes = 0
	amarillos = 0
	rojos = 0
	sin_datos = 0


	for row in report_rows:

		total = total + 1

		estado = row.get(
			"semaforo_final"
		)


		if estado == "VIGENTE":
			verdes = verdes + 1


		elif estado == "PRÓXIMO A VENCER":
			amarillos = amarillos + 1


		elif estado == "VENCIDO":
			rojos = rojos + 1


		else:

			sin_datos = sin_datos + 1


	report_summary = [

		{
			"value": total,
			"indicator": "Blue",
			"label": "Total mantenimientos",
			"datatype": "Int"
		},

		{
			"value": verdes,
			"indicator": "Green",
			"label": "Vigentes",
			"datatype": "Int"
		},

		{
			"value": amarillos,
			"indicator": "Orange",
			"label": "Próximos a vencer",
			"datatype": "Int"
		},

		{
			"value": rojos,
			"indicator": "Red",
			"label": "Vencidos",
			"datatype": "Int"
		},

		{
			"value": sin_datos,
			"indicator": "Gray",
			"label": "Sin información",
			"datatype": "Int"
		}

	]


	# ============================================================
	# SALIDA
	# ============================================================

	data = [

		columns,

		report_rows,

		None,

		None,

		report_summary,

		True

	]

	return data