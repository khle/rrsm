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
    getInitialState() {
        return {
            message: ''
        }
    },
    componentDidMount() {
        var that = this;
        var button = document.getElementById('sendBtn');
        var textField = document.getElementById('message-input');
        
        var clickStream = Rx.Observable.fromEvent(button, 'click').map(function (e) {
            return true;
        });
        var textEnteredStream = Rx.Observable.fromEvent(textField, 'keyup').map(function (e) {
            return e.target.value;
        });
                
        var mergedStream = textEnteredStream.takeUntil(clickStream);
        
        var text = '';
        var onNext = function(t) {
            text = t;
        }
        var onError = function(e) {}
        var onComplete = function() {            
            $.post('/message', {'message': text});
            textField.value = '';
            textField.focus();
            mergedStream.subscribe(onNext, onError, onComplete);
        }
        
        mergedStream.subscribe(onNext, onError, onComplete);                
    },
    render() {
        var value = this.state.message;
        console.log(this.props);        
        
        return (
            <div>
                <h4>Your nickname is {this.props.data.nickname}</h4>
                <ul className="collection">
                    
                </ul>
                <div className="row">
                    <div className="input-field col s10">
                        <input id="message-input" type="text" className="validate" ref="message" />
                        <label className="active" for="message-input">Type your chat, enter/return to send</label>
                    </div>
                    <div className="input-field col s2">
                        <a id="sendBtn" className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">send</i></a>
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
        
        socket.on('message', function(data) {               
            console.log(data);            
            that.setState(data); //data is { message: 'something like this' }
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

