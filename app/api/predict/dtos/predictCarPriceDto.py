from flask_restx import fields

from .. import api

predictCarPriceDto = api.model(
    "PredictCarPriceDto",
    {
        "car_make": fields.String(required=True),
        "car_model": fields.String(required=True),
        "car_year": fields.Integer(required=True),
        "mileage": fields.Integer(required=True),
        "color": fields.String(required=True),
        "engine_type": fields.String(required=True),
        "engine_displacement": fields.Integer(required=True),
        "transmission_type": fields.String(required=True),
    },
)
