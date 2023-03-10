# Generated by Django 3.2.17 on 2023-02-15 18:30

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "name",
                    models.CharField(
                        error_messages={"unique": "A project with same name already exists."},
                        help_text="Project name",
                        max_length=60,
                        unique=True,
                    ),
                ),
                (
                    "repo_link",
                    models.URLField(help_text="Repository link", validators=[django.core.validators.URLValidator]),
                ),
                ("participants", models.ManyToManyField(help_text="List of participants", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "verbose_name": "project",
                "verbose_name_plural": "projects",
            },
        ),
        migrations.CreateModel(
            name="ToDo",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("content", models.TextField(help_text="Content", max_length=250)),
                ("date_created", models.DateTimeField(auto_now_add=True, help_text="Creation date")),
                ("date_updated", models.DateTimeField(auto_now=True, help_text="Last update date")),
                (
                    "is_active",
                    models.BooleanField(
                        default=True, help_text="Status: To Do is active (not closed).", verbose_name="active"
                    ),
                ),
                (
                    "project",
                    models.ForeignKey(
                        help_text="Project", on_delete=django.db.models.deletion.PROTECT, to="todoapp.project"
                    ),
                ),
                (
                    "user_created",
                    models.ForeignKey(
                        auto_created=True,
                        help_text="Creator (author)",
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "ToDo",
                "verbose_name_plural": "ToDos",
            },
        ),
    ]
