import React, { Component } from 'react';
import { connect } from "react-redux";
import { loadList } from "../api";
import LecturerList from '../Common/LecturerList.jsx';

class Student extends Component {
    constructor(props){
        super(props);
    }
    
    componentDidMount() {
        this.props.loadList();
    }

    render() {
        return(
            <div>
                <LecturerList loginId={this.props.officehours.userEid}/>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        loadList: id => {
            dispatch(loadList(id));
        }
    };
};

const mapStateToProps = state => {
    return { officehours: state.reducer };
};

export default connect(mapStateToProps, mapDispatchToProps) (Student);