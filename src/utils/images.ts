import { isUnpicCompatible, unpicOptimizer, astroAsseetsOptimizer } from './images-optimization';
import type { ImageMetadata } from 'astro';
import type { OpenGraph } from '@astrolib/seo';

const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    // import all images inside `~/assets/images/` with their supported extensions.
    images = import.meta.glob('~/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}');
  } catch (error) {
    // If an error occurs, continue execution without breaking.
  }
  return images;
};

let _images: Record<string, () => Promise<unknown>> | undefined = undefined;

/**
 * Fetches and caches the local images.
 * Prevents reloading images multiple times by storing them in `_images`.
 */
export const fetchLocalImages = async () => {
  _images = _images || (await load());
  return _images;
};

/**
 * Finds an image based on the provided path.
 * @param imagePath - The path of the image (string or `ImageMetadata`).
 * @returns The image metadata, a direct URL, or null if not found.
 */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  // If the provided path is not a string, return it as is (it might already be an `ImageMetadata` object).
  if (typeof imagePath !== 'string') {
    return imagePath;
  }

  // If the path is an absolute URL (external or site root), return it unchanged.
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }

  // If the image path does not start with '~/assets/images', return it unchanged.
  if (!imagePath.startsWith('~/assets/images')) {
    return imagePath;
  }

  // Fetch cached images (or load them if not already cached).
  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/'); // Convert Astro-style path to project-relative path.

  // Check if the image exists in the imported images and return it.
  return images && typeof images[key] === 'function'
    ? ((await images[key]()) as { default: ImageMetadata })['default']
    : null;
};

/**
 * Adapts OpenGraph images by optimizing their URLs and metadata.
 * @param openGraph - The OpenGraph metadata object containing images.
 * @param astroSite - The site URL (used for resolving relative paths).
 * @returns An updated OpenGraph object with optimized images.
 */
export const adaptOpenGraphImages = async (
  openGraph: OpenGraph = {},
  astroSite: URL | undefined = new URL('')
): Promise<OpenGraph> => {
  // If no images are provided in OpenGraph metadata, return it unchanged.
  if (!openGraph?.images?.length) {
    return openGraph;
  }

  const images = openGraph.images;
  const defaultWidth = 1200;
  const defaultHeight = 626;

  // Process each image in OpenGraph metadata.
  const adaptedImages = await Promise.all(
    images.map(async (image) => {
      if (image?.url) {
        // Try to find and resolve the image (either as a URL or as `ImageMetadata`).
        const resolvedImage = (await findImage(image.url)) as ImageMetadata | string | undefined;
        if (!resolvedImage) {
          return {
            url: '',
          };
        }

        let _image;

        // If the resolved image is an external URL and is compatible with Unpic, optimize it using Unpic.
        if (
          typeof resolvedImage === 'string' &&
          (resolvedImage.startsWith('http://') || resolvedImage.startsWith('https://')) &&
          isUnpicCompatible(resolvedImage)
        ) {
          _image = (await unpicOptimizer(resolvedImage, [defaultWidth], defaultWidth, defaultHeight, 'jpg'))[0];
        } 
        // optimizes it using Astro's built-in asset optimizer.
        else if (resolvedImage) {
          const dimensions =
            typeof resolvedImage !== 'string' && resolvedImage?.width <= defaultWidth
              ? [resolvedImage?.width, resolvedImage?.height]
              : [defaultWidth, defaultHeight];
          _image = (
            await astroAsseetsOptimizer(resolvedImage, [dimensions[0]], dimensions[0], dimensions[1], 'jpg')
          )[0];
        }

        // If the optimization returned an image object, update its OpenGraph metadata.
        if (typeof _image === 'object') {
          return {
            url: 'src' in _image && typeof _image.src === 'string' ? String(new URL(_image.src, astroSite)) : '',
            width: 'width' in _image && typeof _image.width === 'number' ? _image.width : undefined,
            height: 'height' in _image && typeof _image.height === 'number' ? _image.height : undefined,
          };
        }
        return {
          url: '',
        };
      }

      // If no valid image is found, return an empty object.
      return {
        url: '',
      };
    })
  );

  // Return updated OpenGraph metadata with optimized images.
  return { ...openGraph, ...(adaptedImages ? { images: adaptedImages } : {}) };
};
