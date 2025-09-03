frappe.ui.form.on("Material Request", {
    onload:function(frm){
		if(frm.doc.orden_de_trabajo != null){
			frappe.db.get_list(
				"Opportunity Item", 
				{
                    filters:{
					    "parentfield":["in",["replacement_items", "consumable_items"]],
					    "parent":frm.doc.orden_de_trabajo
                    },
                    fields:["*"]
				}).then( (os) => {
					if(Object.keys(os).length > 0){
						os.forEach(function(d) {
                            frm.add_child('items',{
                                item_code:d.item_code,
                                item_name:d.item_name,
                                qty:d.qty,
                                warehouse:d.warehouse,
                                item_group:d.item_group,
                                uom:d.uom,
                                description:d.description,
                                conversion_factor: 1
                            })
                        });
                        frm.refresh_fields()
					}
				}
			);
		}
	},
    project:function(frm){
        if(frm.doc.project != null){
            $.each(frm.doc.items, function(i, item){
                item.project = frm.doc.project;
            });

            frm.refresh_fields();
        }
    },
    cost_center:function(frm){
        if(frm.doc.cost_center != null){
            $.each(frm.doc.items, function(i, item){
                item.cost_center = frm.doc.cost_center;
            });

            frm.refresh_fields();
        }
    },
    items:function(frm, cdt, cdn){
        var child = locals[cdt][cdn];

        if(frm.doc.project != null){
            child.project = frm.doc.project;
        }
        if(frm.doc.cost_center != null){
            child.cost_center = frm.doc.cost_center;
        }

        child.refresh_fields();
    }
});


