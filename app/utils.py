from flask_restx import Model, fields


def message(status, message):
    response_object = {"status": status, "message": message}
    return response_object


def validation_error(status, errors):
    response_object = {"status": status, "errors": errors}

    return response_object, 400


validationErrDto = Model("Validation Error", {
    "status": fields.Boolean(description="Validation status"),
    "errors": fields.List(fields.String, description="Validation errors")})


def err_resp(msg, reason, code):
    err = message(False, msg)
    err["error_reason"] = reason
    return err, code


internalErrDto = Model("Internal Error", {
    "message": fields.String(description="Internal server error"),
    "error_reason": fields.String(description="server_error")})


def internal_err_resp():
    err = message(False, "Something went wrong during the process!")
    err["error_reason"] = "server_error"
    return err, 500


authorizations = {"Bearer":
                  {"type": "apiKey",
                   "in": "header",
                   "name": "Authorization"
                   }}
