from flask_restx import Resource
from flask_jwt_extended import jwt_required
from flask_jwt_extended import current_user

from . import api
from .service import CommunityService

from .dtos.communityReadDto import communityListReadDto, communityReadDto
from .dtos.communityDetailsDto import communityDetailsDto
from .dtos.communityCreateDto import communityCreateDto, communityUpdateDto

parser = api.parser()
parser.add_argument("search", type=str, help="Search query", location="args")


@api.route("/<int:community_id>")
class CommunityGet(Resource):
    @api.doc(
        "Get a specific community",
        responses={
            200: ("Community data successfully sent", communityDetailsDto),
            404: "Community not found!",
        },
    )
    def get(self, community_id):
        """ Get a specific community's data by its ID """
        return CommunityService.get_community_data(community_id)

    @api.doc(
        "Update a community",
        responses={
            200: ("Community data successfully updated", communityDetailsDto),
            400: "Validations failed.",
            404: "Community not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    @api.expect(communityUpdateDto, validate=True)
    def put(self, community_id):
        """ Update a community """
        return CommunityService.update_community(current_user.user_id, community_id, api.payload)

    @api.doc(
        "Delete a community",
        responses={
            200: ("Community successfully deleted"),
            404: "Community not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    def delete(self, community_id):
        """ Delete a community """
        return CommunityService.delete_community(current_user.user_id, community_id)


@api.route("/")
class CommunityList(Resource):
    @api.doc(
        "Get all communities",
        responses={
            200: ("List of communities successfully sent", communityListReadDto),
        },
        parser=parser,
    )
    def get(self):
        """ Get all communities """
        args = parser.parse_args()
        search = args.get("search")
        return CommunityService.get_communities(search)

    @api.doc(
        "Create a community",
        responses={
            201: ("Community successfully created", communityDetailsDto),
            400: "Validations failed.",
        },
        security="Bearer",
    )
    @jwt_required()
    @api.expect(communityCreateDto, validate=True)
    def post(self):
        """ Create a community """
        return CommunityService.add_community(current_user.user_id, api.payload)


@api.route("/<int:community_id>/join")
class CommunityJoin(Resource):
    @api.doc(
        "Join a community",
        responses={
            200: ("User successfully joined the community"),
            404: "Community not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    def post(self, community_id):
        """ Join a community """
        return CommunityService.join_community(current_user.user_id, community_id)


@api.route("/<int:community_id>/leave")
class CommunityLeave(Resource):
    @api.doc(
        "Leave a community",
        responses={
            200: ("User successfully left the community"),
            404: "Community not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    def post(self, community_id):
        """ Leave a community """
        return CommunityService.leave_community(current_user.user_id, community_id)
