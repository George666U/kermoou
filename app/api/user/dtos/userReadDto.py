from flask_restx import fields
from .. import api

from app.api.car.dtos.carReadDto import carReadDto

userReadDto = api.model(
    "UserReadDto",
    {
        "user_id": fields.Integer,
        "username": fields.String,
        "name": fields.String,
        "profile_picture": fields.String,
        "about": fields.String,
        "cars": fields.List(fields.Nested(carReadDto)),
    },
)
userListReadDto = api.model(
    "UserListReadDto",
    {
        "users": fields.List(fields.Nested(userReadDto)),
    },
)
