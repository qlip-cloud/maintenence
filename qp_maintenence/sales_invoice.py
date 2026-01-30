import frappe

def get_dashboard_data(data):

    data['internal_links']['Orden de Servicio'] = ['items', 'service_order']

    return data
