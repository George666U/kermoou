from flask import current_app
from flask_restx import marshal

from app.utils import err_resp, message, internal_err_resp
from app.models import UserCar

from .dtos.carReadDto import carListReadDto
from .dtos.carCreateDto import carCreateDto, carUpdateDto
from .dtos.carDetailsDto import carDetailsDto


class UserCarService:
    @staticmethod
    def get_car_data(car_id):
        """ Get car data """
        try:
            if not (car := UserCar.query.filter_by(car_id=car_id).first()):
                return err_resp("Car not found!", "car_404", 404)

            return marshal(car, carDetailsDto), 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def get_user_cars(user_id=None):
        """ Get user cars """
        try:
            if user_id:
                user_cars = UserCar.query.filter_by(user_id=user_id).all()
            else:
                user_cars = UserCar.query.all()

            return marshal({"cars": user_cars}, carListReadDto), 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def add_user_car(user_id, data):
        """ Add user car """
        try:
            new_user_car = UserCar(
                user_id=user_id,
                car_make=data.get("car_make"),
                car_model=data.get("car_model"),
                car_year=data.get("car_year"),
                profile_picture=data.get("profile_picture"),
                mileage=data.get("mileage"),
                color=data.get("color"),
                buy_year=data.get("buy_year"),
                engine_type=data.get("engine_type"),
                engine_displacement=data.get("engine_displacement"),
                engine_power=data.get("engine_power"),
                transmission_type=data.get("transmission_type"),
                drive_type=data.get("drive_type"),
                license_plate=data.get("license_plate"),
                about=data.get("about"),
            )

            new_user_car.save()

            user_car = UserCar.query.get(new_user_car.car_id)

            return marshal(user_car, carDetailsDto), 201

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def update_user_car(user_id, car_id, data):
        """ Update user car """
        try:
            user_car = UserCar.query.filter_by(
                user_id=user_id, car_id=car_id).first()

            if not user_car:
                return err_resp("User car not found!", "user_car_404", 404)

            user_car.update(**data)

            updated_user_car = UserCar.query.get(car_id)

            return marshal(updated_user_car, carDetailsDto), 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def delete_user_car(user_id, car_id):
        """ Delete user car """
        try:
            user_car = UserCar.query.filter_by(
                user_id=user_id, car_id=car_id).first()

            if not user_car:
                return err_resp("User car not found!", "user_car_404", 404)

            user_car.delete()

            resp = message(True, "User car deleted")
            return resp, 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()
