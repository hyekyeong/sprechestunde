import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { loadList, loadToolId } from "../api";
import LecturerTableRow from "../Common/LecturerTableRow.jsx";

import FacultyData from './Faculty.js';

class LecturerList extends Component {
    constructor(props){
        super(props);

        this.state = {
            totalEntries: null,
            listSize: 15,
            prevPage: 0,
            currentPage: 1,
            nextPage:2,
            selectedFaculty: "",
            selectedDepartment: "",
            selectedName: ""
        }
    }

    componentDidMount() {
        this.props.loadList();
        this.props.loadToolId();
    }

    componentWillUpdate(nextProps, nextState) {
        if(
            this.props.officehours !== nextProps.officehours 
        ){
            this.setState({ totalEntries: nextProps.officehours.list.length });
        };

        if(
            this.state.currentPage !== nextState.currentPage
        ){
            this.setState({
                prevPage: nextState.currentPage-1,
                nextPage: nextState.currentPage+1,
            });            
        };
    }

    render() {
        const facultyOptions = FacultyData.Faculty.map(faculty => ({ value: faculty.name, label: faculty.name }));
        const { list } = this.props.officehours;
        const { listSize, currentPage, totalEntries } = this.state;
        const first = listSize*(currentPage-1);
        const firstEntry = first+1;
        const last = (listSize*currentPage)-1;
        const lastPage = Math.ceil(totalEntries/listSize);
        const lastEntry = this.state.currentPage < lastPage ? last+1 : list.length;

        console.log()
        var filteredlist = list;
        var cells = filteredlist.slice(first,last).map(lecturer => (
            <LecturerTableRow 
                key={lecturer.USER_ID}
                lecturer={lecturer}
                appointment={lecturer} />
        ));; 
    
        if ( this.state.selectedFaculty ==="" ||
             this.state.selectedDepartment === "" ||
             this.state.selectedName === "" ){
                filteredlist = list;
                cells = filteredlist.slice(first,last).map(lecturer => (
                    <LecturerTableRow 
                        key={lecturer.USER_ID}
                        lecturer={lecturer}
                        fromSignup={this.props.officehours.signup.find(l => l.creator_user_id ===lecturer.USER_ID)} />
                ));; 
        }
        /*
        if ( this. state.selectedFaculty !== "" ){
            filteredlist = list.filter(lecturer => lecturer.FACULTY === this.state.selectedDepartment).slice(first,last);
        }*/

        if ( this. state.selectedDepartment !== "" ){
            filteredlist = filteredlist.filter(lecturer => lecturer.VALUE === this.state.selectedDepartment).slice(first,last);
            cells = filteredlist.map(lecturer => (
                <LecturerTableRow 
                    key={lecturer.USER_ID}
                    lecturer={lecturer} />
            ));; 
        }

        if ( this. state.selectedName !== "" ){
            filteredlist = filteredlist.filter(lecturer => lecturer.NAME === this.state.selectedName).slice(first,last);
            cells = filteredlist.map(lecturer => (
                <LecturerTableRow 
                    key={lecturer.USER_ID}
                    lecturer={lecturer} />  
            ));;
        }


        const FirstBtn = (
            <a 
                hrdf='#' 
                id="firstbtn"
                className={`${ this.state.currentPage === 1 ? "disabled" : "" }`}
                onClick={() => this.setState({ currentPage: 1 })}>
            First </a>  
        );

        const PreviousBtn = (
            <a 
                hrdf='#' 
                id="prevbtn"
                className={`${ this.state.currentPage <= 1 ? "close" : "" }`}
                onClick={() => this.setState({ currentPage: this.state.currentPage-1 })}>
            {this.state.prevPage} </a>  
        );

        const CurrentPageBtn = (
            <a 
                hrdf='#' 
                id="currentpagebtn"
                className="active">
            {this.state.currentPage} </a>  
        );

        const NextBtn = (
            <a 
                hrdf='#' 
                id="nextbtn"
                className={`${ this.state.currentPage > lastPage-1 ? "close" : "" }`}
                onClick={() => this.setState({ currentPage: this.state.currentPage+1 })}>
            {this.state.nextPage} </a>  
        );

        const LastBtn = (
            <a 
                hrdf='#' 
                id="lastbtn"
                className={`${ this.state.currentPage === lastPage ? "disabled" : "" }`}
                onClick={() => this.setState({ currentPage: lastPage })}>
            Last </a>  
        );

        return(
            <div>
                <div className="filter-container">
                    <div className="filterwrapper">
                        <Select
                            name="faculty"
                            value={this.state.selectedFaculty}
                            placeholder="Select faculty"
                            onChange={e => {
                                if (e === null){
                                    this.setState({ selectedFaculty: "" })
                                }else{
                                    this.setState({ selectedFaculty: e.label })}
                            }}
                            options={facultyOptions} 
                        />
                    </div>

                    <div className="filterwrapper">
                        <Select
                            name="department"
                            value={this.state.selectedDepartment}
                            placeholder="Select department"
                            onChange={e => {
                                if (e === null){
                                    this.setState({ selectedDepartment: "" })
                                }else{
                                    this.setState({ selectedDepartment: e.label })}
                            }}
                            options={[...new Set(list.map(lecturer => lecturer.VALUE))].map(dep =>({ label: dep, value: dep}))} 
                        />
                    </div>

                    <div className="filterwrapper">
                        <Select
                            name="name"
                            value={this.state.selectedName}
                            placeholder="Select name"
                            onChange={e => {
                                if (e === null){
                                    this.setState({ selectedName: "" })
                                }else{
                                    this.setState({ selectedName: e.label })}
                            }}
                            options={[...new Set(list.map(lecturer => lecturer.NAME))].map(name =>({ label: name, value: name}))} 
                        />
                    </div>
                </div>

                <div>
                    <span> Showing {firstEntry} to {lastEntry} of {this.state.totalEntries} entries. </span>
                </div>

                <table>
                    <thead>
                        <tr>
                            <td>Image</td>
                            <td>Name</td>
                            <td>Faculty</td>
                            <td>Department</td>
                            <td>Appointment</td>
                            <td>contact</td>
			            </tr>
                    </thead>
                    
                    <tbody>
                        {cells}
                    </tbody>                       
                </table>

                <div className="list-config">
                    <div className="listsize">
                        <span> Show </span>
                        <select 
                            className="select-listsize"
                            id="listsize" 
                            defaultValue="15" 
                            onChange={ e => this.setState({ listSize: e.target.value })}>
                            <option value="15"> 15 </option>
                            <option value="30"> 30 </option>
                            <option value="60"> 60 </option>
                        </select>
                        <span> entries </span>
                    </div> 

                    <div className="pagination">
                        {FirstBtn}
                        {PreviousBtn}
                        {CurrentPageBtn}
                        {NextBtn}
                        {LastBtn}
                    </div>   
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        loadList: () => {
            dispatch(loadList());
        },
        loadToolId: () => {
            dispatch(loadToolId());
        }
    };
};

const mapStateToProps = state => {
    return { officehours: state.reducer };
};

export default connect(mapStateToProps, mapDispatchToProps) (LecturerList);