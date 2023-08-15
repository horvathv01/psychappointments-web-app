

export default function Footer(){
    const date = new Date();

    return(
        <div>
            <p>{date.toString()}</p>
        </div>
    )
}