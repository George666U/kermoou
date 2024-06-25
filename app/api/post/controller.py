from flask_restx import Resource
from flask_jwt_extended import jwt_required
from flask_jwt_extended import current_user

from . import api
from .service import PostService

from .dtos.postReadDto import postListReadDto, commentReadDto
from .dtos.postDetailsDto import postDetailsDto
from .dtos.postCreateDto import postCreateDto, commentCreateDto

parser = api.parser()
parser.add_argument("post_type", type=str, help="Post type", location="args")

# Filter for cars characteristics
logbook_parser = api.parser()
logbook_parser.add_argument(
    "car_make", type=str, help="Car make", location="args")
logbook_parser.add_argument("car_model", type=str,
                            help="Car model", location="args")
logbook_parser.add_argument(
    "car_year", type=int, help="Car year", location="args")
logbook_parser.add_argument("engine_type", type=str,
                            help="Engine type", location="args")
logbook_parser.add_argument(
    "transmission_type", type=str, help="Transmission type", location="args")
logbook_parser.add_argument("drive_type", type=str,
                            help="Drive type", location="args")


@api.route("/<int:post_id>")
class PostGet(Resource):
    @api.doc(
        "Get a specific post",
    )
    @api.response(code=200, model=postDetailsDto, description="Post data successfully sent")
    def get(self, post_id):
        """ Get a specific post's data by its ID """
        return PostService.get_post_data(post_id)

    # @api.doc(
    #     "Update a post",
    #     responses={
    #         200: ("Post data successfully updated", data_resp),
    #         400: "Validations failed.",
    #         404: "Post not found!",
    #     },
    #     security="Bearer",
    # )
    # @jwt_required()
    # @api.expect(update_req, validate=True)
    # def put(self, post_id):
    #     """ Update a post """
    #     return PostService.update_post(current_user.user_id, post_id, api.payload)

    @api.doc(
        "Delete a post",
        responses={
            200: ("Post successfully deleted"),
            404: "Post not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    def delete(self, post_id):
        """ Delete a post """
        return PostService.delete_post(current_user.user_id, post_id)


@api.route("/")
class PostList(Resource):
    @api.doc(
        "Get all posts",
        responses={
            200: ("List of posts successfully sent", postListReadDto),
        },
        parser=parser,
    )
    def get(self):
        """ Get all posts """
        args = parser.parse_args()
        post_type = args.get("post_type")

        return PostService.get_posts(post_type=post_type)

    @api.doc(
        "Create a post",
        security="Bearer",
    )
    @api.expect(postCreateDto, validate=True)
    @api.response(code=201, model=postDetailsDto, description="Post created successfully")
    @jwt_required()
    def post(self):
        """ Create a post """
        return PostService.add_post(current_user.user_id, api.payload)


@api.route("/logbooks")
class PostLogBooksList(Resource):
    @api.doc(
        "Get all logbook posts",
        responses={
            200: ("List of logbook posts successfully sent", postListReadDto),
        },
        parser=logbook_parser,
    )
    def get(self):
        """ Get all logbook posts """
        args = logbook_parser.parse_args()
        # Skip empty arguments
        args = {k: v for k, v in args.items() if v is not None}
        return PostService.get_logbook_posts(filter_args=args)


@api.route("/blogs")
class PostBlogsList(Resource):
    @api.doc(
        "Get all blog posts",
        responses={
            200: ("List of blog posts successfully sent", postListReadDto),
        },
        parser=parser,
    )
    def get(self):
        """ Get all blog posts """
        args = parser.parse_args()
        post_type = args.get("post_type")

        return PostService.get_blog_posts(post_type=post_type)


@api.route("/<int:post_id>/like")
class PostLike(Resource):
    @api.doc(
        "Like a post",
        responses={
            201: ("Post liked"),
            400: "Post already liked",
            404: "Post not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    def post(self, post_id):
        """ Like a post """
        return PostService.like_post(current_user.user_id, post_id)

    @api.doc(
        "Unlike a post",
        responses={
            200: ("Post unliked"),
            400: "Post not liked",
            404: "Post not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    def delete(self, post_id):
        """ Unlike a post """
        return PostService.unlike_post(current_user.user_id, post_id)


@api.route("/<int:post_id>/bookmark")
class PostBookmark(Resource):
    @api.doc(
        "Bookmark a post",
        responses={
            201: ("Post bookmarked"),
            404: "Post not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    def post(self, post_id):
        """ Bookmark a post """
        return PostService.bookmark_post(current_user.user_id, post_id)

    @api.doc(
        "Unbookmark a post",
        responses={
            200: ("Post unbookmarked"),
            404: "Post not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    def delete(self, post_id):
        """ Unbookmark a post """
        return PostService.unbookmark_post(current_user.user_id, post_id)


@api.route("/<int:post_id>/comment")
class PostComments(Resource):
    @api.doc(
        "Comment a post",
        responses={
            201: ("Post commented", commentReadDto),
            404: "Post not found!",
        },
        security="Bearer",
    )
    @jwt_required()
    @api.expect(commentCreateDto, validate=True)
    def post(self, post_id):
        """ Comment a post """
        return PostService.comment_post(current_user.user_id, post_id, api.payload)
