var AppBar = React.createClass({
    render() {        
        return (
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper">
                      <a href="#" className="brand-logo center">RxJS ReactJS SocketIO MaterializeCSS</a>
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
                <h4>Active Users</h4>
                <table className="striped">
                    <thead>
                        <tr>
                            <th data-field="id">Nickname</th>
                            <th data-field="name">Time joined</th>              
                        </tr>
                    </thead>

                    <tbody>                    
                    { 
                        this.props.data.map((user, index) => {
                            return <tr> 
                                <td>{user.nickname}</td>
                                <td>{moment(user.connectTime).format('YYYY-MM-DD HH:mm:ss')}</td>
                            </tr>
                        })
                    }
                    </tbody>
                 </table>    
            </div>
        );
    }
});

var ChatPane = React.createClass({
    render() {
        console.log(this.props);
        return (
            <div>
                <h4>Your nickname is {this.props.data.nickname}</h4>
                <ul className="collection">
                    
                </ul>
                <div className="row">
                    <div className="input-field col s12">
                        <input id="first_name2" type="text" className="validate" />
                        <label className="active" for="first_name2">Type your chat, enter/return to send</label>
                    </div>
                </div>
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
        
        socket.on('my socketId', function(data) {
            console.log('my socketId event ', data.socketId, data.connectTime); 
            props.socketId = data.socketId;
            props.connectTime = data.connectTime;
            
            socket.emit('client connect', props); //{nickname, socketId, connectTime}
        });
        
        //Happens first, same time with io.on('connection') on server, but useless 
        //because it has not socketId
        socket.on('connect', function() {
            console.log('on connect event ', props, '.  We do nothing with this event');
        });

        socket.on('all users', function(data) {   
            console.log('new user');
            console.log(data);            
            that.setState({users: data});            
        });                
    },
    render() {
        return (
            <div>
                <AppBar />
                <div className="row">                  
                    <div className="col s6"><ChatPane data={{nickname: this.props.nickname}}/></div>
                    <div className="col s6"><PresencePane data={this.state.users} /></div>
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

