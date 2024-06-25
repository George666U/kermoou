import os
from flask_restx import Resource, fields
from flask_jwt_extended import jwt_required
from flask_jwt_extended import current_user

from . import api
from .service import PredictService

from .dtos.predictCarPriceDto import predictCarPriceDto


@api.route('/car-price')
class PredictCarPrice(Resource):
    @api.doc('Predict car price')
    @api.expect(predictCarPriceDto, validate=True)
    def post(self):
        """ Predict car price """
        return PredictService.predict_car_price(api.payload)
