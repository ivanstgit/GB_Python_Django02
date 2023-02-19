from django_filters import rest_framework as filters
from django_filters.widgets import DateRangeWidget  # ModelChoiceField

from .models import Project, ToDo


class ProjectFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="contains")

    class Meta:
        model = Project
        fields = ["name"]


class ToDoFilter(filters.FilterSet):
    # project = ModelChoiceField(queryset=Project.objects.all())
    # project = ProjectFilter()
    project__name = filters.CharFilter(lookup_expr="contains")
    date_created = filters.DateFromToRangeFilter(widget=DateRangeWidget(attrs={"placeholder": "YYYY-MM-DD"}))

    class Meta:
        model = ToDo
        fields = ["project", "project__name", "date_created"]
