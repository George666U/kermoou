from flask import current_app
from flask_jwt_extended import create_access_token, current_user

from app import db, jwt
from app.utils import message, err_resp, internal_err_resp
from app.models import User
from app.models.schemas import UserSchema

user_schema = UserSchema()


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.user_id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data) -> User | None:
    identity = jwt_data["sub"]
    print('identiity', identity)
    return User.query.filter_by(user_id=identity).one_or_none()


class AuthService:
    @staticmethod
    def login(data):
        email = data["email"]
        password = data["password"]

        try:
            if not (user := User.query.filter_by(email=email).first()):
                return err_resp(
                    "Облікового запису не знайдено.",
                    "email_404",
                    404,
                )

            elif user and user.verify_password(password):
                user_info = user_schema.dump(user)
                access_token = create_access_token(identity=user)

                resp = message(True, "Successfully logged in.")
                resp["access_token"] = access_token
                resp["user"] = user_info

                return resp, 200

            return err_resp(
                "Помилка входу, невірний пароль.", "password_invalid", 401
            )

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def register(data):
        # Assign vars

        # Required values
        email = data["email"]
        username = data["username"]
        password = data["password"]

        # Optional
        data_name = data.get("name")

        # Validate length of username and password from query
        if len(username) < 4 or len(username) > 15:
            return err_resp(
                "Псевдонім повинен бути від 4 до 15 символів.",
                "username_length",
                400,
            )

        if len(password) < 8 or len(password) > 128:
            return err_resp(
                "Пароль повинен бути від 8 до 128 символів.",
                "password_length",
                400,
            )

        # Check if the email is taken
        if User.query.filter_by(email=email).first() is not None:
            return err_resp("Електронна адреса уже зайнята.", "email_taken", 403)

        # Check if the username is taken
        if User.query.filter_by(username=username).first() is not None:
            return err_resp("Псевдонім уже зайнятий.", "username_taken", 403)

        try:
            new_user = User(
                email=email,
                username=username,
                name=data_name,
                password=password,
                profile_picture="/api/file/uploads/avatar-default-icon-27gn83h28.png",
            )

            db.session.add(new_user)
            db.session.flush()

            # Load the new user's info
            user_info = user_schema.dump(new_user)

            # Commit changes to DB
            db.session.commit()

            # Create an access token
            access_token = create_access_token(identity=new_user)

            resp = message(True, "User has been registered.")
            resp["access_token"] = access_token
            resp["user"] = user_info

            return resp, 201

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()
