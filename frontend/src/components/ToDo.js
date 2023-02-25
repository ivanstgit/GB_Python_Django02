// import Link from "react-router-dom";


const ToDoItem = ({ item }) => {
    return (
        <tr>
            <td>{item.id}</td>
            <td>{item.project}</td>
            <td>{item.content}</td>
            <td>{item.user_created}</td>
            <td>{item.date_updated}</td>
        </tr>
    )
}

const ToDoList = ({ items }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Project</th>
                    <th>Content</th>
                    <th>Created by</th>
                    <th>Updated at</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => <ToDoItem key={'ToDo'+index} item={item} />)}
            </tbody>
        </table>
    )
}
export default ToDoList
