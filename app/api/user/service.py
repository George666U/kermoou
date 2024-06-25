from flask import current_app
from flask_restx import marshal

from app.utils import err_resp, message, internal_err_resp
from app.models import User

from .dtos.userReadDto import userListReadDto
from .dtos.userDetailsDto import userDetailsDto
from .dtos.userUpdateDto import userUpdateDto


class UserService:
    @staticmethod
    def get_user_data(username):
        """ Get user data by username """
        try:
            if not (user := User.query.filter_by(username=username).first()):
                return err_resp("User not found!", "user_404", 404)

            return marshal(user, userDetailsDto), 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def get_user_data_id(user_id):
        """ Get user data by id """
        try:
            if not (user := User.query.get(user_id)):
                return err_resp("User not found!", "user_404", 404)

            return marshal(user, userDetailsDto), 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def update_user_data(user_id, data):
        """ Update user data """
        try:
            user = User.query.get(user_id)

            if not user:
                return err_resp("User not found!", "user_404", 404)

            # validate username and email
            if data.get('username') != None and len(data.get('username')) < 4 or len(data.get('username')) > 15:
                return err_resp(
                    "Псевдонім повинен бути від 4 до 15 символів.",
                    "username_length",
                    400,
                )

            if data.get('email') != None and not '@' in data.get('email'):
                return err_resp("Невірний формат електронної адреси!", "invalid_email", 400)

            # check new username and email
            if data.get('username') != None and user.username != data.get('username') and User.query.filter_by(username=data.get("username")).first():
                return err_resp("Псевдонім уже зайнятий!", "username_exists", 400)

            user.update(**data)

            return marshal(user, userDetailsDto), 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def get_all_users(search=None):
        """ Get all users """
        try:
            if search != None:
                users = User.query.filter(User.username.ilike(
                    f"%{search}%") | User.email.ilike(f"%{search}%")).all()
            else:
                users = User.query.all()

            return marshal({'users': users}, userListReadDto), 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()
