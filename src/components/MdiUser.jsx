import React from 'react';
import PropTypes from 'prop-types';  // Import untuk validasi prop

export function MdiUser({ color }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill={color}>
            <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"></path>
        </svg>
    );
}

MdiUser.propTypes = {
    color: PropTypes.string.isRequired,  // Validasi prop color
};
