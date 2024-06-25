from flask import current_app
from flask_restx import marshal

from app.utils import err_resp, message, internal_err_resp
from app.models import Post, PostLike, PostComment, PostBookmark, PostImage, CommunityUser

from .dtos.postCreateDto import postCreateDto, commentCreateDto
from .dtos.postDetailsDto import postDetailsDto
from .dtos.postReadDto import postListReadDto, commentReadDto


class PostService:
    @staticmethod
    def get_post_data(post_id):
        """ Get post data """
        try:
            if not (post := Post.query.get(post_id)):
                return err_resp('Post not found', 'post_not_found', 404)

            return marshal(post, postDetailsDto), 200
        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()

    @staticmethod
    def get_posts(post_type=None):
        """ Get posts """
        try:
            if post_type:
                posts = Post.query.filter_by(
                    post_type=post_type).order_by(Post.created_at.desc()).all()
            else:
                posts = Post.query.order_by(Post.created_at.desc()).all()

            return marshal({'posts': posts}, postListReadDto), 200

        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()

    @staticmethod
    def get_logbook_posts(filter_args=None):
        """ Get logbook posts """
        try:
            print(filter_args)
            if filter_args:
                posts = Post.query.filter_by(post_type='logbook').join(
                    Post.car).filter_by(**filter_args).order_by(Post.created_at.desc()).all()
            else:
                posts = Post.query.filter_by(
                    post_type='logbook').order_by(Post.created_at.desc()).all()

            return marshal({'posts': posts}, postListReadDto), 200

        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()

    @staticmethod
    def get_blog_posts(post_type=None):
        """ Get blog posts """
        try:
            # not lokbooks and post type
            if post_type:
                posts = Post.query.filter_by(
                    post_type=post_type).order_by(Post.created_at.desc()).all()
            else:
                posts = Post.query.filter(Post.post_type != 'logbook').order_by(
                    Post.created_at.desc()).all()

            return marshal({'posts': posts}, postListReadDto), 200

        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()

    @ staticmethod
    def add_post(user_id, data):
        """ Add post """
        try:
            # Check if user is a member of the community
            if data.get('community_id'):
                if not CommunityUser.query.filter_by(user_id=user_id, community_id=data.get('community_id')).first():
                    return err_resp('User is not a member of the community', 'not_community_member', 400)

            new_post = Post(
                user_id=user_id,
                community_id=data.get('community_id'),
                post_type=data.get('post_type'),
                title=data.get('title'),
                content=data.get('content'),
                car_id=data.get('car_id')
            )

            new_post.save()

            post = Post.query.get(new_post.post_id)

            for image_url in data.get('images'):
                PostImage(post_id=post.post_id, image_url=image_url).save()

            post = Post.query.get(new_post.post_id)

            return marshal(post, postDetailsDto), 201

        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()

    @ staticmethod
    def like_post(user_id, post_id):
        """ Like post """
        if not (post := Post.query.get(post_id)):
            return err_resp('Post not found', 'post_not_found', 404)

        if PostLike.query.filter_by(user_id=user_id, post_id=post_id).first():
            return err_resp('Post already liked', 'post_already_liked', 400)

        try:
            new_like = PostLike(user_id=user_id, post_id=post_id)
            new_like.save()

            resp = message(True, 'Post liked')
            return resp, 201

        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()

    @ staticmethod
    def unlike_post(user_id, post_id):
        """ Unlike post """
        if not (post := Post.query.get(post_id)):
            return err_resp('Post not found', 'post_not_found', 404)

        if not (like := PostLike.query.filter_by(user_id=user_id, post_id=post_id).first()):
            return err_resp('Post not liked', 'post_not_liked', 400)

        try:
            like.delete()

            resp = message(True, 'Post unliked')
            return resp, 200

        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()

    @ staticmethod
    def comment_post(user_id, post_id, data):
        """ Comment post """
        try:
            if not (post := Post.query.get(post_id)):
                return err_resp('Post not found', 'post_not_found', 404)

            new_comment = PostComment(
                user_id=user_id,
                post_id=post_id,
                content=data.get('content')
            )

            new_comment.save()

            comment = PostComment.query.get(new_comment.comment_id)

            return marshal(comment, commentReadDto), 201

        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()

    @ staticmethod
    def bookmark_post(user_id, post_id):
        """ Bookmark post """
        if not (post := Post.query.get(post_id)):
            return err_resp('Post not found', 'post_not_found', 404)

        if PostBookmark.query.filter_by(user_id=user_id, post_id=post_id).first():
            return err_resp('Post already bookmarked', 'post_already_bookmarked', 400)

        try:
            new_bookmark = PostBookmark(user_id=user_id, post_id=post_id)
            new_bookmark.save()

            resp = message(True, 'Post bookmarked')
            return resp, 201

        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()

    @ staticmethod
    def unbookmark_post(user_id, post_id):
        """ Unbookmark post """
        if not (post := Post.query.get(post_id)):
            return err_resp('Post not found', 'post_not_found', 404)

        if not (bookmark := PostBookmark.query.filter_by(user_id=user_id, post_id=post_id).first()):
            return err_resp('Post not bookmarked', 'post_not_bookmarked', 400)

        try:
            bookmark.delete()

            resp = message(True, 'Post unbookmarked')
            return resp, 200

        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()

    @ staticmethod
    def delete_post(user_id, post_id):
        """ Delete post """
        if not (post := Post.query.get(post_id)):
            return err_resp('Post not found', 'post_not_found', 404)

        if post.user_id != user_id:
            return err_resp('Unauthorized action', 'unauthorized', 403)

        try:
            post.delete()

            resp = message(True, 'Post deleted')
            return resp, 200

        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()
