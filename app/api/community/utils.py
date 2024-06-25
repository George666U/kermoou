def load_data(community_db_obj):
    """ Load community's data

    Parameters:
    - Community db object
    """
    from app.models.schemas import CommunitySchema

    community_schema = CommunitySchema()

    data = community_schema.dump(community_db_obj)

    return data
