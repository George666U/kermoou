from flask_restx import fields

from .. import api


communityReadDto = api.model(
    "CommunityReadDto",
    {
        "community_id": fields.Integer,
        "title": fields.String,
        "profile_picture": fields.String,
        "about": fields.String,
        "member_count": fields.Integer,
        "created_at": fields.DateTime,
    },
)

communityListReadDto = api.model(
    "CommunityListReadDto",
    {
        "communities": fields.List(fields.Nested(communityReadDto)),
    },
)
