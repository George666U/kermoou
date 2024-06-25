from flask_restx import fields

from .. import api


carCreateDto = api.model(
    "CarCreateDto",
    {
        "car_make": fields.String(required=True),
        "car_model": fields.String,
        "car_year": fields.Integer(required=True),
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
        "about": fields.String,
    },
)

carUpdateDto = api.model(
    "CarUpdateDto",
    {
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
        "about": fields.String,
    },
)
