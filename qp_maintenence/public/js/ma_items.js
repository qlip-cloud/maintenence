frappe.ui.form.on("Item", {
    cl_plantilla_datos_tecnicos_de_mantenimiento:function(frm){
		if(frm.doc.cl_plantilla_datos_tecnicos_de_mantenimiento){
			frappe.db.get_list("Datos tecnicos de mantenimiento",
									{ 
										filters:{
											'parent':frm.doc.cl_plantilla_datos_tecnicos_de_mantenimiento
										},
										fields:["*"],
										order_by:"idx"
									})
			.then((r) => {
					r.forEach(element => {
						frm.add_child('datos_de_mantenimiento', 
							{	'idx':element.idx, 
								'cl_caracteristicas_del_producto':element.cl_caracteristicas_del_producto, 
								'cl_descripcion':element.cl_descripcion
							});
					});
					frm.refresh_field('datos_de_mantenimiento')
			});
					
		}else{
			frm.set_value('datos_de_mantenimiento', '')
		}

		frm.refresh_field('datos_de_mantenimiento')
	}
});