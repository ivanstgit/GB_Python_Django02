import React from "react";
import { Link } from "react-router-dom";


const MenuItem = ({ item, index, login, logout_func }) => {
  if (item.isLoginLink && login !== '' && login !== undefined) {
    return (
      <td>{login}</td>
    )
  }
  if (item.isLogoutLink && (login === '' || login === undefined)) {
    return (
      <td> </td>
    )
  }
  if (item.isLogoutLink && (login !== '' || login !== undefined)) {
    return (
      <td>
        <button onClick={logout_func}>Logout</button>
      </td>)
  }

  return (
    <td>
      <Link key={'MenuItem_' + index} to={item.link}>{item.text}</Link>
    </td>
  )
}

const MenuItems = ({ items, login, logout_func }) => {
  return (
    <div className="App-menu">
      <table>
        <tbody>
          <tr>
            {items.map((item, index) => <MenuItem key={'MenuItem' + index} item={item} index={index} login={login} logout_func={logout_func} />)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MenuItems