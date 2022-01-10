import Card from './Card';
import './catalogue.scss';
import { useContext } from 'react';
import { PicturesContext } from './PicturesContext';

const Catalogue = () => {
    const [pictures] = useContext(PicturesContext);

    return (
        <div className="catalogue">
            {pictures.length === 0
            ? <h1>Loading...</h1> 
            :pictures.map((picture, i) => 
                <Card key={i} picture={picture} />
            )}
        </div>
    )
}

export default Catalogue