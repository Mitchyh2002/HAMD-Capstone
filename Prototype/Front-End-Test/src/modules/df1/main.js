import './App.css';

export function df1_main() {
	return (
<div>
    <nav className="navbar navbar-inverse">
        <div className="container-fluid">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="{{ url_for('qa.index') }}">Bee Aware Forum</a>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
                <ul className="nav navbar-nav">
                    <li className="active"><a href="{{ url_for('qa.index') }}">Homepage</a></li>
                    <li><a href="{{ url_for('qa.public_my_post') }}">My post</a></li>
                    <li><a href="{{ url_for('qa.save') }}">My save</a></li>
                    <li><a href="{{ url_for('qa.public_qa') }}">post</a></li>
                </ul>
                <a className="btn btn-primary me-2 custom-btn" href="{{ url_for('auth.login') }}">Log in</a>
                <a className="btn btn-success custom-btn" href="{{ url_for('auth.register') }}">Register</a>
                <div className="btn-group">
                    <button type="button" className="btn btn-default dropdown-toggle custom-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        My Account <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        <li><a href="{{ url_for('qa.history') }}">History</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="{{ url_for('qa.profile') }}">User account</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <form className="navbar-form navbar-left" role="search" method="GET" action="{{ url_for('qa.searchinhome') }}">
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Search" name="q"></input>
            </div>
            <button type="submit" className="btn btn-default">Submit</button>
        </form>
    </nav>
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
    <h1><strong>Bee Forum</strong></h1>
    </div>
    </div>
);
};