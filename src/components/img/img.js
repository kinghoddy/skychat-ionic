import React from "react";
import './img.css';
import { IonSpinner } from "@ionic/react";

export default ({ src, shouldLazy, alt = "Image cant be loaded", objectFit = "cover" }) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [isValidSrc, setIsValidSrc] = React.useState(true);
    let img = React.createRef();
    React.useEffect(() => {

        function changeSrc() {
            let images = img.current
            console.log(images);
            if (images) {
                if (images.getBoundingClientRect().top <= window.innerHeight * 2 && images.getBoundingClientRect().top > -50) {
                    images.src = src
                }
            }
        }
        changeSrc()
        window.addEventListener('scroll', changeSrc)

    })
    return (
        <div className='wrapper'>
            {isValidSrc ? (
                <img
                    ref={img}
                    className={imageLoaded ? 'visible' : ''}
                    style={{ objectFit }}
                    src={shouldLazy ? null : src}
                    alt={alt}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setIsValidSrc(false)}
                />
            ) : (
                    <div className='noImg'>{alt}</div>

                )}
            {isValidSrc && !imageLoaded ? <div className='preload'> <IonSpinner style={{ color: 'red' }} /> </div> : null
            }
        </div>
    );
};