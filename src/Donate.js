import React from 'react';

const Donate = () => {
    const address = "c6469203131ae3a107f303fd85de7e39bd148e74643c97d5131da08eea567124";
    const message = `Cheers 🥂 ! If you like what I do, feel free to donate to keep this page online. Just send ICP to the following address, it is instantly 🔥 to create cycle 🔄 for this website: ${address}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(address).then(() => {
            alert("Address copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <div style={{
            position: 'fixed', /* Fixed positioning */
            top: '0', /* Set top and left edges to the edge of the page */
            left: '0',
            width: '100vw', /* Full width */
            height: '100vh', /* Full height */
            zIndex: '1000', /* Make sure it sits on top of everything else */
            backgroundColor: 'rgba(0,0,0,0.5)' /* Semi-transparent */
            }}
        >
            <div className="flex items-center justify-center h-full">
                <div className="bg-white rounded-lg p-8 shadow-lg w-full md:w-2/3 lg:w-1/2">
                    <p className="mb-4">{message}</p>
                    <button className="bg-blue-500 text-white py-1 px-2 rounded mr-2" onClick={handleCopy}>
                        Copy Address
                    </button>
                    <button className="bg-gray-500 text-white py-1 px-2 rounded" onClick={() => window.history.back()}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Donate;
