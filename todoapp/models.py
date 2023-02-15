from django.core.validators import URLValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from userapp.models import CustomUser


class Project(models.Model):
    name = models.CharField(
        max_length=60,
        help_text=_("Project name"),
        unique=True,
        error_messages={
            "unique": _("A project with same name already exists."),
        },
    )
    repo_link = models.URLField(help_text=_("Repository link"), validators=[URLValidator])
    participants = models.ManyToManyField(
        CustomUser,
        help_text=_("List of participants"),
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("project")
        verbose_name_plural = _("projects")


class ToDo(models.Model):
    project = models.ForeignKey(
        Project,
        help_text=_("Project"),
        on_delete=models.PROTECT,
    )
    content = models.TextField(
        max_length=250,
        help_text=_("Content"),
    )
    user_created = models.ForeignKey(
        CustomUser,
        help_text=_("Creator (author)"),
        on_delete=models.PROTECT,
    )
    date_created = models.DateTimeField(
        help_text=_("Creation date"),
        auto_now_add=True,
    )
    date_updated = models.DateTimeField(
        help_text=_("Last update date"),
        auto_now=True,
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_("Status: To Do is active (not closed)."),
    )

    class Meta:
        verbose_name = _("ToDo")
        verbose_name_plural = _("ToDos")
