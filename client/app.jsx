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

var PresencePane = React.createClass({
    render() {        
        return (
            <div>
                <ul className="collection">
                    { 
                        this.props.data.map((user, index) => {
                            return <li className="collection-item">{user}</li>
                        })
                    }
                 </ul>    
            </div>
        );
    }
});

var ChatPane = React.createClass({
    render() {
        return (
            <div>
                
            </div>
        );
    }
});

var Main = React.createClass({
    getInitialState() {
        return {
            users: []
        }    
    },
    componentDidMount() {        
        var socket = io();
        var props = this.props;
        var users = this.state.users;
        var that = this;
        
        socket.on('connect', function() {
            console.log('on connect ', props);
            socket.emit('client connect', {
                'nickname': props.nickname
            });
        });

        socket.on('new user', function(data) {   
            console.log('new user');
            console.log(data.nickname);
            users.push(data.nickname);
            that.setState(users);            
        });                
    },
    render() {
        return (
            <div>
                <AppBar />
                <div className="row">                  
                    <div className="col s6"><PresencePane data={this.state.users} /></div>
                    <div className="col s6"><ChatPane /></div>
                </div>
            </div>
        );
    }
});

var createRandomNickname = function(len) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(var i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

React.render(<Main nickname={createRandomNickname(6)}/>, document.getElementById('container'));

