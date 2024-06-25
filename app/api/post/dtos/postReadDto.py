from flask_restx import fields

from .. import api

from app.api.car.dtos.carReadDto import carReadDto
from app.api.user.dtos.userReadDto import userReadDto

# CommentDto`s
commentReadDto = api.model(
    "CommentReadDto",
    {
        "comment_id": fields.Integer,
        "post_id": fields.Integer,
        "content": fields.String,
        "user": fields.Nested(userReadDto),
        "created_at": fields.DateTime,
    },
)
commentListReadDto = api.model(
    "CommentListReadDto",
    {
        "comments": fields.List(fields.Nested(commentReadDto)),
    },
)

imageDto = api.model(
    "ImageDto",
    {
        "image_url": fields.String,
    },
)

# PostDto`s
postReadDto = api.model(
    "PostReadDto",
    {
        "post_id": fields.Integer,
        "user_id": fields.Integer,
        "community_id": fields.Integer,
        "post_type": fields.String,
        "title": fields.String,
        "content": fields.String,
        "author": fields.Nested(userReadDto),
        "car": fields.Nested(carReadDto),
        "images": fields.List(fields.Nested(imageDto)),
        "like_count": fields.Integer,
        "comment_count": fields.Integer,
        "created_at": fields.DateTime,
    },
)
postListReadDto = api.model(
    "PostListReadDto",
    {
        "posts": fields.List(fields.Nested(postReadDto)),
    },
)
