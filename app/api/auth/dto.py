from flask_restx import Namespace, fields
from app.utils import authorizations


class AuthDto:
    api = Namespace("auth", description="Authenticate and receive tokens.",
                    authorizations=authorizations)

    user_obj = api.model(
        "User object",
        {
            "email": fields.String,
            "name": fields.String,
            "username": fields.String,
            "created_at": fields.DateTime,
        },
    )

    auth_login = api.model(
        "Login data",
        {
            "email": fields.String(required=True),
            "password": fields.String(required=True),
        },
    )

    auth_register = api.model(
        "Registration data",
        {
            "email": fields.String(required=True),
            "username": fields.String(required=True),
            # Name is optional
            "name": fields.String,
            "password": fields.String(required=True),
        },
    )

    auth_success = api.model(
        "Auth success response",
        {
            "status": fields.Boolean,
            "message": fields.String,
            "access_token": fields.String,
            "user": fields.Nested(user_obj),
        },
    )
