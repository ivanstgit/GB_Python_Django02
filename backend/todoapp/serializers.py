from rest_framework.serializers import DateTimeField, ModelSerializer, SlugRelatedField

from userapp.views import CustomUserModelViewSet

from .models import Project, ToDo


class ProjectModelSerializer(ModelSerializer):
    participants = SlugRelatedField(
        many=True, slug_field="username", queryset=CustomUserModelViewSet.queryset
    )

    class Meta:
        model = Project
        fields = ["id", "name", "repo_link", "participants"]


class ToDoModelSerializerBase(ModelSerializer):
    date_created = DateTimeField(read_only=True)
    date_updated = DateTimeField(read_only=True)
    # Update users by login in view
    user_created = SlugRelatedField(read_only=True, slug_field="username")

    class Meta:
        model = ToDo
        fields = [
            "id",
            "project",
            "content",
            "user_created",
            "date_created",
            "date_updated",
        ]
        # extra_kwargs = {'user_created': {'default': CurrentUserDefault()}}


class ToDoModelSerializerGet(ToDoModelSerializerBase):
    # Display users by login
    user_created = SlugRelatedField(
        slug_field="username", queryset=CustomUserModelViewSet.queryset
    )

    class Meta:
        model = ToDo

        fields = [
            "id",
            "project",
            "content",
            "user_created",
            "date_created",
            "date_updated",
        ]

        depth = 1

    # # def create(self, validated_data):
    # #     uname = CurrentUserDefault()
    # #     # validated_data["user_created"] = get_user_model().objects.get_by_natural_key(CurrentUserDefault())
    # #     return ToDo(**validated_data)

    # # def create_user_created():
    # #     return get_user_model().objects.get_by_natural_key(CurrentUserDefault())

    # class Meta:
    #     model = ToDo
    #     fields = [
    #         "id",
    #         "project",
    #         "content",
    #         # "is_active",
    #         "user_created",
    #         "date_created",
    #         "date_updated",
    #     ]
    #     # extra_kwargs = {'user_created': {'default': CurrentUserDefault()}}
