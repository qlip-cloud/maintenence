
import frappe
from frappe.utils import flt


def handle(hoja_de_vida_del_bien, method):

    print("after_save")

    if hoja_de_vida_del_bien.is_group and hoja_de_vida_del_bien.estado_del_bien:
        
        print("is_group")

        def search_parent(hvb):

            print("search")

            children = frappe.db.get_list(
                            'Hoja de Vida del Bien', 
                            filters={'parent_hoja_de_vida_del_bien': hoja_de_vida_del_bien.name},
                            fields=['*']
                        )
                        
            for child in children:

                print("child")

                if child.is_group:

                    print("child group")
                    search_parent(child.name)
                
                frappe.db.set_value('Hoja de Vida del Bien', child.name, "estado_del_bien", hoja_de_vida_del_bien.estado_del_bien)


        search_parent(hoja_de_vida_del_bien.name)
