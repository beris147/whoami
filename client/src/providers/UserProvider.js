// @flow
import React, { useState } from 'react';
import UserContext from 'contexts/UserContext';

import type { UserT } from 'common/types';

const UserProvider = ({ children }: any): React$Element<any> => {
	const [user: ?UserT, setUser: (u: UserT) => void ] = useState(undefined);
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}

export default UserProvider;