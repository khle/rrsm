var AppBar = React.createClass({

    render() {
        return (
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper">
                      <a href="#" className="brand-logo center">React</a>
                        <ul id="nav-mobile" className="left hide-on-med-and-down">
                            <li><a href="#">About</a></li>                            
                      </ul>
                    </div>
                </nav>
            </div>
        );
    }

});

var Main = React.createClass({
    componentDidMount: function () {
        this.socket = io();
    },
    render: function() {
        return (
            <div>
                <AppBar />
                
            </div>
        );
    }
});

React.render(<Main />, document.getElementById('container'));
 
 
 (function () {
    var React = require('react'),
        injectTapEventPlugin = require("react-tap-event-plugin");

    //Needed for React Developer Tools
    window.React = React;

    //Needed for onTouchTap
    //Can go away when react 1.0 release
    //Check this repo:
    //https://github.com/zilverline/react-tap-event-plugin
    injectTapEventPlugin();

    

})();