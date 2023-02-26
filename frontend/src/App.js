import React from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Cookies from 'universal-cookie';
import CookieSetOptions from 'universal-cookie';

// import logo from './logo.svg';
import './App.css';

import Menu from "./components/Menu";
import Footer from "./components/Footer";
import UserList from './components/User.js'
import ProjectList from './components/Project.js'
import ToDoList from './components/ToDo.js'
import LoginForm from './components/Auth.js'
// import Logout from './components/Logout.js'



class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'users': [],
      'projects': [],
      'todos': [],
      'userData': {
        login: '',
        name: ''
      },
      'tokens': {
        'access': '',
        'refresh': ''
      },
      apiUrlPrefix: 'http://127.0.0.1:8000/api',
      menuLinks: [
        {
          link: '/',
          text: 'Users',
        },
        {
          link: '/projects',
          text: 'Projects',
        },
        {
          link: '/todos',
          text: 'ToDos',
        },
        {
          link: '/login',
          text: 'Login',
          isLoginLink: true
        },
        {
          link: '/logout',
          text: 'Logout',
          isLogoutLink: true
        }
      ],
      // routerLinks: {
      //   users: '/',
      //   projects: '/projects',
      //   todos: '/todos'
      // },
      apiLinks: {
        users: '/users',
        projects: '/projects',
        todos: '/todos',
        tokenGenerate: '/token/',
        tokenVerify: '/token/verify/',
        tokenRefresh: '/token/refresh/'
      },

      NotFound404: 'Страница не найдена'
    }
  }

  componentDidMount() {
    this.loadUserData(this.loadContentData)
    //this.loadContentData()
  }

  logIn(login, password) {
    this.createUserData(login, password, this.loadContentData)
    //this.loadContentData()
  }

  logOut() {
    this.clearUserData(this.loadContentData)
    //this.loadContentData()
  }

  createUserData(login, password, callback) {
    axios.post(this.state.apiUrlPrefix + this.state.apiLinks.tokenGenerate,
      { username: login, password: password })
      .then(response => {
        const tokenAccess = response.data.access
        const tokenRefresh = response.data.refresh
        this.updateUserData(login, tokenAccess, tokenRefresh, callback)
      }).catch(error => {
        this.clearUserData()
        if (error.response) {
          if (error.response.status === 401) {
            alert('Неверный логин или пароль')
          }
          console.log(error.response)
        } else {
          console.log(error)
        }
      })
  }

  updateUserData(login, tokenAccess, tokenRefresh, callback) {
    const cookies = new Cookies()
    const cookieSetOptions = {
      path: '/',
      maxAge: 60 * 60,
      // secure: true,
      // httpOnly: true,
      sameSite: 'lax'
    }
    cookies.set('login', login, cookieSetOptions)
    cookies.set('tokenAccess', tokenAccess, cookieSetOptions)
    cookies.set('tokenRefresh', tokenRefresh, cookieSetOptions)

    this.setState({
      'userData': this.loadUserDetail(login),
      'tokens': {
        'access': tokenAccess,
        'refresh': tokenRefresh
      }
    }, callback = callback)
  }

  loadUserData(callback) {
    const cookies = new Cookies()
    const login = cookies.get('login')
    const tokenAccess = cookies.get('tokenAccess')
    const tokenRefresh = cookies.get('tokenRefresh')
    if (login && tokenAccess && tokenRefresh) {
      this.setState({
        'userData': this.loadUserDetail(login),
        'tokens': {
          'access': tokenAccess,
          'refresh': tokenRefresh
        },
      }, callback = callback)
    } else {
      this.clearUserData(callback)
    }
  }

  clearUserData(callback) {
    const cookies = new Cookies()
    cookies.remove('login')
    cookies.remove('tokenAccess')
    cookies.remove('tokenRefresh')
    this.setState({
      'userData': this.loadUserDetail(''),
      'tokens': {
        'access': '',
        'refresh': ''
      },
    }, callback = callback)
  }

  loadUserDetail(login) {
    // to do - request to user model?
    return {
      login: login,
      name: '',
    }
  }

  getAccessToken() {
    const tokenAccess = this.state.tokens.access
    console.log('requested token for ' + this.state.userData.login + ' - ' + tokenAccess)
    return tokenAccess
  }

  refreshAccessToken(callback) {

    //verify token
    const login = this.state.userData.login
    const tokenRefresh = this.state.tokens.refresh
    let tokenAccess = this.state.tokens.access
    console.log('requested token refresh for ' + login)

    if (tokenAccess != '') {
      axios.post(this.state.apiUrlPrefix + this.state.apiLinks.tokenVerify,
        { "token": tokenAccess })
        .then(response => {
          if (response.status === 200) {
            console.log('token verified ' + tokenAccess)
            return tokenAccess
          }
        }).catch(error => {
          console.log('token not verified ' + tokenAccess)
          if (error.response) {
            if (error.response.status === 401) {
              console.log('try to refresh token with ' + tokenRefresh)
              axios.post(this.state.apiUrlPrefix + this.state.apiLinks.tokenRefresh,
                { "refresh": tokenRefresh })
                .then(response => {
                  if (response.status === 200) {
                    tokenAccess = response.data.access
                    console.log('token refreshed ' + tokenAccess)
                    this.updateUserData(login, tokenAccess, tokenRefresh, callback)
                    return tokenAccess
                  } else {
                    console.log(error.response)
                  }
                }).catch(error => {
                  console.log(error)
                })
            }
            console.log(error.response)
          } else {
            console.log(error)
          }
        })
      this.clearUserData(this.loadContentData)
    }
    return ''
  }

  loadContentData() {
    // из-за асинхронности не ждем результата, а пытаемся обновиться сразу

    let token = this.getAccessToken()
    console.log('requested server loading with ' + token)
    if (token != '') {
      let headers = {
        'Content-Type': 'application/json'
      }
      headers['Authorization'] = 'Bearer ' + token


      axios.get(this.state.apiUrlPrefix + this.state.apiLinks.users, { headers })
        .then(response => {
          this.setState(
            {
              'users': response.data.results
            }
          )
        }).catch(error => console.log(error))

      axios.get(this.state.apiUrlPrefix + this.state.apiLinks.projects, { headers })
        .then(response => {
          this.setState(
            {
              'projects': response.data.results
            }
          )
        }).catch(error => console.log(error))

      axios.get(this.state.apiUrlPrefix + this.state.apiLinks.todos, { headers })
        .then(response => {
          this.setState(
            {
              'todos': response.data.results
            }
          )
        }).catch(error => {
          this.refreshAccessToken(this.loadContentData)
          console.log(error)
        })
    } else {
      this.setState(
        {
          'users': [],
          'projects': [],
          'todos': [],
        }
      )
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div>
            <Menu title="Menu" items={this.state.menuLinks} login={this.state.userData.login} logout_func={() => this.logOut()} />
          </div>
          <div>
            <Routes>
              <Route path='/' element={<UserList items={this.state.users} />} />
              <Route path='/projects' element={<ProjectList items={this.state.projects} />} />
              <Route exact path='/todos' element={<ToDoList items={this.state.todos} />} />
              <Route exact path='/login' element={<LoginForm loginData={(login, password) => this.logIn(login, password)} />} />
              {/* <Route exact path='/logout' element={<Logout logout_func={() => this.logOut()}/>} /> */}
              {/* <Redirect from='/users' to='/' /> */}
              <Route component={App.NotFound404} />
            </Routes>
          </div>
          <div>
            <Footer note="Footer Note" />
          </div>
        </div>
      </Router>
    )
  }

}


export default App;