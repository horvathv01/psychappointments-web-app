

export default function Footer(){
    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return(
        <div className="footer">
            <p>{`PsychAppointments ${date.getFullYear()}. ${months[date.getMonth()]} ${date.getDate()}.`}</p>
        </div>
    )
}