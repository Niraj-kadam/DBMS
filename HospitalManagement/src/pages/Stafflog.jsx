import '../style/adminlog.css'

function Stafflog(){
    return(
        <>
            <div className="adminlog-container">
                <div className="container-fluid">
                    <div className="adminlog-user bg-primary">
                        <h2>Staff Login</h2>
                    </div>
                    <form action="">
                        <input type="text" placeholder='Email' />
                        <input type="password" placeholder='Password' />
                        <button className="btn btn-outline-success"><a href="">Login</a></button>
                        <hr />
                        <div className="end">
                            <p>New Staff?</p>
                            <span><a href="register">Register Here</a></span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Stafflog;