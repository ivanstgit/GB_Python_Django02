import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

// import './App.css';
import './css/bootstrap.min.css'
import './css/style.css'

import AuthProvider from "./hooks/AuthProvider";
import { AuthContext } from "./hooks/AuthProvider";
import DataProvider from './hooks/DataProvider.js';

import AppPaths from "./routes/AppPaths.js"
import AuthRequired from './routes/AuthRequired.js'

import Home from './components/Home.js'
import Menu from "./components/Menu.js";
import Footer from "./components/Footer.js";
import LoginForm from './components/LoginForm.js'

import UserList from './components/User.js'
import ProjectList from './components/Project.js'
import ProjectFormCreate from './components/ProjectFormCreate.js';
import ToDoList from './components/ToDo.js'
import ToDoFormCreate from './components/ToDoFormCreate.js';


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      // 'users': [],
      // 'projects': [],
      // 'todos': [],
      // 'userData': {
      //   login: '',
      //   name: ''
      // },
      // isAutenticated: false,
      // menuLinks: [
      //   {
      //     link: '/users',
      //     text: 'Users',
      //   },
      //   {
      //     link: '/projects',
      //     text: 'Projects',
      //   },
      //   {
      //     link: '/todos',
      //     text: 'ToDos',
      //   },
      //   {
      //     link: '/login',
      //     text: 'Login',
      //     isLoginLink: true
      //   }
      // ],
      NotFound404: 'Страница не найдена'
    }
    // this.authManager = new AuthManager()
    // this.dataManager = new DataManager(this.authManager)
  }

  componentDidMount() {
    // this.authManager.refreshToken()
    // .then( () => {
    // if (this.authManager.isAuthenticated(true)) {
    //   users = this.dataManager.refresh("users").then
    // }
    // })
  }

  render() {
    return (
      <Router>
        <div className="App">
          {/* Это пример технического компонента на классе, хранит состояние аутентификации */}
          <AuthProvider>
            {/* Это пример технического компонента на функции, хранит данные */}
            <DataProvider>

              {/* Это пример компонента на функции, контекст передаем через хук */}
              <Menu title="Menu" />
              <div className="container-fluid py-5">
                <Routes>
                  <Route exact path={AppPaths.home} element={<Home />} />
                  {/* Это пример компонента на классе, в него явно передаем контекст*/}
                  <Route exact path={AppPaths.login} element={
                    <AuthContext.Consumer>{auth => (
                      <LoginForm auth={auth} redirectOnSuccess={AppPaths.home} />
                    )}
                    </AuthContext.Consumer>} />

                  <Route element={<AuthRequired redirectPath={AppPaths.login} />}>
                    <Route exact path={AppPaths.users} element={<UserList />} />
                  </Route>

                  <Route element={<AuthRequired redirectPath={AppPaths.login} />}>
                    <Route exact path={AppPaths.projects} element={<ProjectList />} />
                  </Route>
                  <Route element={<AuthRequired redirectPath={AppPaths.login} />}>
                    <Route exact path={AppPaths.projectsCreate} element={<ProjectFormCreate redirectOnSuccess={AppPaths.projects} />} />
                  </Route>

                  <Route element={<AuthRequired redirectPath={AppPaths.login} />}>
                    <Route exact path={AppPaths.todos} element={<ToDoList />} />
                  </Route>
                  <Route element={<AuthRequired redirectPath={AppPaths.login} />}>
                    <Route exact path={AppPaths.todosCreate} element={<ToDoFormCreate redirectOnSuccess={AppPaths.todos} />} />
                  </Route>

                  <Route component={App.NotFound404} />
                </Routes>
              </div>

              <Footer note="Footer Note" />

            </DataProvider>
          </AuthProvider>
        </div>
      </Router>
    )
  }

}


export default App;