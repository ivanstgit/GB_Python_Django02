================================================
Prepare machine
================================================
Prepare back:
poetry install
poetry run python manage.py migrate
poetry run python manage.py createsuperuser

prepare front
npm install axios
npm install react-router-dom
================================================
Prepare dev or test
================================================
backend:
poetry run python manage.py usergroups -m create
poetry run python manage.py testusers -m create
poetry run python manage.py test

Есть 3 вида пользователей: администраторы, разработчики, владельцы проектов.
● администраторы могут всё;
● разработчики имеют все права на модель ToDo, могут просматривать модели Project и
User;
● владельцы проектов имеют права на просмотр модели User и все права на модель
Project и ToDo.
================================================
front start:
npm run start

back start:
poetry run python manage.py runserver


================================================
Initial steps (do not use, for information only!)
------------------------------------------------
1. install pyenv
2. install poetry 
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
pyenv install 3.9.11
pyenv local 3.9.11
poetry init

poetry run python manage.py makemigrations
------------------------------------------------
1. install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
?? npm install

==
????
node install -g npx
npx create-react-app frontend
