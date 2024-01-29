import { Link } from "react-router-dom";
import { DATA_RESOURCES, useData } from '../hooks/DataProvider.js'
import AppPaths from "../routes/AppPaths.js"

const ProjectItem = ({ item, deleteItem }) => {
    return (
        <tr>
            <td>{item.name}</td>
            <td><a href={item.repo_link}>{item.repo_link}</a></td>
            <td>{item.participants.join('; ')}</td>
            <td> <button className="btn btn-primary w-50 rounded-pill" onClick={() => deleteItem(item.id)}>Delete</button> </td>
        </tr>
    )
}

const ProjectList = () => {
    const dataProvider = useData()
    const items = dataProvider.projects

    const deleteProject = (id) => {
        dataProvider.deleteOne(DATA_RESOURCES.projects, id)
            .then(() => {
                dataProvider.refreshDelayed(DATA_RESOURCES.projects, 500)
            })
    }

    console.log("projects renders")

    return (
        <div className="row-cols-1">
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Repository link</th>
                        <th>Participants</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => <ProjectItem key={'Project' + index} item={item} deleteItem={deleteProject} />)}
                </tbody>
            </table>

            <div className="col-12">
                <Link className="btn btn-primary rounded-pill py-3 px-5 mt-3"
                    key="ToDoCreate" to={AppPaths.projectsCreate}>
                    Create
                </Link>
            </div>
        </div>
    )
}
export default ProjectList
