import Image from "next/image";


export default function PropWhy({ src, alt, index }: { src: string; alt: string; index: number }) {
    return (
        <div>
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
            />
        </div>
    );
}