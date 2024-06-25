from flask_restx import Resource
from flask_jwt_extended import jwt_required
from flask_jwt_extended import current_user

from . import api
from .service import UserCarService

from .dtos.carReadDto import carListReadDto
from .dtos.carCreateDto import carCreateDto, carUpdateDto
from .dtos.carDetailsDto import carDetailsDto


@api.route("/<int:car_id>")
class CarGet(Resource):
    @api.doc(
        "Get a specific car",
        responses={
            200: ("Car data successfully sent", carDetailsDto),
            404: "Car not found!",
        },
    )
    def get(self, car_id):
        """ Get a specific car's data by its ID """
        return UserCarService.get_car_data(car_id)

    @api.doc(
        "Update a car",
        responses={
            200: ("Car data successfully updated", carDetailsDto),
            400: "Validations failed.",
            404: "Car not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    @api.expect(carUpdateDto, validate=True)
    def put(self, car_id):
        """ Update a car """
        return UserCarService.update_user_car(current_user.user_id, car_id, api.payload)

    @api.doc(
        "Delete a car",
        responses={
            200: ("Car successfully deleted"),
            404: "Car not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    def delete(self, car_id):
        """ Delete a car """
        return UserCarService.delete_user_car(current_user.user_id, car_id)


@api.route("/")
class CarList(Resource):
    @api.doc(
        "Get all cars",
        responses={
            200: ("Cars data successfully sent", carListReadDto),
            404: "No cars found!",
        },
    )
    def get(self):
        """ Get all cars """
        return UserCarService.get_user_cars()

    @api.doc(
        "Add a car",
        responses={
            201: ("Car successfully added", carDetailsDto),
            400: "Validations failed.",
            404: "Car not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    @api.expect(carCreateDto, validate=True)
    def post(self):
        """ Add a car """
        return UserCarService.add_user_car(current_user.user_id, api.payload)
