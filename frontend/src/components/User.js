// import React, { useState, useEffect } from 'react'
import { useData } from '../hooks/DataProvider.js'

const UserItem = ({ user }) => {
    return (
        <tr>
            <td>{user.username}</td>
            <td>{user.first_name}</td>
            <td>{user.last_name}</td>
            <td>{user.email}</td>
        </tr>
    )
}

const UserList = () => {
    const dataProvider = useData()

    const items = dataProvider.users

    return (
        <div className="row-cols-1">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Login</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">E-mail</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((user, index) => <UserItem key={'User' + index} user={user} />)}
                </tbody>
            </table>
        </div>
    )
}
export default UserList
