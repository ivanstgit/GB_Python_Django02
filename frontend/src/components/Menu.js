import React from "react";
import { Link } from "react-router-dom";


const MenuItem = ({ item, index }) => {
  return (
    <td>
      <Link key={'MenuItem_'+index} to={item.link}>{item.text}</Link>
    </td>
  )
}

const MenuItems = ({ items }) => {
  return (
    <div className="App-menu">
      <table>
        <tbody>
          <tr>
            {items.map((item, index) => <MenuItem key={'MenuItem'+index} item={item} index={index} />)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MenuItems