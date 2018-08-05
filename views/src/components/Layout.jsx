import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadUser } from "./api";
import Student from './Layout/Student.jsx';
import Lecturer from './Layout/Lecturer.jsx';

class Layout extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() { 
        this.props.loadUser(this.props.userId);
    }
    
    render() {
        return(
            <div className="main-layout">
                
                { !this.props.officehours.isLecturer && (
                    <Student userId={this.props.userId} />
                )}

                { this.props.officehours.isLecturer && (
                    <Lecturer userId={this.props.userId} />
                )}
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        loadUser: id => {
            dispatch(loadUser(id));
        }
    };
};

const mapStateToProps = state => {
    return { officehours: state.reducer };
};

export default connect(mapStateToProps, mapDispatchToProps) (Layout);