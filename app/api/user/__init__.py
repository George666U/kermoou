# Entry point
from flask_restx import Namespace, fields

api = Namespace("user", description="User related operations.")

validationErrDto = api.model("Validation Error", {
    "status": fields.Boolean(description="Validation status"),
    "errors": fields.List(fields.String, description="Validation errors")})

notFoundErrDto = api.model("Not Found Error", {
    "msg": fields.String(description="Not found error"),
    "reason": fields.String(description="not_found"),
    "code": fields.Integer(description="404")
}),

internalErrDto = api.model("Internal Error", {
    "message": fields.String(description="Internal server error"),
    "error_reason": fields.String(description="server_error")})
