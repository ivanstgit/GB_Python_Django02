from rest_framework import mixins
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import GenericViewSet

from .models import CustomUser
from .serializers import CustomUserModelSerializer


class CustomUserModelViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    GenericViewSet,
):
    lookup_field = "username"
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserModelSerializer
    pagination_class = PageNumberPagination
