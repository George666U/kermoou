from flask_admin.contrib.sqla import ModelView
from flask_admin.form import Select2Widget
from wtforms import SelectField


def config_admin(admin):
    from app.extensions import db
    from app.models import User, UserCar, Community, CommunityUser, PostLike, PostComment, Post, PostBookmark

    class BaseModelView(ModelView):
        column_display_pk = True
        column_hide_backrefs = False
        column_auto_select_related = True
        column_display_all_relations = True

    class UserView(BaseModelView):
        # Exclude columns from the list view
        column_exclude_list = ['password', 'password_hash']
        # Exclude columns from the create/edit form
        form_excluded_columns = ['password_hash',
                                 'created_at', 'role_id']
        # Enable searching by username and email
        column_searchable_list = ['username', 'email']
        # Customize column labels
        column_labels = dict(username='Username', email='Email Address')

    class CarView(BaseModelView):
        # Exclude columns from the create/edit form
        form_excluded_columns = ['created_at']
        form_extra_fields = {
            # Add a SelectField for user_id
            'user_id': SelectField('User', coerce=int, widget=Select2Widget()),
        }

        def create_form(self, obj=None):
            form = super().create_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            return form

        def edit_form(self, obj=None):
            form = super().edit_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            return form

    class CommunityView(BaseModelView):
        # Enable searching by title
        column_searchable_list = ['title']
        # Customize column labels
        column_labels = dict(title='Community Title')

        # Exclude columns from the create/edit form
        form_excluded_columns = ['created_at']
        form_extra_fields = {
            # Add a SelectField for user_id
            'user_id': SelectField('Creator', coerce=int, widget=Select2Widget())
        }

        def create_form(self, obj=None):
            form = super().create_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            return form

        def edit_form(self, obj=None):
            form = super().edit_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            return form

    class CommunityUserView(BaseModelView):
        # Exclude columns from the create/edit form
        form_excluded_columns = ['created_at']
        form_extra_fields = {
            # Add a SelectField for user_id
            'user_id': SelectField('User', coerce=int, widget=Select2Widget()),
            'community_id': SelectField('Community', coerce=int, widget=Select2Widget())
        }

        column_list = ['user_id', 'user_username',
                       'community_id', 'community_title']

        def create_form(self, obj=None):
            form = super().create_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            form.community_id.choices = [(community.community_id, community.title)
                                         for community in Community.query.all()]
            return form

        def edit_form(self, obj=None):
            form = super().edit_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            form.community_id.choices = [(community.community_id, community.title)
                                         for community in Community.query.all()]
            return form

    class PostView(BaseModelView):
        # Enable searching by title
        column_searchable_list = ['title']
        # Customize column labels
        column_labels = dict(title='Post Title')

        # Exclude columns from the create/edit form
        form_excluded_columns = ['created_at']
        form_extra_fields = {
            # Add a SelectField for user_id
            'user_id': SelectField('Author', coerce=int, widget=Select2Widget()),
            'community_id': SelectField('Community', coerce=int, widget=Select2Widget()),
            'car_id': SelectField('Car', coerce=int, widget=Select2Widget())
        }

        def create_form(self, obj=None):
            form = super().create_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            form.community_id.choices = [(community.community_id, community.title)
                                         for community in Community.query.all()]
            form.car_id.choices = [(car.car_id, f'{car.car_make} {car.car_model}')
                                   for car in UserCar.query.all()]
            return form

        def edit_form(self, obj=None):
            form = super().edit_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            form.community_id.choices = [(community.community_id, community.title)
                                         for community in Community.query.all()]
            form.car_id.choices = [(car.car_id, f'{car.car_make} {car.car_model}')
                                   for car in UserCar.query.all()]

            return form

    class PostLikeView(BaseModelView):
        # Exclude columns from the create/edit form
        form_excluded_columns = ['created_at']
        form_extra_fields = {
            # Add a SelectField for user_id
            'user_id': SelectField('User', coerce=int, widget=Select2Widget()),
            'post_id': SelectField('Post', coerce=int, widget=Select2Widget())
        }

        column_list = ['user_id', 'user_username', 'post_id']

        def create_form(self, obj=None):
            form = super().create_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            form.post_id.choices = [(post.post_id, post.title)
                                    for post in Post.query.all()]
            return form

        def edit_form(self, obj=None):
            form = super().edit_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            form.post_id.choices = [(post.post_id, post.title)
                                    for post in Post.query.all()]
            return form

    class PostCommentView(BaseModelView):
        # Exclude columns from the create/edit form
        form_excluded_columns = ['created_at']
        form_extra_fields = {
            # Add a SelectField for user_id
            'user_id': SelectField('User', coerce=int, widget=Select2Widget()),
            'post_id': SelectField('Post', coerce=int, widget=Select2Widget())
        }

        column_list = ['user_id', 'user_username',
                       'post_id', 'post_title', 'content']

        def create_form(self, obj=None):
            form = super().create_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            form.post_id.choices = [(post.post_id, post.title)
                                    for post in Post.query.all()]
            return form

        def edit_form(self, obj=None):
            form = super().edit_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            form.post_id.choices = [(post.post_id, post.title)
                                    for post in Post.query.all()]
            return form

    class PostBookmarkView(BaseModelView):
        # Exclude columns from the create/edit form
        form_excluded_columns = ['created_at']
        form_extra_fields = {
            # Add a SelectField for user_id
            'user_id': SelectField('User', coerce=int, widget=Select2Widget()),
            'post_id': SelectField('Post', coerce=int, widget=Select2Widget())
        }

        column_list = ['user_id', 'user_username', 'post_id', 'post_title']

        def create_form(self, obj=None):
            form = super().create_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            form.post_id.choices = [(post.post_id, post.title)
                                    for post in Post.query.all()]
            return form

        def edit_form(self, obj=None):
            form = super().edit_form(obj)
            form.user_id.choices = [(user.user_id, user.username)
                                    for user in User.query.all()]
            form.post_id.choices = [(post.post_id, post.title)
                                    for post in Post.query.all()]
            return form

    admin.add_view(UserView(User, db.session))
    admin.add_view(CarView(UserCar, db.session))
    admin.add_view(CommunityView(Community, db.session))
    admin.add_view(CommunityUserView(CommunityUser, db.session))
    admin.add_view(PostView(Post, db.session))
    admin.add_view(PostLikeView(PostLike, db.session))
    admin.add_view(PostCommentView(PostComment, db.session))
    admin.add_view(PostBookmarkView(PostBookmark, db.session))
