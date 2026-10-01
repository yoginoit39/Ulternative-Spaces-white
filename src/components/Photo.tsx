import Image from 'next/image';
import blur from '@/lib/blur.json';

const BLUR = blur as Record<string, string>;

/**
 * A photograph that fills its (positioned) parent. Served right-sized from
 * the pre-rendered files in public/images/opt, with a blurred placeholder
 * while it loads. `sizes` is how wide it is shown, e.g. "(max-width: 899px) 100vw, 50vw".
 */
export default function Photo({ src, alt, sizes, priority }: {
  src: string; alt: string; sizes: string; priority?: boolean;
}) {
  const placeholder = BLUR[src];
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={placeholder ? 'blur' : 'empty'}
      blurDataURL={placeholder}
      style={{ objectFit: 'cover' }}
    />
  );
}
