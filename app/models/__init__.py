# Entry point
from app import db, bcrypt

from sqlalchemy.ext.hybrid import hybrid_property


class BaseModel(db.Model):
    __abstract__ = True

    created_at = db.Column(db.TIMESTAMP, nullable=False,
                           server_default=db.func.now())

    # def __init__(self, **kwargs):
    #     super(BaseModel, self).__init__(**kwargs)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()


class Permission:
    FOLLOW = 1
    COMMENT = 2
    WRITE = 4
    MODERATE = 8
    ADMIN = 16


class Role(BaseModel):
    __tablename__ = "roles"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    default = db.Column(db.Boolean, default=False, index=True)
    permissions = db.Column(db.Integer)
    description = db.Column(db.String(50))

    users = db.relationship("User", backref="role", lazy="dynamic")

    def __init__(self, **kwargs):
        super(Role, self).__init__(**kwargs)
        if self.permissions is None:
            self.permissions = 0

    def __repr__(self):
        return f"<{self.name} - {self.id}>"

    @staticmethod
    def insert_roles():
        roles = {
            "User": [Permission.FOLLOW, Permission.COMMENT, Permission.WRITE],
            "Admin": [
                Permission.FOLLOW,
                Permission.COMMENT,
                Permission.WRITE,
                Permission.MODERATE,
                Permission.ADMIN,
            ],
        }

        default_role = "User"
        for r in roles:
            role = Role.query.filter_by(name=r).first()
            if role is None:
                role = Role(name=r)

    def has_permission(self, perm):
        return self.permissions & perm == perm

    def add_permission(self, perm):
        if not self.has_permission(perm):
            self.permissions += perm

    def remove_permission(self, perm):
        if self.has_permission(perm):
            self.permissions -= perm

    def reset_permission(self):
        self.permissions = 0


class User(BaseModel):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(64))
    password_hash = db.Column(db.String(128))
    email = db.Column(db.String(100), unique=True, nullable=False)
    profile_picture = db.Column(db.String(255))
    about = db.Column(db.Text)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"))

    # Define relationships
    cars = db.relationship('UserCar', back_populates='user', lazy=True)
    communities = db.relationship(
        'Community', secondary='community_users', back_populates='members', lazy=True)
    posts = db.relationship('Post', back_populates='author', lazy=True)
    bookmarks = db.relationship(
        'Post', secondary='post_bookmarks', back_populates='bookmarked_by', lazy=True)
    created_communities = db.relationship(
        'Community', back_populates='creator', lazy=True)

    post_likes = db.relationship('PostLike', back_populates='user', lazy=True)
    post_comments = db.relationship(
        'PostComment', back_populates='user', lazy=True)
    post_bookmarks = db.relationship(
        'PostBookmark', back_populates='user', lazy=True)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

    @property
    def password(self):
        raise AttributeError("Password is not a readable attribute")

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.generate_password_hash(
            password).decode("utf-8")

    def verify_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"

    def __unicode__(self):
        return self.username


class UserCar(BaseModel):
    __tablename__ = 'user_cars'

    car_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.user_id'), nullable=False)
    car_make = db.Column(db.String(100), nullable=False)
    car_model = db.Column(db.String(100))
    car_year = db.Column(db.Integer, nullable=False)
    profile_picture = db.Column(db.String(255))
    mileage = db.Column(db.Integer)
    color = db.Column(db.String(50))
    buy_year = db.Column(db.Integer)
    engine_type = db.Column(db.String(20))
    engine_displacement = db.Column(db.Integer)
    engine_power = db.Column(db.Integer)
    transmission_type = db.Column(db.String(20))
    drive_type = db.Column(db.String(20))
    license_plate = db.Column(db.String(20))
    about = db.Column(db.Text)

    # Define relationships
    user = db.relationship('User', back_populates='cars', lazy=True)
    posts = db.relationship('Post', back_populates='car', lazy=True)

    @hybrid_property
    def post_count(self):
        return len(self.posts)

    def __init__(self, **kwargs):
        super(UserCar, self).__init__(**kwargs)

    def __repr__(self):
        return f"<UserCar {self.car_make} {self.car_model} {self.car_year}>"

    def __unicode__(self):
        return f"user_id: {self.user_id} {self.car_make} {self.car_model} {self.car_year}"


