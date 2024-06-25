from flask_restx import fields

from .. import api
from app.api.car.dtos.carReadDto import carReadDto
from app.api.community.dtos.communityReadDto import communityReadDto
from app.api.post.dtos.postReadDto import postReadDto, commentReadDto


userDetailsDto = api.model(
    "UserDetailsDto",
    {
        "user_id": fields.Integer,
        "username": fields.String,
        "email": fields.String,
        "name": fields.String,
        "profile_picture": fields.String,
        "about": fields.String,
        "created_at": fields.DateTime,
        "cars": fields.List(fields.Nested(carReadDto)),
        "posts": fields.List(fields.Nested(postReadDto)),
        "post_comments": fields.List(fields.Nested(commentReadDto)),
        "post_bookmarks": fields.List(fields.Nested(api.model('PostBookmark', {"post_id": fields.Integer}))),
        "communities": fields.List(fields.Nested(communityReadDto)),
        "bookmarks": fields.List(fields.Nested(postReadDto))
    },
)
