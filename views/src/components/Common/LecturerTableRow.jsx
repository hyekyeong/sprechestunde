import React, { Component } from 'react';
import { connect } from "react-redux";
import { getPermission } from "../api";

class LecturerTableRow extends Component {
    constructor(props){
        super(props);

        this.state = {
        }
    }

    handleGotoSignup(e) {
        this.props.getPermission(this.props.officehours.userEid, e);
        const siteId="~"+e;
        const pageId= this.props.officehours.toolId.find(s => s.SITE_ID === siteId);
        setTimeout(()=>{ parent.location.href="http://localhost:8080/portal/directtool/"+pageId.TOOL_ID }, 1500);
    }
    handleGotoEmail(e) {
        location.href="mailto:"+e;
    }

    handleGotoWeb(e) {
        window.open("http://"+e);
    }

    render() {
        const { lecturer, fromSignup } = this.props;
        const { EMAIL, USER_ID, Web_site } =this.props.lecturer;
        const serverUrl = "http://localhost:8080/direct/profile/";
        var appointment;

        if( lecturer.TYPE === "sign-up" ) {
            if ( fromSignup === undefined ) {
                appointment = "";
            } else {
                appointment = fromSignup.title + "\n" + fromSignup.location + "\n" + fromSignup.start_time.split("-")[2].split("T")[0] + "." + fromSignup.start_time.split("-")[1] + "." + fromSignup.start_time.split("-")[0] + " " + fromSignup.start_time.split("T")[1].substring(0,5) + " - " + fromSignup.end_time.split("T")[1].substring(0,5);
            }
        } else if ( lecturer.TYPE === "web-site" || lecturer.TYPE === "e-mail") {
            appointment = lecturer.Location + "\n" + lecturer.Start_date.split("-")[2].split("T")[0] + "." + lecturer.Start_date.split("-")[1]+ "." + lecturer.Start_date.split("-")[0]+ " - "+ lecturer.End_date.split("-")[2].split("T")[0] + "." + lecturer.End_date.split("-")[1]+ "." + lecturer.End_date.split("-")[0] + "\nEvery " + lecturer.Day + " " + lecturer.Start_time.substring(0,5) + " - " + lecturer.End_time.substring(0,5);
        }

        
        return(
            <tr className="">
                <td>
                    <img src={serverUrl+lecturer.USER_ID+"/image"} style={{width: "100px", margin: "0 auto", display: "block"}}/>
                </td>
                <td>{lecturer.NAME}</td>
                <td>{lecturer.FACULTY}</td>
                <td>{lecturer.DEPARTMENT}</td>
                <td>{appointment}{}</td>
                <td>
                    { lecturer.TYPE === "sign-up" &&
                    <button
                        id="signup"
                        className="manage-Btn"
                        onClick={ e => this.handleGotoSignup(USER_ID)}>
                        {lecturer.TYPE}
                    </button>
                    }

                    { lecturer.TYPE === "e-mail" &&
                    <button
                        id="email"
                        className="manage-Btn"
                        onClick={ e => this.handleGotoEmail(EMAIL)}>
                        {lecturer.TYPE}
                    </button>
                    }

                    { lecturer.TYPE === "web-site" &&
                    <button
                        id="website"
                        className="manage-Btn"
                        onClick={ e => this.handleGotoWeb(Web_site)}>
                        {lecturer.TYPE}
                    </button>
                    }
                </td>
            </tr>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        getPermission: (Eid, siteId) => {
            dispatch(getPermission(Eid,siteId));
        }
    };
};

const mapStateToProps = state => {
    return { officehours: state.reducer };
};

export default connect(mapStateToProps, mapDispatchToProps) (LecturerTableRow);