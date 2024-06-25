from flask_restx import fields

from .. import api

from app.api.user.dtos.userReadDto import userReadDto
from app.api.car.dtos.carReadDto import carReadDto
from app.api.community.dtos.communityReadDto import communityReadDto
from .postReadDto import imageDto, commentReadDto


postDetailsDto = api.model(
    "PostDetailsDto",
    {
        "post_id": fields.Integer,
        "user_id": fields.Integer,
        "community_id": fields.Integer,
        "post_type": fields.String,
        "title": fields.String,
        "content": fields.String,
        "author": fields.Nested(userReadDto),
        "bookmarked_by": fields.List(fields.Nested(userReadDto)),
        "car": fields.Nested(carReadDto),
        "community": fields.Nested(communityReadDto),
        "images": fields.List(fields.Nested(imageDto)),
        "likes": fields.List(fields.Nested(userReadDto)),
        "comments": fields.List(fields.Nested(commentReadDto)),
        "created_at": fields.DateTime,
    },
)
