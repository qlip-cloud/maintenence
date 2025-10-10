frappe.ui.form.on("Material Request", {
    project_mr:function(frm){
        if(frm.doc.project_mr != null){
            $.each(frm.doc.items, function(i, item){
                item.project = frm.doc.project_mr;
            });

            frm.refresh_field("items");
        }
    },
    cost_center_mr:function(frm){
        if(frm.doc.cost_center_mr != null){
            $.each(frm.doc.items, function(i, item){
                item.cost_center = frm.doc.cost_center_mr;
            });

            frm.refresh_field("items");
        }
    }
});

frappe.ui.form.on("Material Request Item", {
    item_code:function(frm, cdt, cdn){
        var child = locals[cdt][cdn];

        if(frm.doc.project_mr != null){
            child.project = frm.doc.project_mr;
        }

        if(frm.doc.cost_center_mr != null){
            child.cost_center = frm.doc.cost_center_mr;
        }

        frm.refresh_field("items");
    }
});