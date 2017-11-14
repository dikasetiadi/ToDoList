import React, { Component } from 'react'
import MdAddAlert from 'react-icons/lib/md/add-alert'
import FaTimesCircle from 'react-icons/lib/fa/times-circle'
import FaCircleO from 'react-icons/lib/fa/circle-o'
import FaCheckCircle from 'react-icons/lib/fa/check-circle'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './App.css'

class App extends Component {

    state = {
        listTotalTask : 0,
        listRemainTask : 0,
        listDoneTask : 0,
        childTask: []
    }
    
    AddNewTask = () => {
        const tempChildTask = this.state.childTask
        tempChildTask.push({
            text: 'New Task',
            checked: false,
            editAble: false
        })
        
        const remainTask = (tempChildTask.length > 0 ? tempChildTask.length - this.state.listDoneTask : tempChildTask.length)

        this.setState({
            listTotalTask : tempChildTask.length,
            listRemainTask : remainTask,
            childTask : tempChildTask,
        })   
    }
    
    DeleteTask = (index) => {
        const tempChildTask = this.state.childTask
        const isDoneTask    = tempChildTask[index].checked
        tempChildTask.splice(index, 1);
        
        this.setState(
            prevState => ({
            listTotalTask : tempChildTask.length,
            listRemainTask : (isDoneTask ? prevState.listRemainTask : prevState.listRemainTask - 1),
            listDoneTask : (isDoneTask ? prevState.listDoneTask - 1 : prevState.listDoneTask),
            childTask : tempChildTask,
        })
        )
    }

    SetDoneTask = (index) => {
        const tempChildTask = this.state.childTask
        tempChildTask[index].checked  = !tempChildTask[index].checked 
        tempChildTask[index].editAble = !tempChildTask[index].editAble

        this.setState(
        prevState => ({
            listDoneTask: (tempChildTask[index].checked ? prevState.listDoneTask + 1 : prevState.listDoneTask - 1),
            listRemainTask: (tempChildTask[index].checked ? prevState.listRemainTask - 1 : prevState.listRemainTask + 1),
            childTask : tempChildTask
        }))

    }

    EditTaskText = (index,text) => {
        const tempChildTask = this.state.childTask
        tempChildTask[index].text = text

        this.setState({
            childTask: tempChildTask
        })
    }

    render(){
        return(
            <div className="app">
                <Info 
                    CountTotal={this.state.listTotalTask} 
                    CountRemain={this.state.listRemainTask}
                    CountDone={this.state.listDoneTask}
                />
                <Content 
                    listTotalTask={this.state.listTotalTask} 
                    addAction={this.AddNewTask}
                    childTask={this.state.childTask}
                    delTask={this.DeleteTask}
                    setDone={this.SetDoneTask}
                    editTask={this.EditTaskText}
                />
            </div>
        )
    }
}

class Info extends Component {
  render(){
      return(
          <div className="info__wrapper">
              <Time />
              <TodoInfo 
                  TotalTask={this.props.CountTotal}
                  RemainTask={this.props.CountRemain}
                  DoneTask={this.props.CountDone} 
              />
          </div>
      )
  }
}

class Time extends Component {

  state = {
      timer: new Date(),
      month: new Date().getMonth(),
      dayMonth: new Date().getDate(),
      dayWeek: new Date().getDay()
  }

  componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
      this.CalendarInfo();
  }
  
  componentWillUnmount() {
      clearInterval(this.timerID);
  }

  tick() {
      this.setState({
        timer: new Date()
      });
  }

  CalendarInfo() {
      let monthNow = this.state.month,
          dayMonthNow = this.state.dayMonth,
          dayWeekNow = this.state.dayWeek,
          suffix
      
      let dayArray = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      let monthArray = ["January","February","March","April,","May","June","July","August","September","October","November","December"];
      
      switch(dayMonthNow) {
          case 1: case 21: case 31: suffix = 'st'; break;
          case 2: case 22:          suffix = 'nd'; break;
          case 3: case 23:          suffix = 'rd'; break;
          default:                  suffix = 'th';
      }

      monthNow = monthArray[monthNow]
      dayMonthNow = dayMonthNow + suffix
      dayWeekNow = dayArray[dayWeekNow]

      this.setState({
          month: monthNow,
          dayMonth: dayMonthNow,
          dayWeek: dayWeekNow
      })
  }


  render(){
      return(
          <div className="date__wrapper">
              <div className="date-info">
                  <span className="week-day">{this.state.dayWeek}</span>
                  <span className="date-day">{this.state.dayMonth}</span>
              </div>
              <div className="month-info">
                  {this.state.month}
              </div>
              <div className={"time-info"}>
                  {this.state.timer.toLocaleTimeString()}
              </div>
          </div>
      )
  }
}

class TodoInfo extends Component {
  render(){
      return(
          <div className="TodoInfo__wrapper">
              <div className="total-task">
                  <div className="total-number-task">{this.props.TotalTask}</div>
                  <div className="text-info">Total</div>
              </div>
              <div className="remaining-task">
                  <div className="remaining-number-task">{this.props.RemainTask}</div>
                  <div className="text-info">Remaining</div>
              </div>
              <div className="done-task">
                  <div className="done-number-task">{this.props.DoneTask}</div>
                  <div className="text-info">Done</div>
              </div>
          </div>
      )
  }
}

class Content extends Component {
  render(){
      return (
          <div className={'content__wrapper ' + (this.props.listTotalTask === 0 ? 'empty-state' : '' )}>
              <EmptyStateTask />
              <TaskList 
                  listTask={this.props.childTask} 
                  delTask={this.props.delTask}
                  setDone={this.props.setDone}
                  editTask={this.props.editTask}
              />
              <AddButton Action={this.props.addAction} />
          </div>
      )
  }
}

class EmptyStateTask extends Component {
  render(){
      return(
          <div className="empty-state-task__wrapper">
              <MdAddAlert />
              <div className="empty-state-desc">
                  <div>Your ToDo list is empty.</div>
                  <div> Let's add some task for today!</div>
              </div>
          </div>
      )
  }
}

class TaskList extends Component {
  render(){

      var titleTask = {
          textAlign: 'center'
      }
      return(
          <div className="task-list__wrapper">
              <h1 style={titleTask}>Task List</h1>
              <div className="task-list">
              <ReactCSSTransitionGroup
                  transitionName="task-list"
                  transitionEnterTimeout={0}
                  transitionLeaveTimeout={100}>
                  {this.props.listTask && this.props.listTask.map((item,index) => (
                      <li className={"task"} key={index}>
                          <input className="check-input" type="checkbox" id={"task-"+index} checked={item.checked} onChange={()=> this.props.setDone(index)}/>
                          <label htmlFor={"task-"+index}>
                              <FaCircleO className="unchecked-icon"/>
                              <FaCheckCircle className="checked-icon"/>
                          </label>
                          <input type="text" className="task-name" disabled={item.editAble} value={item.text} onChange={(event) =>this.props.editTask(index,event.target.value)}/>                           
                          <FaTimesCircle className="delete-icon" onClick={()=>this.props.delTask(index)}/>
                      </li>
                  ))}
              </ReactCSSTransitionGroup>
              </div>
          </div>  
      )
  }
}

const AddButton = (props) => {
  return <a className="add-button" onClick={props.Action}>Add new item</a>
}

export default App;