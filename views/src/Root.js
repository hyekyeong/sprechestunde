import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";

import Layout from "./components/Layout.jsx";

const Root = ({ userId, store, history }) => (
    <Provider store={store}>
        <Layout userId={userId} history={history} store={store} />
    </Provider>
);

Root.propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

export default Root;
