from flask_restx import fields
from .. import api

userUpdateDto = api.model(
    "UserUpdateDto",
    {
        "username": fields.String,
        "name": fields.String,
        "profile_picture": fields.String,
        "about": fields.String,
    },
)
