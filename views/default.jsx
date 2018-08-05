import React from 'react';

class DefaultLayout extends React.Component {
    render() {
      return (
        <html>
            <head>
                <meta charSet="UTF-8"/>
                <title>Sprechestunde</title>
            </head>
            <body>
                <h3>Sprechestunde</h3>
                <div id="root">
                    <div className="userid">{this.props.userId}</div>
                </div>
  
                <script type="text/javascript" src="build/bundle.js"></script>
            </body>
        </html>
      );
    }
  }
  
  module.exports = DefaultLayout;