# Create your tests here.
import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import (
    APIRequestFactory,
    force_authenticate,
    APIClient,
    APISimpleTestCase,
    APITestCase,
)

from mixer.backend.django import mixer
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission

from userapp.management.commands.usergroups import USER_GROUPS

from .views import ProjectModelViewSet, ToDoModelViewSet
from .models import Project, ToDo

test_user_admin_data = {
    "username": "testAdminZ",
    "password": "testuser_P$wD!",
    "first_name": "test",
    "last_name": "Dev",
    "email": "testAdminZ@ru.ru",
    "is_superuser": False,
    "is_staff": False,
}
test_user_admin_groups_data = ["Administrators"]


test_user_po_data = {
    "username": "testProjectOwnerZ",
    "password": "testuser_P$wD!",
    "first_name": "test",
    "last_name": "PO",
    "email": "testProjectOwnerZ@ru.ru",
    "is_superuser": False,
    "is_staff": False,
}
test_user_po_groups_data = ["ProjectOwners"]

test_user_dev_data = {
    "username": "testDeveloperZ",
    "password": "testuser_P$wD!",
    "first_name": "test",
    "last_name": "Dev",
    "email": "testDeveloperZ@ru.ru",
    "is_superuser": False,
    "is_staff": False,
}
test_user_dev_groups_data = ["Developers"]


class TestProjectModelViewSet(TestCase):
    """Example for Base class TestCase"""

    def setUp(self) -> None:
        self.factory = APIRequestFactory()
        self.client = APIClient()
        self.url = "/api/projects/"

        self.user_model = get_user_model()

        for group, permissions in USER_GROUPS.items():
            g, _ = Group.objects.get_or_create(name=group)
            for perm in permissions:
                p = Permission.objects.get(codename=perm)
                if p:
                    g.permissions.add(p)

        try:
            self.test_user_admin = self.user_model.objects.get_by_natural_key(
                test_user_admin_data.get("username")
            )
        except self.user_model.DoesNotExist:
            self.test_user_admin = self.user_model.objects.create_user(
                **test_user_admin_data
            )
            for group_name in test_user_admin_groups_data:
                group = Group.objects.get(name=group_name)
                self.test_user_admin.groups.add(group)

        try:
            self.test_user_po = self.user_model.objects.get_by_natural_key(
                test_user_po_data.get("username")
            )
        except self.user_model.DoesNotExist:
            self.test_user_po = self.user_model.objects.create_user(**test_user_po_data)
            for group_name in test_user_po_groups_data:
                group = Group.objects.get(name=group_name)
                self.test_user_po.groups.add(group)

        try:
            self.test_user_dev = self.user_model.objects.get_by_natural_key(
                test_user_dev_data.get("username")
            )
        except self.user_model.DoesNotExist:
            self.test_user_dev = self.user_model.objects.create_user(
                **test_user_dev_data
            )
            for group_name in test_user_dev_groups_data:
                group = Group.objects.get(name=group_name)
                self.test_user_dev.groups.add(group)

        self.test_project1_data = {
            "name": "Тест проект 1",
            "repo_link": "http://fewfef.dfdf.ru",
        }

        self.test_project1_data2 = {
            "name": "Тест проект 1",
            "repo_link": "http://fewfef2.dfdf.ru",
            "participants": [self.test_user_po.username],
        }

        self.test_project2_data = {
            "name": "Тест проект 2",
            "repo_link": "http://fewfef55.dfdf.ru",
            "participants": [
                self.test_user_po.username,
                self.test_user_dev.username,
            ],
        }

        self.project1 = Project.objects.create(**self.test_project1_data)
        self.project1.participants.add(self.test_user_po.id)
        self.project1.participants.add(self.test_user_dev.id)

        return super().setUp()

    def test_get_list(self) -> None:
        """API Factory"""
        request = self.factory.get(self.url)
        view = ProjectModelViewSet.as_view({"get": "list"})

        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        force_authenticate(request, self.test_user_admin)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        force_authenticate(request, self.test_user_po)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        force_authenticate(request, self.test_user_dev)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create(self):
        """API Factory"""
        request = self.factory.post(self.url, self.test_project2_data, format="json")
        view = ProjectModelViewSet.as_view({"post": "create"})

        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        force_authenticate(request, self.test_user_po)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update(self):
        """API Client"""
        test_url = f"{self.url}{self.project1.id}/"
        response = self.client.put(test_url, self.test_project1_data2, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_login(self.test_user_po)
        # self.client.login(self.test_user_po)
        response = self.client.put(test_url, self.test_project1_data2, format="json")
        self.client.logout()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        prj = Project.objects.get(id=self.project1.id)
        self.assertEqual(
            prj.participants.count(), len(self.test_project1_data2.get("participants"))
        )

    def tearDown(self) -> None:
        self.client.logout()
        self.test_user_admin.delete()
        self.test_user_po.delete()
        self.test_user_dev.delete()
        return super().tearDown()


class TestToDoModelViewSet(APITestCase):
    """Example for Base class APITestCase (client included)"""

    def setUp(self) -> None:
        self.url = "/api/todos/"

        self.user_model = get_user_model()

        for group, permissions in USER_GROUPS.items():
            g, _ = Group.objects.get_or_create(name=group)
            for perm in permissions:
                p = Permission.objects.get(codename=perm)
                if p:
                    g.permissions.add(p)

        try:
            self.test_user_admin = self.user_model.objects.get_by_natural_key(
                test_user_admin_data.get("username")
            )
        except self.user_model.DoesNotExist:
            self.test_user_admin = self.user_model.objects.create_user(
                **test_user_admin_data
            )
            for group_name in test_user_admin_groups_data:
                group = Group.objects.get(name=group_name)
                self.test_user_admin.groups.add(group)

        try:
            self.test_user_po = self.user_model.objects.get_by_natural_key(
                test_user_po_data.get("username")
            )
        except self.user_model.DoesNotExist:
            self.test_user_po = self.user_model.objects.create_user(**test_user_po_data)
            for group_name in test_user_po_groups_data:
                group = Group.objects.get(name=group_name)
                self.test_user_po.groups.add(group)

        try:
            self.test_user_dev = self.user_model.objects.get_by_natural_key(
                test_user_dev_data.get("username")
            )
        except self.user_model.DoesNotExist:
            self.test_user_dev = self.user_model.objects.create_user(
                **test_user_dev_data
            )
            for group_name in test_user_dev_groups_data:
                group = Group.objects.get(name=group_name)
                self.test_user_dev.groups.add(group)

        self.test_project1_data = {
            "name": "Тест проект 1",
            "repo_link": "http://fewfef.dfdf.ru",
        }

        self.project1 = Project.objects.create(**self.test_project1_data)
        self.project1.participants.add(self.test_user_po.id)
        self.project1.participants.add(self.test_user_dev.id)

        return super().setUp()

    def test_get_list(self) -> None:
        self.client.force_login(self.test_user_dev)
        response = self.client.get(self.url)
        self.client.logout()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_edit(self):
        todo1 = mixer.blend(ToDo, project__name="name2", content="gggg")
        self.client.force_login(self.test_user_dev)
        response = self.client.patch(
            f"{self.url}{todo1.id}/", {"content": "fgfg"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        todo2 = ToDo.objects.get(id=todo1.id)
        self.assertEqual(todo2.content, "fgfg")
