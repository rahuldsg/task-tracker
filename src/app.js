
// parent component:- TaskList
class TaskList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            taskListData: [],
            showFormError: false,
            showErrorExistsTask: false,
        }

        this.handleAddTask = this.handleAddTask.bind(this)
        this.handleRemoveTask = this.handleRemoveTask.bind(this)

    }

    componentDidMount() {
        //Render Data
        this.getDataFromLocalStorage()
    }

    //Get Data From Localstorage
    getDataFromLocalStorage() {
        try {
            const getLocalstorageData =  JSON.parse(localStorage.getItem('taskList'))
            if(getLocalstorageData) {
                this.setState(()=>{
                    return {
                        taskListData: getLocalstorageData,
                        showFormError: false
                    }
                });
            }
        }
        catch(e) {

        }
    }

    //remove task
    handleRemoveTask(option) {
        try {
            const getLocalstorageData =  JSON.parse(localStorage.getItem('taskList'))
            if(getLocalstorageData) {
                const filterData = getLocalstorageData.filter((el)=>{
                    return el.taskName !== option
                })

                localStorage.setItem('taskList', JSON.stringify(filterData))
                const data = JSON.parse(localStorage.getItem('taskList'))
                this.setState(()=> ({
                    taskListData: data
                }))
            }
        }
        catch(e) {

        }
    }

    handleAddTask(e) {
        e.preventDefault();
        const taskname = e.target.elements.taskName.value.trim()
        const taskdate = e.target.elements.taskDate.value.trim()
        const assignedname = e.target.elements.assignedName.value.trim()
        const formvalues = {}
        formvalues.taskName = taskname
        formvalues.date = taskdate
        formvalues.assignedTo = assignedname


        if(taskname !== '' && taskdate !== '' && assignedname !== '') {

            const fetchLocalStorage =  localStorage.getItem('taskList')
            const checkIfValueExists = fetchLocalStorage.includes(formvalues.taskName);
            if(checkIfValueExists) {
                this.setState(()=>{
                    return {
                        showErrorExistsTask: true
                    }
                })
            }
            else {
                const getPreviousData = this.state.taskListData.concat(formvalues)
                localStorage.setItem('taskList', JSON.stringify(getPreviousData))
                this.getDataFromLocalStorage()
                e.target.elements.taskName.value = ''
                e.target.elements.taskDate.value = ''
                e.target.elements.assignedName.value = ''
            }

        }else {
            this.setState(()=>{
                return {
                    showFormError: true
                }
            });
        }        
    }

    render() {
        const formError = this.state.showFormError
        const showErrorExistsTask  = this.state.showErrorExistsTask
        const showAddTaskMsg = this.state.taskListData
        const checkTaskLength = showAddTaskMsg.length

        return (
            <div className={'tasklist-container'}>
                <Head title={'Task Tracker'} headClass={'main-head'} />
                <div className={'display-flex'}>
                    <div className={'create-task'}>
                        <Head title={'Create a Task'} headClass={'section-head'} />
                        <div className={'form-container'}>
                            <form onSubmit={this.handleAddTask}>
                                <Formfield label={'Task Name'} fieldtype={'text'} placeholder={'Please enter task name'} name={'taskName'}  />
                                <Formfield label={'Date'} fieldtype={'date'} placeholder={'Please select date'} name={'taskDate'}  />
                                <Formfield label={'Assigned to'} fieldtype={'text'} placeholder={'Please enter name'} name={'assignedName'}  />
                                {formError && <div className={'form-error'}>Please fill all the form fields</div>}
                                {showErrorExistsTask && <div className={'form-error'}>This task already exists</div>}

                                <button type={'submit'}>Submit</button>
                            </form>
                        </div>
                    </div>

                    <div className={'task-list'}>
                        <Head title={'Existing Tasks'} headClass={'section-head'} />
                         { checkTaskLength==0 && <div className={'no-task'}>There is no existing task</div>  }
                         { checkTaskLength>0 && <TaskListContainer taskListContent={this.state.taskListData} handleRemoveTask={this.handleRemoveTask} /> }
                    </div>
                </div>
            </div>
        )
    }
}

// Head component
class Head extends React.Component {
    render() {
        const headClass = this.props.headClass
        return (
            <div className={headClass}>
                {this.props.title}
            </div>
        )
    }
}

//FormField Component
class Formfield extends React.Component {
    render() {

        return (
            <div className={'field-row'}>
                <label>{this.props.label}</label>
                <input type={this.props.fieldtype} className={'form-control'} name={this.props.name} placeholder={this.props.placeholder} />
            </div>
        )
    }
}

//TaskList Component
class TaskListContainer extends React.Component {
    render() {
        return (
            <div className={'tasklist-indent'}>
                {
                    this.props.taskListContent.map((data, index)=>{
                        return <TaskListRow
                            key={index}
                            taskName={data.taskName}
                            assignedDate={data.date}
                            assignedTo={data.assignedTo}
                            handleRemoveTask={this.props.handleRemoveTask}
                        />
                    })
                }
            </div>
        )
    }
}

//TasListRow Component
class TaskListRow extends React.Component {
    render() {
        return (
            <div className={'tasklist-row'}>
                <div className={'col'}>
                    <div>Task Name</div>
                        {this.props.taskName}
                </div>

                <div className={'col'}>
                    <div>Assigned Date</div>
                    {this.props.assignedDate}
                </div>

                <div className={'col'}>
                    <div>Assigned to</div>
                    {this.props.assignedTo}
                </div>

                <div className={'remove'} onClick={()=>this.props.handleRemoveTask(this.props.taskName)}>
                    Remove
                </div>
            </div>
        )
    }
}


//Init app
const app = document.getElementById('taskTrackerApp');
ReactDOM.render(
    <TaskList />,
    app
);