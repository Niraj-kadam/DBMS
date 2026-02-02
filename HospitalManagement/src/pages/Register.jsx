import '../style/register.css'

function Register(){
    return(
        <>
            <div className="register">
                <div className="container-fluid">
                    <div className="register-heading bg-primary">
                        <h2>Register</h2>
                    </div>
                    <form action="">
                        <input type="text" placeholder='ID'/>
                        <input type="text" placeholder='Email'/>
                        <input type="password" placeholder='Password'/>
                        <button className="btn btn-outline-success mt-4"><a href="">Register</a></button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register;