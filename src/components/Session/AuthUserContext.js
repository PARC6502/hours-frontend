import React from 'react';

const AuthUserContext = React.createContext({
    id: null,
    email: null
});

export default AuthUserContext;