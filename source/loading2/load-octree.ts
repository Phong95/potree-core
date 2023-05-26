import { OctreeLoader } from './OctreeLoader';
import { GetUrlFn, XhrRequest } from '../loading/types';

export async function loadOctree(
	url: string,
	getUrl: GetUrlFn,
	xhrRequest: XhrRequest,
) {
	const trueUrl = await getUrl(url);
	const loader = new OctreeLoader();
	const { geometry } = await loader.load(trueUrl, xhrRequest);
	return geometry;
}
/**
 * 
 * @param url endpoint to download metadata.json
 * @param urlOcbinTree endpoint to download octree.bin
 * @param xhrRequest 
 * @returns 
 */
export async function loadOctree2(
	url: string, urlOcbinTree: string, urlHierarchy: string,
	xhrRequest: XhrRequest,
) {
	const loader = new OctreeLoader();
	const { geometry } = await loader.load2(url, urlOcbinTree, urlHierarchy, xhrRequest);
	return geometry;
}
