import React from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

// import logo from './logo.svg';
import './App.css';

import Menu from "./components/Menu";
import Footer from "./components/Footer";
import UserList from './components/User.js'
import ProjectList from './components/Project.js'
import ToDoList from './components/ToDo.js'



class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'users': [],
      'projects': [],
      'todos': [],
      apiUrlPrefix: 'http://127.0.0.1:8000/api',
      menuLinks: [
        {
          link: '/',
          text: 'Users'
        },
        {
          link: '/projects',
          text: 'Projects'
        },
        {
          link: '/todos',
          text: 'ToDos'
        }
      ],
      routerLinks: {
        users: '/',
        projects: '/projects',
        todos: '/todos'
      },
      apiLinks: {
        users: '/users',
        projects: '/projects',
        todos: '/todos'
      },

      NotFound404: 'Страница не найдена'
    }
  }

  componentDidMount() {
    axios.get(this.state.apiUrlPrefix + this.state.apiLinks.users)
      .then(response => {
        this.setState(
          {
            'users': response.data.results
          }
        )
      }).catch(error => console.log(error))

    axios.get(this.state.apiUrlPrefix + this.state.apiLinks.projects)
      .then(response => {
        this.setState(
          {
            'projects': response.data.results
          }
        )
      }).catch(error => console.log(error))

    axios.get(this.state.apiUrlPrefix + this.state.apiLinks.todos)
      .then(response => {
        this.setState(
          {
            'todos': response.data.results
          }
        )
      }).catch(error => console.log(error))
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div>
            <Menu title="Menu" items={this.state.menuLinks} />
          </div>
          <div>
            <Routes>
              <Route path='/' element={ <UserList items={this.state.users} />} />
              <Route path='/projects' element={<ProjectList items={this.state.projects} />} />
              <Route exact path='/todos'  element={ <ToDoList items={this.state.todos} />} />
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

  // AppConst = {
  //   url_prefix: 'http://127.0.0.1:8000/api',
  //   menu_links: [
  //     {
  //       link: '/',
  //       text: 'Users'
  //     },
  //     {
  //       link: '/projects',
  //       text: 'Projects'
  //     },
  //     {
  //       link: '/todos',
  //       text: 'ToDos'
  //     }
  //   ],
  //   api_links: {
  //     users: '/users',
  //     projects: '/projects',
  //     todos: '/todos'
  //   },

  //   NotFound404: ({ location }) => {
  //     return (
  //       <div>
  //         <h1>Страница по адресу '{location.pathname}' не найдена</h1>
  //       </div>
  //     )
  //   }
  // }
}
export default App;