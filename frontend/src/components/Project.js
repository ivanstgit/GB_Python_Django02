// import Link from "react-router-dom";


const ProjectItem = ({ item }) => {
    return (
        <tr>
            <td>{item.name}</td>
            <td><a href={item.repo_link}>{item.repo_link}</a></td>
            <td>{item.participants.join('; ')}</td>
        </tr>
    )
}

const ProjectList = ({ items }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Repository link</th>
                    <th>Participants</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => <ProjectItem key={'Project'+index} item={item} />)}
            </tbody>
        </table>
    )
}
export default ProjectList
