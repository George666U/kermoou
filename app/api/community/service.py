from flask import current_app
from flask_restx import marshal

from app.utils import err_resp, message, internal_err_resp
from app.models import Community, CommunityUser

from .dtos.communityReadDto import communityListReadDto, communityReadDto
from .dtos.communityDetailsDto import communityDetailsDto
from .dtos.communityCreateDto import communityCreateDto, communityUpdateDto


class CommunityService:
    @staticmethod
    def get_community_data(community_id):
        """ Get community data """
        try:
            community = Community.query.filter_by(
                community_id=community_id).first()

            if not community:
                return err_resp("Community not found!", "community_404", 404)

            return marshal(community, communityDetailsDto), 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def get_communities(search=None):
        """ Get communities """
        try:
            if search:
                communities = Community.query.filter(
                    Community.title.ilike(f"%{search}%")).all()
            else:
                communities = Community.query.all()

            return marshal({"communities": communities}, communityListReadDto), 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def add_community(user_id, data):
        """ Add community """
        try:
            new_community = Community(
                user_id=user_id,
                title=data.get("title"),
                profile_picture=data.get("profile_picture"),
                about=data.get("about"),
            )

            new_community.save()

            # Add user as a member of the community
            new_community_user = CommunityUser(
                user_id=user_id, community_id=new_community.community_id
            )

            new_community_user.save()

            community = Community.query.get(new_community.community_id)

            return marshal(community, communityReadDto), 201

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def update_community(user_id, community_id, data):
        """ Update community """
        try:
            if not (community := Community.query.filter_by(community_id=community_id).first()):
                return err_resp("Community not found!", "community_404", 404)

            if community.user_id != user_id:
                return err_resp("Unauthorized action!", "unauthorized", 403)

            community.update(**data)

            updated_community = Community.query.get(community_id)

            return marshal(updated_community, communityReadDto), 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def delete_community(user_id, community_id):
        """ Delete community """
        if not (community := Community.query.filter_by(community_id=community_id).first()):
            return err_resp("Community not found!", "community_404", 404)

        if community.user_id != user_id:
            return err_resp("Unauthorized action!", "unauthorized", 403)

        try:
            community.delete()

            resp = message(True, "Community deleted")
            return resp, 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def join_community(user_id, community_id):
        """ Join community """
        try:
            if not (community := Community.query.filter_by(community_id=community_id).first()):
                return err_resp("Community not found!", "community_404", 404)

            # Check if user is already a member of the community
            if CommunityUser.query.filter_by(user_id=user_id, community_id=community_id).first():
                return err_resp("User is already a member of the community!", "already_member", 400)

            new_community_user = CommunityUser(
                user_id=user_id, community_id=community_id
            )

            new_community_user.save()

            resp = message(True, "User joined the community")
            return resp, 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def leave_community(user_id, community_id):
        """ Leave community """
        try:
            if not (community := Community.query.filter_by(community_id=community_id).first()):
                return err_resp("Community not found!", "community_404", 404)

            if not (community_user := CommunityUser.query.filter_by(user_id=user_id, community_id=community_id).first()):
                return err_resp("User is not a member of the community!", "not_member", 400)

            # Check if user is the owner of the community
            if community.user_id == user_id:
                return err_resp("Owner of the community cannot leave the community!", "owner_leave", 400)

            community_user.delete()

            resp = message(True, "User left the community")
            return resp, 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()
