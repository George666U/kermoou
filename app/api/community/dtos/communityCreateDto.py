from flask_restx import fields

from .. import api


communityCreateDto = api.model(
    "CommunityCreateDto",
    {
        "title": fields.String,
        "profile_picture": fields.String(allow_none=True),
        "about": fields.String,
    },
)
communityUpdateDto = api.model(
    "CommunityUpdateDto",
    {
        "title": fields.String,
        "profile_picture": fields.String(allow_none=True),
        "about": fields.String,
    },
)
