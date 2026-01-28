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
                        <button type="button" class="btn btn-outline-success">Admin</button>
                        <button type="button" class="btn btn-outline-success">Staff</button>
                        <button type="button" class="btn btn-outline-success">Doctor</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Choice;