frappe.ui.form.on("Project Template", {
    validate:function(frm){
        
		if(frm.doc.productos_asociados_pp){
			frm.call({
				method:"frappe.client.get_list",
				args:{
					doctype:"Hoja de Vida del Bien",
					filters:{
						item_code:["in", frm.doc.productos_asociados_pp.map(pa => pa.item_code)], 
						estado_del_bien:"Deshabilitado"
					},
					fields:["name"]
				},
				async:false,
				callback:function(r){
					if(r.message.length > 0){
                        r.message.forEach(v => {
						    frappe.msgprint(`El equipo ${v.item_code} asociado a la Hoja de Vida del Bien ${v.name} se encuentra en estado Deshabilitado, y por tanto no puede ser utilizado ni relacionado en ningún proceso del sistema`);
                        })
						frappe.validated = false;
					}
				}

			})
		}
	}
});