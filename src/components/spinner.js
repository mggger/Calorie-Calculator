import React from 'react';


const LoadingSpinner = () => (
    <div style={{ height: `calc(100vh - 50px)` }}
        className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-50 z-50" >
        <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
        </div>
    </div>
);

export default LoadingSpinner;
