from flask_restx import Resource
from flask_jwt_extended import jwt_required
from flask_jwt_extended import current_user

from . import api, validationErrDto, internalErrDto, notFoundErrDto
from .service import UserService

from .dtos.userReadDto import userListReadDto
from .dtos.userDetailsDto import userDetailsDto
from .dtos.userUpdateDto import userUpdateDto

parser = api.parser()
parser.add_argument('search', type=str,
                    help='search users by username or email', location='args')


@api.route("/<string:username>")
class UserGet(Resource):
    @api.doc(
        "Get a specific user",
    )
    @api.response(code=200, model=userDetailsDto, description='Success')
    @api.response(code=404, model=notFoundErrDto, description='User not found!')
    def get(self, username):
        """ Get a specific user's data by their username """
        return UserService.get_user_data(username)


@api.route("/<int:id>")
class UserGet(Resource):
    @api.doc(
        "Get a specific user",
    )
    @api.response(code=200, model=userDetailsDto, description='Success')
    @api.response(code=404, model=notFoundErrDto, description='User not found!')
    def get(self, id):
        """ Get a specific user's data by their id """
        return UserService.get_user_data_id(id)


@api.route("/")
class UserList(Resource):
    @api.doc(
        "Get all users",
        parser=parser
    )
    @api.response(code=200, model=userListReadDto, description='Success')
    @api.response(code=404, model=notFoundErrDto, description='No users found!')
    def get(self):
        """ Get all users """
        args = parser.parse_args()
        search = args.get('search')
        return UserService.get_all_users(search)


@api.route("/me")
class UserMe(Resource):

    @api.doc(
        "Get current user data",
        security="Bearer",
    )
    @api.response(code=200, model=userDetailsDto, description='Success')
    @api.response(code=500, model=internalErrDto, description='internal server error')
    @jwt_required()
    def get(self):
        """ Get current user data """
        return UserService.get_user_data(current_user.username)

    @api.doc(
        "Update current user",
        security="Bearer",
    )
    @api.expect(userUpdateDto, validate=True)
    @api.response(code=200, model=userDetailsDto, description='Success')
    @api.response(code=400, model=validationErrDto, description='validation error')
    @api.response(code=500, model=internalErrDto, description='internal server error')
    @jwt_required()
    def put(self):
        """ Update current user's data """
        return UserService.update_user_data(current_user.user_id, api.payload)
