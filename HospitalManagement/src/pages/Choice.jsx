import '../style/choice.css'

function Choice(){
    return(
        <>
            <div className="choice-container">
                <div className="container-fluid">
                    <div className="heading bg-primary">
                        <h2>Select Role</h2>
                    </div>
                    <div className="role-cards">
                        <button type="button" class="btn btn-outline-success"><a href="adminlog">Admin</a></button>
                        <button type="button" class="btn btn-outline-success"><a href="stafflog">Staff</a></button>
                        <button type="button" class="btn btn-outline-success"><a href="doctorlog">Doctor</a></button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Choice;