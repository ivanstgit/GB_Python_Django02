# Generated by Django 3.2.17 on 2023-02-05 18:56

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("userapp", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="is_staff",
            field=models.BooleanField(
                default=False,
                help_text="Designates whether the user can log into this admin site.",
                verbose_name="staff status",
            ),
        ),
    ]
