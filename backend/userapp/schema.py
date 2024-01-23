from graphene import types as gt
from graphene_django import DjangoObjectType

from userapp.models import CustomUser


class UserType(DjangoObjectType):
    class Meta:
        model = CustomUser
        fields = (
            "username",
            "first_name",
            "last_name",
            "email",
            "is_superuser",
            "is_staff",
        )

    @classmethod
    def get_queryset(cls, queryset, info):
        if info.context.user.is_anonymous:
            return None
        return queryset.filter(is_superuser=False)


class Query(gt.ObjectType):
    users_all = gt.List(UserType)

    def resolve_users_all(root, info):
        return CustomUser.objects.all()
