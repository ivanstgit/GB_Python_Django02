from graphene import types as gt
from graphene_django import DjangoObjectType

from todoapp.models import Project, ToDo


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = ("name", "repo_link", "participants")

    @classmethod
    def get_queryset(cls, queryset, info):
        if info.context.user.is_anonymous:
            return None
        return queryset


class ToDoType(DjangoObjectType):
    class Meta:
        model = ToDo
        fields = (
            "id",
            "project",
            "content",
            "user_created",
            "date_created",
            "date_updated",
        )

    @classmethod
    def get_queryset(cls, queryset, info):
        if info.context.user.is_anonymous:
            return None
        return queryset


class Query(gt.ObjectType):
    projects_all = gt.List(ProjectType)

    todos_all = gt.List(ToDoType)
    todos_by_project_name = gt.List(ToDoType, project_name=gt.String(required=True))

    def resolve_projects_all(root, info):
        return Project.objects.all()

    def resolve_todos_all(root, info):
        return ToDo.objects.all()

    def resolve_todos_by_project_name(root, info, project_name):
        return ToDo.objects.filter(project__name=project_name)
