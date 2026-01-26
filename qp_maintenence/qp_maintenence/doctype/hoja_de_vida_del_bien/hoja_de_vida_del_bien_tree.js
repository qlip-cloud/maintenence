// Copyright (c) 2025, Mentum Group and contributors
// For license information, please see license.txt

frappe.treeview_settings['Hoja de Vida del Bien'] = {
    // ... other settings ...
	get_tree_nodes:'qp_maintenence.qp_maintenence.doctype.hoja_de_vida_del_bien.hoja_de_vida_del_bien.get_children',
    get_label: function(node) {
        // Access fields from the node's data

		if(node.is_root){
			return node.label
		}else{
			return node.data.value + " - " + node.data.item_code + " " + node.data.item_name;
		}
        
    },

};