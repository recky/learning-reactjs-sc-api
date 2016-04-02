var Note = React.createClass({
    getInitialState: function() {
        return {
            editing: false
        }
    },
    componentWillMount: function() {
        this.style = {
            right: this.randomBetween(0, window.innerWidth - 150) + 'px',
            top: this.randomBetween(0, window.innerHeight - 150) + 'px',
            transform: 'rotate(' + this.randomBetween(-15, 15) + 'deg)',
            backgroundColor: this.randomColor()
        };
    },
    componentDidMount: function(){
        $(this.getDOMNode()).draggable();
    },
    randomColor: function(){
      return('#'+Math.floor(Math.random()*16777215).toString(16));
    },
    randomBetween: function(min, max) {
        return (min + Math.ceil(Math.random() * max));
    },
    edit: function() {
        this.setState({editing: true});
    },
    save: function() {
        this.props.onChange(this.refs.newText.getDOMNode().value, this.props.index);
        this.setState({editing: false});
    },
    remove: function() {
        this.props.onRemove(this.props.index);
    },
    play: function(){
        this.props.onPlay(this.props.index);
    },
    stop: function(){
      this.props.onStop();
    },
    renderDisplay: function() {
        return (
            <div className="note"
                style={this.style}>
                <p>{this.props.children}</p>
                <span>
                    <button onClick={this.play}
                            className="btn btn-success btn-xs glyphicon glyphicon-play"/>
                    <button onClick={this.stop}
                            className="btn btn-warning btn-xs glyphicon glyphicon-stop"/>
                    <button onClick={this.edit}
                            className="btn btn-primary btn-xs glyphicon glyphicon-pencil"/>
                    <button onClick={this.remove}
                            className="btn btn-danger btn-xs glyphicon glyphicon-trash"/>
                </span>
            </div>
            );
    },
    renderForm: function() {
        return (
            <div className="note" style={this.style}>
            <textarea ref="newText" defaultValue={this.props.children} 
            className="form-control"></textarea>
            <button onClick={this.save} className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk" />
            </div>
            )
    },
    render: function() {
        if (this.state.editing) {
            return this.renderForm();
        }
        else {
            return this.renderDisplay();
        }
    }
});

var Board = React.createClass({
    propTypes: {
        count: function(props, propName) {
            if (typeof props[propName] !== "number"){
                return new Error('The count property must be a number');
            }
            if (props[propName] > 100) {
                return new Error("Creating " + props[propName] + " notes is ridiculous");
            }
        }
    },
    getInitialState: function() {
        return {
            notes: [],
            SC_CLIENT : "8893cc91a82e5ef42b7714426176c635",
            audio : new Audio
        };
    },
    nextId: function() {
        this.uniqueId = this.uniqueId || 0;
        return this.uniqueId++;
    },
    componentWillMount: function() {
        var self = this;

        if(this.props.count) {
            self.soundcloud({
                limit: 20
            });
        }

        var urlImg = 'https://source.unsplash.com/random/'+window.innerWidth+'x'+window.innerHeight+'/?wall';
        this.style = {
            background: 'url("'+urlImg+'") 0 0'
        }
    },
    soundcloud: function(options){
        var self = this;
        SC.initialize({
            client_id : self.state.SC_CLIENT
        });
        var url ='/tracks';
        SC.get(url, options).then(function(tracks){
            if(typeof options.limit === 'undefined'){
                console.log(1 + Math.ceil(Math.random() * tracks.length));
                self.add(tracks[1 + Math.ceil(Math.random() * tracks.length)]);
            }else {
                tracks.forEach(function (track) {
                    self.add(track);
                });
            }
        });
    },
    add: function(text) {
        var arr = this.state.notes;
        arr.push({
            id: this.nextId(),
            note: text.title,
            all:text
        });
        this.setState({notes: arr});
    },
    update: function(newText, i) {
        var arr = this.state.notes;
        arr[i].note = newText;
        this.setState({notes:arr});
    },
    remove: function(i) {
        var arr = this.state.notes;
        arr.splice(i, 1);
        this.setState({notes: arr});
    },
    play: function(x){
        var arr = this.state.notes;
        var url = arr[x].all.stream_url+'?client_id='+this.state.SC_CLIENT;
        this.state.audio.setAttribute('src', url);
        this.state.audio.play();
    },
    stop: function(){
        this.state.audio.pause();
    },
    eachNote: function(note, i) {
         return (<Note key={note.id}
                       index={i}
                       onChange={this.update}
                       onRemove={this.remove}
                       onPlay={this.play}
                       onStop={this.stop}
                    >{note.note}
                </Note>);
    },
    render: function() {
        return (<div className="board" style={this.style}>
                    {this.state.notes.map(this.eachNote)}
                    <button className="btn btn-sm btn-success glyphicon glyphicon-plus"
                            //onClick={this.add.bind(null, "New Note")}/>
                            onClick={this.soundcloud.bind(null, {})}/>
            </div>

        );
    }
});


React.render(<Board count={20}/>,
    document.getElementById('react-container'));










