import {send, listen} from "../connection";
//import('src/server/db');
import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import logo from '../logo.svg';
import TaskForm from './AddTaskForm';
import Task from './Task';
import {BehaviorSubject} from 'rxjs';
import {map} from "rxjs/operators";




class App extends Component {
    constructor(props) {
        super(props);

        this.addTaskItem = this.addTaskItem.bind(this);
        this.removeTaskItem = this.removeTaskItem.bind(this);

        this.state ={
            tasks: {},
	        time: '',
            vin: ''
	  //  temp: ''
        };

        this.addtask = new BehaviorSubject({
                timestamp: {},
                name: ''
            }
        ) ;

        this.removetask = new BehaviorSubject({
                timestamp: {},
                name: ''
            }
        ) ;

        this.taskRemoveItems$ = this.removetask.pipe(
            map(object => ({timestamp: object.timestamp, name: object.name})
            )
        );

        this.taskItems$ = this.addtask.pipe(
            map(object => ({timestamp: object.timestamp, name: object.name})
            )

        );


        this.taskItems$.subscribe(() => send(this.taskItems$, 'new'));

        this.taskRemoveItems$.subscribe(() => send(this.taskRemoveItems$, 'remove'));


    };

    componentWillMount(){
        const localStorageRef = localStorage.getItem(`task`);
//`task-${this.state.tasks.timestamp}`
        if(localStorageRef){
            this.setState({
                tasks: JSON.parse(localStorageRef)
            })
        }
    }

    componentDidMount(){
        listen('load').subscribe(tasks => {
            console.log("Tasks: " + tasks);
            Object
                .keys(tasks).map(key => this.loadTasks(tasks[key]));
        });
        listen('newTask').subscribe(data => {
            addMessage(data.from, data.message);
            console.log('task');
	});

	listen('time').subscribe(time => {
		console.log(time);
		this.setState({time: time})

	});

	listen('vin').subscribe(vin => {
	    console.log(vin);
	    this.setState({vin: vin})

	});
	// listen('temp').subscribe(temp => {
	// 	console.log(temp);
	// 	this.setState({temp: temp})
    //
    //     });
    }

    componentWillUpdate(nextProps, nextState){
            localStorage.setItem(`task`, JSON.stringify(nextState.tasks))
    }

    // addTask(task){
    //     const tasks = {...this.state.tasks};
    //     tasks[`task-${task.timestamp}`] = task;
    //     this.setState({ tasks })
    // }

    // removeTask(key){
    //
    //     const tasks = {...this.state.tasks};
    //     tasks[key] = null;
    //     delete tasks[key];
    //     this.setState({ tasks });
    // }


    loadTasks(task){
        const tasks = {...this.state.tasks};

        tasks[`task-${task.timestamp}`] = task;

        this.setState({ tasks });

}

    addTaskItem(task){

        const tasks = {...this.state.tasks};
        const timestamp = Date.now();
        tasks[`task-${timestamp}`] = task;
        this.setState({ tasks });


        this.addtask.next({
            timestamp: task.timestamp,
            name: task.name
        })
    }


    removeTaskItem(key){
        if(confirm('Are you sure you would like to remove this task?')) {
            const tasks = {...this.state.tasks};
            this.removetask.next({
                timestamp: tasks[key].timestamp,
                name: tasks[key].name
            });
            tasks[key] = null;
            console.log("removing task!");
            delete tasks[key];
            this.setState({tasks});
        }
        else{

        }
    }

    render() {
        return (
            <div className="App">
                 <div>
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                         <h1 className="App-title">React To-Do</h1>
			 <h1 className="App-title">{this.state.time}</h1>
                	 {/*<div className="topleft"> {this.state.temp}</div>    */}
                        <h1 className ="App-title">
                        <div className="topleft"> Voltage: {this.state.vin} V</div>
                        </h1>


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
                            .map(key => <Task key={key} index={key} details={this.state.tasks[key]} removeTaskItem={this.removeTaskItem} />)
                        }
                    </ul>

                 </div>
            </div>

                )
            }
        }

export default withRouter(App);
