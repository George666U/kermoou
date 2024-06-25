from flask_restx import fields

from .. import api

from app.api.user.dtos.userReadDto import userReadDto
from app.api.post.dtos.postReadDto import postReadDto

carDetailsDto = api.model(
    "CarDetailsDto",
    {
        "car_id": fields.Integer,
        "car_make": fields.String,
        "car_model": fields.String,
        "car_year": fields.Integer,
        "profile_picture": fields.String,
        "mileage": fields.Integer,
        "color": fields.String(50),
        "buy_year": fields.Integer,
        "engine_type": fields.String,
        "engine_displacement": fields.Integer,
        "engine_power": fields.Integer,
        "transmission_type": fields.String,
        "drive_type": fields.String,
        "license_plate": fields.String(20),
        "user": fields.Nested(userReadDto),
        "posts": fields.List(fields.Nested(postReadDto)),
        "about": fields.String,
    },
)
