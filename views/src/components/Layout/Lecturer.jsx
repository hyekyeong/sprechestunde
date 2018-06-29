import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { 
    loadList, 
    loadLecturer,
    saveUserType,
    changeUserType,
    useSignupTool,
    changeWebsite,
    changeLocation,
    changeDate
} from "../api";
import LecturerList from '../Common/LecturerList.jsx';

class Lecturer extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            userId: null,
            status: false,
            modalStatus: null,
            selectedOpt: "sign-up",
            openMethodModal: false,
            openWebsiteModal: false,
            openLocationModal: false,
            openDateModal: false,
            openManageDiv: false,
            setStartDate: null,
            setEndDate: null,
            website: null,
            location: null,
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            day: null,
            goToSignup: false,
            manageDiv: true,
            manageWebsite: false,
            manageLocation: false,
            manageDate: false
        }
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }
    
    componentDidMount() {
        this.props.loadList();
        this.props.loadLecturer(this.props.userId);
        this.setState({ userId: this.props.userId });
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.props !== nextProps){
            if( nextProps.officehours.hasType === false ){
                this.setState({ 
                    openMethodModal: true,
                    modalStatus: "create"
                });
            }/*
            if( 
                nextProps.officehours.signupUrl !== null &&
                nextState.goToSignup === true
             ){
                const toolId = nextProps.officehours.signupUrl[0].TOOL_ID;
                const signupUrl = "http://localhost:8080/portal/directtool/"+toolId;
                parent.location.href = signupUrl;
            }*/
        }

        if(this.state !== nextState) {
            if (
                this.state.selectedOpt === "sign-up" &&
                nextState.status === true ){
                if ( nextState.modalStatus === "create" ){
                    this.props.saveUserType(
                        nextState.userId,
                        nextState.selectedOpt,
                        null,
                        null,
                        "0000-00-00",
                        "0000-00-00",
                        "00:00:00",
                        "00:00:00",
                        null
                    );
                };
                if(nextState.modalStatus === "update"){
                    this.props.changeUserType(
                        nextState.userId,
                        nextState.selectedOpt,
                        null,
                        null,
                        "0000-00-00",
                        "0000-00-00",
                        "00:00:00",
                        "00:00:00",
                        null
                    );
                };
            };

            if  (
                ( nextState.selectedOpt === "e-mail" || nextState.selectedOpt === "web-site" ) &&
                nextState.userId !== null &&
                nextState.selectedOpt !== null &&
                nextState.location !== null &&
                nextState.startDate !== null &&
                nextState.endDate !== null &&
                nextState.startTime !== null &&
                nextState.endTime !== null &&
                nextState.day !== null &&
                nextState.status === true
            ){
                if(nextState.modalStatus === "create"){
                    this.props.saveUserType(
                        nextState.userId,
                        nextState.selectedOpt,
                        nextState.website,
                        nextState.location,
                        nextState.startDate,
                        nextState.endDate,
                        nextState.startTime,
                        nextState.endTime,
                        nextState.day
                    );
                };

                if(nextState.modalStatus === "update"){
                    this.props.changeUserType(
                        nextState.userId,
                        nextState.selectedOpt,
                        nextState.website,
                        nextState.location,
                        nextState.startDate,
                        nextState.endDate,
                        nextState.startTime,
                        nextState.endTime,
                        nextState.day
                    );
                };
            }
        }
        
    }

    setDefault() {
        this.setState({
            status: false,
            modalStatus: null,
            selectedOpt: "sign-up",
            openMethodModal: false,
            openWebsiteModal: false,
            openLocationModal: false,
            openDateModal: false,
            openManageDiv: false,
            setStartDate: null,
            setEndDate: null,
            website: null,
            location: null,
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            day: null,
            goToSignup: false,
            manageDiv: true,
            manageWebsite: false,
            manageLocation: false,
            manageDate: false
        });
    }

    handleOptChange(e) { this.setState({ selectedOpt: e.target.id }); }

    handleStartDateChange(startDate) { 
        const tempStartDate = startDate.format('YYYY[.]MM[.]DD');
        this.setState({ 
            setStartDate: startDate,
            startDate: tempStartDate }); 
    }

    handleEndDateChange(endDate) { 
        const tempEndDate = endDate.format('YYYY[.]MM[.]DD');
        this.setState({ 
            setEndDate: endDate,
            endDate: tempEndDate }); 
    }

    handleStartTimeChange(e) { 
        const tempTime = e.target.value+":00";
        this.setState({ startTime: tempTime }); 
    }

    handleEndTimeChange(e) { 
        const tempTime = e.target.value+":00";
        this.setState({ endTime: tempTime }); 
    }

    handleDayChange(e) { this.setState({ day: e.target.value }); }

    handleGoBackfromLocationChange() {
        if (this.state.selectedOpt === "web-site") {
            this.setState({ openLocationModal: false, openWebsiteModal: true });
        } else if (this.state.selectedOpt === "e-mail") {
            this.setState({ openLocationModal: false, openMethodModal: true });
        }
    }

    checkValidURL(str) {
        const pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
        if ( pattern.test(str) ){
            this.setState({ website: str });
        } else {
            this.setState({ website: null });
        }
    }

    render() {
        console.log("props", this.props);
        console.log("state", this.state);

        const userId = this.props.userId;
        const { list, hasType, typeData, signupUrl } = this.props.officehours;
        const { selectedDay, isDisabled } = this.state;
        const contactType = ( hasType === null || hasType === false ) ? null : this.props.officehours.typeData[0].TYPE;
        
        const toolId = ( signupUrl === null || signupUrl === undefined ) ? null : signupUrl[0].TOOL_ID;
        const signupToolUrl = "http://localhost:8080/portal/directtool/"+toolId;
        console.log(signupToolUrl);
        const MethodModal = (
            <div className={`${ this.state.openMethodModal ? "open-modal" : "close" }`}>
                <div className="modal-head method">
                    <span>Select your contact method</span>
                    <button 
                        className={`close-btn ${ this.state.modalStatus === "update" ? "" : "close" }`}
                        onClick={() => this.setDefault()}>
                        X
                    </button>
                </div>
    
                <div className="radio-group opt1">
                    <input 
                        type="radio" 
                        id="sign-up" 
                        value="Sign-up" 
                        checked={this.state.selectedOpt === "sign-up"}
                        onChange={e => this.handleOptChange(e)}
                        className="styled-radio" 
                    />
                    <label 
                        htmlFor="sign-up"
                        className="styled-radio-input"
                    >Sign-up</label>
                </div>
    
                <div className="radio-group opt2">
                    <input 
                        type="radio" 
                        id="e-mail" 
                        value="E-mail" 
                        checked={this.state.selectedOpt === "e-mail"}
                        onChange={e => this.handleOptChange(e)}
                        className="styled-radio" 
                    />
                    <label 
                        htmlFor="e-mail"
                        className="styled-radio-input"
                    >E-Mail</label>
                </div>
    
                <div className="radio-group opt3">
                    <input 
                        type="radio" 
                        id="web-site" 
                        value="Web-site" 
                        checked={this.state.selectedOpt === "web-site"}
                        onChange={e => this.handleOptChange(e)}
                        className="styled-radio" 
                    />
                    <label 
                        htmlFor="web-site"
                        className="styled-radio-input"
                    >Web-seite</label>
                </div>
    
                <div className="modal-btn-group">
                    { this.state.selectedOpt === "sign-up" &&
                        <button 
                            className="modal-btn"
                            onClick={() => {
                                this.setState({ 
                                    openMethodModal: false,
                                    status:true });
                                this.props.useSignupTool(this.state.userId);
                            }}>
                            Confirm
                        </button>
                    }

                    { this.state.selectedOpt === "e-mail" &&
                        <button 
                            className="modal-btn"
                            onClick={() => this.setState({ 
                                openMethodModal: false, 
                                openLocationModal: true })}>
                            Next
                        </button>
                    }
                    { this.state.selectedOpt === "web-site" &&
                        <button 
                            className="modal-btn"
                            onClick={() => this.setState({ 
                                openMethodModal: false, 
                                openWebsiteModal: true })}>
                            Next
                        </button>
                    }
                </div>
            </div>
        );

        const WebsiteModal = (
            <div className={`${ this.state.openWebsiteModal ? "open-modal" : "close" }`}>
                <div className="modal-head web">
                    <span>Web-site</span>
                    <button 
                        className={`close-btn ${ this.state.modalStatus === "update" || "modify" ? "" : "close" }`}
                        onClick={() => this.setDefault()}>
                        X
                    </button>
                </div>
                <div>
                    <input 
                        className="website-input"
                        type="url" 
                        name="website" 
                        onChange={e => this.checkValidURL(e.target.value)}/>
                </div>
                
                <div 
                    className={`modal-btn-group ${ (this.state.modalStatus === "create" || this.state.modalStatus === "update") ? "" : "close" }`}>
                    <button 
                        className="modal-btn"
                        onClick={() => this.setState({ 
                            openWebsiteModal: false, 
                            openMethodModal: true })}>
                        Back
                    </button>
                    <button 
                        className="modal-btn"
                        onClick={() => this.setState({ 
                            openWebsiteModal: false, 
                            openLocationModal: true })}
                        disabled={!this.state.website}>
                        Next
                    </button>
                </div>

                <div 
                    className={`modal-btn-group ${ this.state.modalStatus === "modify" ? "" : "close" }`}>
                    <button
                        className="modal-btn"
                        onClick={() => {
                            this.props.changeWebsite(this.state.userId, this.state.website);
                            this.setState({ openWebsiteModal: false });
                            this.setDefault();
                        }}
                        disabled={!this.state.website}>
                        Save
                    </button>
                </div>
            </div>
        );

        const LocationModal = (
            <div className={`${ this.state.openLocationModal ? "open-modal" : "close" }`}>
                <div className="modal-head location">
                    <span>Location</span>
                    <button 
                        className={`close-btn ${ this.state.modalStatus === "update" || "modify" ? "" : "close" }`}
                        onClick={() => this.setDefault()}>
                        X
                    </button>
                </div>
                <div>
                    <input 
                        className="location-input"
                        type="text" 
                        onChange={e => this.setState({ location: e.target.value })}/>    
                </div>
                
                <div 
                    className={`modal-btn-group ${ (this.state.modalStatus === "create" || this.state.modalStatus === "update") ? "" : "close" }`}>
                    <button 
                        className="modal-btn"
                        onClick={() => this.handleGoBackfromLocationChange()}>
                        Back
                    </button>
                    <button 
                        className="modal-btn"
                        onClick={() => this.setState({ openLocationModal: false, openDateModal: true })}
                        disabled={!this.state.location}>
                        Next
                    </button>
                </div>

                <div 
                    className={`modal-btn-group ${ this.state.modalStatus === "modify" ? "" : "close" }`}>
                    <button
                        className="modal-btn"
                        onClick={() => {
                            this.props.changeLocation(this.state.userId, this.state.location);
                            this.setState({ openLocationModal: false });
                            this.setDefault();
                        }}
                        disabled={!this.state.location}>
                        Save
                    </button>
                </div>
            </div>
        );

        const DateModal = (
            <div className={`${ this.state.openDateModal ? "open-modal" : "close" }`}>
                <div className="modal-head date">
                    <span>Date of Appointment</span>
                    <button 
                        className={`close-btn ${ this.state.modalStatus === "update" || "modify" ? "" : "close" }`}
                        onClick={() => this.setDefault()}>
                        X
                    </button>
                </div>

                <div className="set-date-container">
                    <div className="set-date-div">
                        <span> Start date </span>
                        <DatePicker
                            dateFormat="DD/MM/YYYY"
                            placeholderText="Click to select a date"
                            selected={this.state.setStartDate}
                            onChange={this.handleStartDateChange} />
                    </div>

                    <div>
                        <span> End date </span>
                        <DatePicker
                            dateFormat="DD/MM/YYYY"
                            placeholderText="Click to select a date"
                            selected={this.state.setEndDate}
                            onChange={this.handleEndDateChange} />   
                    </div>                 
                </div>

                <div className="set-time-container">
                    <div className="set-time-div">
                        <label htmlFor="starttime"> Start time </label>
                        <input type="time" id="starttime" onChange={e=>this.handleStartTimeChange(e)} />
                    </div>

                    <div>
                        <label htmlFor="endtime"> End time </label>
                        <input type="time" id="endtime" onChange={e=>this.handleEndTimeChange(e)} />
                    </div>
                </div>

                <div className="set-day-container">
                    <span> Every </span>
                    <select id="set-day" defaultValue="" onChange={ e => this.handleDayChange(e) }>
                        <option value=""  disabled hidden>choose Day</option>
                        <option value="Monday"> Monday </option>
                        <option value="Tuesday"> Tuesday </option>
                        <option value="Wednesday"> Wednesday </option>
                        <option value="Thursday"> Thursday </option>
                        <option value="Friday"> Friday </option>
                    </select>
                </div>                

                <div 
                    className={`modal-btn-group ${ (this.state.modalStatus === "create" || this.state.modalStatus === "update") ? "" : "close" }`}>
                    <button 
                        className="modal-btn"
                        onClick={() => this.setState({ openDateModal: false, openLocationModal: true })}>
                        Back
                    </button>
                    
                    <button 
                        className="modal-btn"
                        disabled={ 
                            this.state.setStartDate === null ||
                            this.state.setEndDate === null ||
                            this.state.startTime === null || 
                            this.state.endTime === null || 
                            this.state.day === null 
                        }
                        onClick={() => {
                            const startDate = this.state.setStartDate.format('YYYY[.]MM[.]DD');
                            const endDate = this.state.setEndDate.format('YYYY[.]MM[.]DD');
                            this.setState({
                                openDateModal: false,
                                startDate: startDate,
                                endDate: endDate,
                                status: true
                             });    
                            }} >
                        Confirm
                    </button>
                </div>

                <div 
                    className={`modal-btn-group ${ this.state.modalStatus === "modify" ? "" : "close" }`}>
                    <button
                        className="modal-btn"
                        disabled={ 
                            this.state.setStartDate === null ||
                            this.state.setEndDate === null ||
                            this.state.startTime === null || 
                            this.state.endTime === null || 
                            this.state.day === null 
                        }
                        onClick={() => {
                            this.props.changeDate(this.state.userId, this.state.startDate, this.state.endDate, this.state.startTime, this.state.endTime, this.state.day);
                            this.setState({ openDateModal: false });
                            this.setDefault();
                        }}>
                        Save
                    </button>
                </div>
            </div>
        );

        const ManageSignup = (
            <button 
                className="manage-Btn"
                onClick={() => parent.location.href=signupToolUrl }>
                Manage</button>
        );

        const ManageWebsite = (
            <button 
                className="manage-Btn"
                onClick={() => this.setState({
                    openWebsiteModal: true,
                    modalStatus: "modify",
                    manageWebsite: true
                }) }>
                Change Website</button>
        );

        const ManageLocation = (
            <button 
                className="manage-Btn"
                onClick={() => this.setState({
                    openLocationModal: true,
                    modalStatus: "modify",
                    manageLocation: true                        
                }) }>
                Change Location</button>
        );

        const ManageDate = (
            <button 
                className="manage-Btn"
                onClick={() => this.setState({
                    openDateModal: true,
                    modalStatus: "modify",
                    manageDate: true
                }) }>
                Change Date</button>
        );

        return(
            <div>
                <div className={`manageDiv ${ ( this.state.manageDiv && hasType ) ? "" : "close" }`}>
                    { contactType === "sign-up" &&
                    <div className="manage-signup">
                        <span>You can manage your office hours from the sign up tool in your site.</span>
                        {ManageSignup}
                    </div>
                    }

                    { contactType === "e-mail" &&
                    <div className="change-contact-data">
                        {ManageLocation}
                        {ManageDate}
                    </div>
                    }

                    { contactType === "web-site" &&
                    <div className="change-contact-data">
                        {ManageWebsite}
                        {ManageLocation}
                        {ManageDate}
                    </div>
                    }

                    <div className="change-contact">
                        <button 
                            className="change-contact-Btn"
                            onClick={() => this.setState({
                                openMethodModal: true,
                                modalStatus: "update"
                            })}>
                            Change the contact method-type
                        </button>
                    </div>          
                </div>

                <div>
                    {MethodModal}
                    {WebsiteModal}
                    {LocationModal}
                    {DateModal}
                </div>

                <LecturerList loginId={this.props.officehours.userEid}/>
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
        loadLecturer: id => {
            dispatch(loadLecturer(id));
        },
        saveUserType: ( id, type,  web_site, location, start_date, end_date, start_time, end_time, day ) => {
            dispatch(saveUserType( id, type,  web_site, location, start_date, end_date, start_time, end_time, day ));
            window.location.reload();
        },
        changeUserType: ( id, type,  web_site, location, start_date, end_date, start_time, end_time, day ) => {
            dispatch(changeUserType( id, type,  web_site, location, start_date, end_date, start_time, end_time, day ));
            window.location.reload();
        },
        useSignupTool: id => {
            dispatch(useSignupTool(id));
            window.location.reload();
        },
        changeWebsite: ( id, website ) => {
            dispatch(changeWebsite( id, website ));
            window.location.reload();
        },
        changeLocation: ( id, location ) => {
            dispatch(changeLocation( id, location ));
            window.location.reload();
        },
        changeDate: ( id, start_date, end_date, start_time, end_time, day ) => {
            dispatch(changeDate( id, start_date, end_date, start_time, end_time, day ));
            window.location.reload();
        }
    }
};

const mapStateToProps = state => {
    return { officehours: state.reducer };
};

export default connect(mapStateToProps, mapDispatchToProps) (Lecturer);