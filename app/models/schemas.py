# Model Schemas
from app import ma

from . import User, UserCar


class CarPreviewSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserCar
        load_instance = True
        # include_fk = True
        # include_relationships = True
        # load_only = ("user_id",)
        dump_only = ("car_id", "created_at")
        exclude = ("created_at",)


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        # include_fk = True
        # include_relationships = True
        load_only = ("password", "password_hash")
        dump_only = ("user_id", "created_at", "role_id")

    cars = ma.Nested(CarPreviewSchema, many=True, only=(
        "car_id", "car_make", "car_model", "car_year"))
