from flask_restx import fields

from .. import api

carReadDto = api.model(
    "CarReadDto",
    {
        "car_id": fields.Integer,
        "car_make": fields.String,
        "car_model": fields.String,
        "car_year": fields.Integer,
        "profile_picture": fields.String,
        "post_count": fields.Integer,
    },
)

carListReadDto = api.model(
    "CarListReadDto",
    {
        "cars": fields.List(fields.Nested(carReadDto)),
    },
)
