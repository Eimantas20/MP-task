import './card.scss';

const Card = (props) => {
    const { small } = props.picture.urls;
    
    return (
        <div className="card">
            <img src={small} />
        </div>
    )
}

export default Card