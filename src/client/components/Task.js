import React from 'react';


class Task extends React.Component{

    render(){
        const {details, index} = this.props;
        return (
            <li className="task-item">
                <strong className="task-name">{details.name}  </strong>
                <button className="delete-task" onClick={() => this.props.removeTaskItem(index)} >X</button>
            </li>
        );
    }
}

export default Task;