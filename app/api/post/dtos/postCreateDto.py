from flask_restx import fields

from .. import api


commentCreateDto = api.model(
    "CommentCreateDto",
    {
        "content": fields.String(required=True),
    },
)

postCreateDto = api.model(
    "PostCreateDto",
    {
        "community_id": fields.Integer,
        "post_type": fields.String(required=True),
        "title": fields.String(required=True),
        "content": fields.String(required=True),
        "car_id": fields.Integer,
        "images": fields.List(fields.String),
    },
)
postUpdateDto = api.model(
    "PostUpdateDto",
    {
        "title": fields.String,
        "content": fields.String,
        "images": fields.List(fields.String),
    },
)
