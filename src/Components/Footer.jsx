

export default function Footer(){
    const date = new Date();

    return(
        <div className="footer">
            <p>{date.toString()}</p>
        </div>
    )
}