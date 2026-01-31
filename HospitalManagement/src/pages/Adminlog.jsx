import '../style/adminlog.css'

function Adminlog() {
    return (
        <>
            <div className="adminlog-container">
                <div className="container-fluid">
                    <div className="adminlog-user bg-primary">
                        <h2>Admin Login</h2>
                    </div>
                    <form action="">
                        <input type="text" placeholder='Email' />
                        <input type="password" placeholder='Password' />
                        <button className="btn btn-outline-success"><a href="">Login</a></button>
                        <hr />
                        <div className="end">
                            <p>New admin?</p>
                            <span><a href="">Register Here</a></span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Adminlog;