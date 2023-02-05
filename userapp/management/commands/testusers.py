# create or delete must be set
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

MODES = ["create", "delete"]

TEST_USERS = [
    {
        "username": "testuser001",
        "password": "testuser_P$wD!",
        "first_name": "test",
        "last_name": "user 001",
        "email": "testuser001@ru.ru",
        "is_superuser": False,
        "is_staff": True,
    },
    {
        "username": "testuser002",
        "password": "testuser_P$wD!",
        "first_name": "test",
        "last_name": "user 002",
        "email": "testuser002@ru.ru",
        "is_superuser": False,
        "is_staff": False,
    },
]


class Command(BaseCommand):
    help = "This command using for creating (default) and deleting (-m delete) test_users"

    def add_arguments(self, parser):
        parser.add_argument(
            "--password",
            dest="pwd",
            help="Delete poll instead of closing it",
        )
        parser.add_argument(
            "-m",
            "--mode",
            choices=MODES,
            default=MODES[0],
            dest="mode",
            help="Delete poll instead of closing it",
        )

    def handle(self, *args, **options):
        user_model = get_user_model()

        if options.get("mode") == MODES[0]:
            for tuser in TEST_USERS:
                uname = tuser.get("username")
                try:
                    user = user_model.objects.get_by_natural_key(uname)
                    self.stdout.write(self.style.WARNING(f"User {uname} already exists, skipped"))
                except user_model.DoesNotExist:
                    # user_model.objects.create_superuser #наверно, тут есть специфика, не стал делать

                    password = options.get("pwd")
                    if not password:
                        password = tuser.get("password")
                    user = user_model.objects.create_user(
                        username=uname, email=tuser.get("email"), password=tuser.get("password")
                    )
                    user.first_name = tuser.get("first_name")
                    user.last_name = tuser.get("last_name")
                    user.is_superuser = tuser.get("is_superuser")
                    user.is_staff = tuser.get("is_staff")
                    user.save()
                    self.stdout.write(self.style.SUCCESS(f"User {uname} created succsessfully"))
        elif options.get("mode") == MODES[1]:
            for tuser in TEST_USERS:
                uname = tuser.get("username")
                try:
                    user = user_model.objects.get_by_natural_key(
                        uname,
                    )
                    user.delete()
                    self.stdout.write(self.style.SUCCESS(f"User {uname} deleted succsessfully"))
                except user_model.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"User {uname} doesn't exists, skipped"))
