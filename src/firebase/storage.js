import { storage } from './firebase';

export const getRootRef = () => storage.ref( 'public' );

export const getFileRef = path => {
	return getRootRef().child( path );
}
