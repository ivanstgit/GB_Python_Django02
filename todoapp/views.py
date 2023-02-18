from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet

from .filters import ProjectFilter, ToDoFilter
from .models import Project, ToDo
from .serializers import ProjectModelSerializer, ToDoModelSerializer


class ProjectPageNumberPagination(PageNumberPagination):
    default_limit = 10


class ProjectModelViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer
    pagination_class = ProjectPageNumberPagination
    filterset_class = ProjectFilter


class ToDoPageNumberPagination(PageNumberPagination):
    default_limit = 20


class ToDoModelViewSet(ModelViewSet):
    queryset = ToDo.objects.filter(is_active=True)
    serializer_class = ToDoModelSerializer
    pagination_class = ToDoPageNumberPagination
    filterset_class = ToDoFilter

    # def perform_create(self, serializer):
    #     request = serializer.context["request"]
    #     serializer.save( user_created = request.user )
