import React from 'react'

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

const UserList = ({ items }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Login</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>E-mail</th>
                </tr>
            </thead>
            <tbody>
                {items.map((user, index) => <UserItem key={'User'+index} user={user} />)}
            </tbody>
        </table>
    )
}
export default UserList
