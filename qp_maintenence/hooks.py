from . import __version__ as app_version

app_name = "qp_maintenence"
app_title = "Qp Maintenence"
app_publisher = "Mentum Group"
app_description = "Maintenence"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "aryrosa.fuentes@mentum.group"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/qp_maintenence/css/qp_maintenence.css"
# app_include_js = "/assets/qp_maintenence/js/qp_maintenence.js"
app_include_js = [
    "/assets/qp_maintenence/js/ma_transaction.js",
    "/assets/qp_maintenence/js/form/sidebar/assign_to.js"
]

# include js, css files in header of web template
# web_include_css = "/assets/qp_maintenence/css/qp_maintenence.css"
# web_include_js = "/assets/qp_maintenence/js/qp_maintenence.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "qp_maintenence/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
doctype_js = {
    "Item" : "public/js/ma_items.js",
    "Stock Entry" : "public/js/ma_stock_entry.js",
    "Purchase Receipt" : "public/js/ma_purchase_receipt.js",
    "Asset" : "public/js/ma_asset.js",
    "Material Request" : "public/js/ma_material_request.js",
    "Sales Invoice" : "public/js/sales_invoice.js"
}

# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "qp_maintenence.install.before_install"
# after_install = "qp_maintenence.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "qp_maintenence.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

extend_bootinfo = "qp_maintenence.startup.boot.qp_maint_boot_session"

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }
doc_events = {

    "Purchase Receipt": {
		"validate": ["qp_maintenence.qp_maintenence.uses_cases.purchase_receipt.validate.handle"],
	},
    "Stock Entry": {
		"validate": ["qp_maintenence.qp_maintenence.uses_cases.purchase_receipt.validate.handle"],
	},
	"Asset":{
        "after_insert":["qp_maintenence.qp_maintenence.uses_cases.asset.after_insert.handle"]
	},
	"Sales Invoice": {
		"validate": ["qp_maintenence.qp_maintenence.uses_cases.sales_invoice.validate.handle"]
	}
}


# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"qp_maintenence.tasks.all"
# 	],
# 	"daily": [
# 		"qp_maintenence.tasks.daily"
# 	],
# 	"hourly": [
# 		"qp_maintenence.tasks.hourly"
# 	],
# 	"weekly": [
# 		"qp_maintenence.tasks.weekly"
# 	]
# 	"monthly": [
# 		"qp_maintenence.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "qp_maintenence.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "qp_maintenence.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "qp_maintenence.task.get_dashboard_data"
# }
override_doctype_dashboards = {
	"Sales Invoice": "qp_maintenence.sales_invoice.get_dashboard_data"
}

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

user_data_fields = [
	{
		"doctype": "{doctype_1}",
		"filter_by": "{filter_by}",
		"redact_fields": ["{field_1}", "{field_2}"],
		"partial": 1,
	},
	{
		"doctype": "{doctype_2}",
		"filter_by": "{filter_by}",
		"partial": 1,
	},
	{
		"doctype": "{doctype_3}",
		"strict": False,
	},
	{
		"doctype": "{doctype_4}"
	}
]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"qp_maintenence.auth.validate"
# ]

