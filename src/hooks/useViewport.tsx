import { useContext } from 'react';
import { ViewportContext } from '@context/ViewportContext';

const useViewport = () => {
	const { width, height } = useContext(ViewportContext);
	return { width, height };
};

export default useViewport;
