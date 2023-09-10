

export default function Footer(){
    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function prepopulate(){
        fetch("http://localhost:5082/prepopulate", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        .then(data => data.text())
        .then(info => console.log(info));
    }

    return(
        <div className="footer">
            <p>{`PsychAppointments ${date.getFullYear()}. ${months[date.getMonth()]} ${date.getDate()}.`}</p>
            <button onClick={prepopulate}>Prepopulate</button>
        </div>
    )
}