import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import logo from '../logo.svg';
import TaskForm from './AddTaskForm';
import Task from './Task';
import {BehaviorSubject} from 'rxjs';




class App extends Component {
    constructor(props) {
        super(props);

        this.addTaskItem = this.addTaskItem.bind(this);
        this.removeTaskItem = this.removeTaskItem.bind(this);

        this.state ={
            tasks: {}
        };

    }

    addTask(task){
        const tasks = {...this.state.tasks};
        tasks[`task-${task.timestamp}`] = task;
        this.setState({ tasks })
    }

    // removeTask(key){
    //
    //     const tasks = {...this.state.tasks};
    //     tasks[key] = null;
    //     delete tasks[key];
    //     this.setState({ tasks });
    // }
    //
    //

    addTaskItem(task){

        const tasks = {...this.state.tasks};
        const timestamp = Date.now();
        tasks[`task-${timestamp}`] = task;
        this.setState({ tasks });

    }


    removeTaskItem(key){
        const tasks = {...this.state.tasks};
        tasks[key] = null;
        delete tasks[key];
        this.setState({ tasks });
    }

    render() {
        return (
            <div className="App">
                 <div>
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                         <h1 className="App-title">React To-Do</h1>
                    </header>
                     <p className="App-intro">
                        To get started, add a task!
                     </p>
                 </div>
                 <div>
                     <h2> Tasks </h2>
                     <TaskForm addTask={this.addTaskItem}/>
                 </div>
                 <div className={"task-list"}>
                    <ul>{
                         Object
                            .keys(this.state.tasks)
                            .map(key => <Task key={key} index={key} details={this.state.tasks[key]} removeTaskItem={this.removeTaskItem}/>)
                        }
                    </ul>

                 </div>
            </div>

                )
            }
        }

export default withRouter(App);
