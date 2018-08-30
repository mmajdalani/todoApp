import React from 'react';


class TaskForm extends React.Component {

    constructor(){
        super();
        this.addTask = this.addTask.bind(this);
    }

    addTask(event){
        event.preventDefault();
        console.log('creating task!');
        const task = {
            timestamp: Date.now(),
            name: this.name.value
        };
        this.props.addTask(task);
        this.taskForm.reset();
        }

    render(){
        return(
            <form ref={(input) => this.taskForm = input} className="task-add" onSubmit={(e) => this.addTask(e)}>
                <input ref={(input) => this.name = input} type="text" placeholder="Insert task..." required/>
                <button className="create-button" id="create-button" type="submit">+ Add Task</button>
            </form>
        )};
}

export default TaskForm;