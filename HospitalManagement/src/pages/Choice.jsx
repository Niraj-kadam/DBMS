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
                        <button type="button" class="btn btn-outline-success"><a href="">Admin</a></button>
                        <button type="button" class="btn btn-outline-success"><a href="">Staff</a></button>
                        <button type="button" class="btn btn-outline-success"><a href="">Doctor</a></button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Choice;