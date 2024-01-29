import { Link } from "react-router-dom";

import { DATA_RESOURCES, useData } from '../hooks/DataProvider.js'
import AppPaths from "../routes/AppPaths.js"


const ToDoItem = ({ item, deleteItem }) => {
    return (
        <tr>
            <td>{item.id}</td>
            <td>{item.project.name}</td>
            <td>{item.content}</td>
            <td>{item.user_created}</td>
            <td>{item.date_updated}</td>
            <td> <button className="btn btn-primary w-50 rounded-pill" onClick={() => deleteItem(item.id)}>Delete</button> </td>
        </tr>
    )
}

const ToDoList = () => {
    const dataProvider = useData()
    const items = dataProvider.todos

    const deleteToDo = (id) => {
        dataProvider.deleteOne(DATA_RESOURCES.todos, id)
            .then(() => {
                dataProvider.refreshDelayed(DATA_RESOURCES.todos, 500)
            })
    }

    console.log("todos renders")

    return (
        <div className="row-cols-1">
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Project</th>
                        <th>Content</th>
                        <th>Created by</th>
                        <th>Updated at</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => <ToDoItem key={'ToDo' + index} item={item} deleteItem={deleteToDo} />)}
                </tbody>
            </table>
            <div className="col-12">
                <Link className="btn btn-primary rounded-pill py-3 px-5 mt-3"
                    key="ToDoCreate" to={AppPaths.todosCreate}>
                    Create
                </Link>
            </div>
        </div >
    )
}
export default ToDoList
