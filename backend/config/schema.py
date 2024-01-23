import graphene
import graphql_jwt

from django.contrib.auth.mixins import LoginRequiredMixin
from graphene_django.views import GraphQLView


import todoapp.schema as todo_schema
import userapp.schema as user_schema


class PrivateGraphQLView(LoginRequiredMixin, GraphQLView):
    login_url = "/admin/"


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


class Query(user_schema.Query, todo_schema.Query, graphene.ObjectType):
    viewer = graphene.Field(user_schema.UserType)

    def resolve_viewer(self, info, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return user


schema = graphene.Schema(query=Query, mutation=Mutation)
