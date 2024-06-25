from flask_restx import fields

from .. import api

from app.api.user.dtos.userReadDto import userReadDto
from app.api.post.dtos.postReadDto import postReadDto

communityDetailsDto = api.model(
    "CommunityDetailsDto",
    {
        "community_id": fields.Integer,
        "title": fields.String,
        "profile_picture": fields.String,
        "about": fields.String,
        "member_count": fields.Integer,
        "created_at": fields.DateTime,
        "posts": fields.List(fields.Nested(postReadDto)),
        "members": fields.List(fields.Nested(userReadDto)),
    },
)