class Community(BaseModel):
    __tablename__ = 'communities'

    community_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.user_id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    profile_picture = db.Column(db.String(255))
    about = db.Column(db.Text)

    # Define relationships
    members = db.relationship(
        'User', secondary='community_users', back_populates='communities', lazy=True)
    creator = db.relationship(
        'User', back_populates='created_communities', lazy=True)
    posts = db.relationship('Post', back_populates='community', lazy=True)

    @hybrid_property
    def member_count(self):
        return len(self.members)


class CommunityUser(BaseModel):
    __tablename__ = 'community_users'

    community_id = db.Column(db.Integer, db.ForeignKey(
        'communities.community_id', ondelete='CASCADE'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.user_id', ondelete='CASCADE'), primary_key=True)

    # Define relationships
    # user = db.relationship('User', lazy=True)
    # community = db.relationship('Community', lazy=True)

    @hybrid_property
    def user_username(self):
        return self.user.username

    @hybrid_property
    def community_title(self):
        return self.community.title


class Post(BaseModel):
    __tablename__ = 'posts'

    post_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.user_id'), nullable=False)
    community_id = db.Column(
        db.Integer, db.ForeignKey('communities.community_id', ondelete='SET NULL'), nullable=True)
    post_type = db.Column(db.String(50), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey(
        'user_cars.car_id', ondelete='SET NULL'), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)

    # Define relationships
    author = db.relationship('User', back_populates='posts', lazy=True)
    car = db.relationship('UserCar', back_populates='posts', lazy=True)
    community = db.relationship('Community', back_populates='posts', lazy=True)

    bookmarked_by = db.relationship(
        'User', secondary='post_bookmarks', back_populates='bookmarks', lazy=True)
    images = db.relationship('PostImage', lazy=True)
    likes = db.relationship('PostLike', back_populates='post', lazy=True)
    comments = db.relationship('PostComment', back_populates='post', lazy=True)
    bookmarks = db.relationship(
        'PostBookmark', back_populates='post', lazy=True)

    @hybrid_property
    def author_username(self):
        return self.author.username

    @hybrid_property
    def like_count(self):
        return len(self.likes)

    @hybrid_property
    def comment_count(self):
        return len(self.comments)

    def __repr__(self):
        return f"<Post {self.post_id} {self.title}>"

    def __unicode__(self):
        return f"{self.title} {self.content}"


class PostImage(BaseModel):
    __tablename__ = "post_images"

    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    post_id = db.Column(db.Integer, db.ForeignKey(
        'posts.post_id', ondelete='CASCADE'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    # description = db.Column(db.String(255))

    def __repr__(self):
        return f"<PostImage {self.post_id} {self.image_url}>"

    def __unicode__(self):
        return f"{self.post_id} {self.image_url}"


class PostLike(BaseModel):
    __tablename__ = 'post_likes'

    post_id = db.Column(db.Integer, db.ForeignKey(
        'posts.post_id', ondelete='CASCADE'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.user_id'), primary_key=True)

    # Define relationships
    post = db.relationship('Post', lazy=True)
    user = db.relationship('User', lazy=True)

    @ hybrid_property
    def user_username(self):
        return self.user.username

    @ hybrid_property
    def post_title(self):
        return self.post.title


class PostComment(BaseModel):
    __tablename__ = 'post_comments'

    comment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    post_id = db.Column(db.Integer, db.ForeignKey(
        'posts.post_id', ondelete='CASCADE'),  nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.user_id'), nullable=False)
    content = db.Column(db.Text, nullable=False)

    # Define relationships
    post = db.relationship('Post', lazy=True)
    user = db.relationship('User', lazy=True)

    @ hybrid_property
    def user_username(self):
        return self.user.username

    @ hybrid_property
    def post_title(self):
        return self.post.title


class PostBookmark(BaseModel):
    __tablename__ = 'post_bookmarks'

    post_id = db.Column(db.Integer, db.ForeignKey(
        'posts.post_id', ondelete='CASCADE'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.user_id'), primary_key=True)

    # Define relationships
    post = db.relationship('Post', lazy=True)
    user = db.relationship('User', lazy=True)

    @ hybrid_property
    def user_username(self):
        return self.user.username

    @ hybrid_property
    def post_title(self):
        return self.post.title
