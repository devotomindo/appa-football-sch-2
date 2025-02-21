import Image from "next/image";

interface FormationImageProps {
  title: string;
  imageSrc?: string;
  altText: string;
}

export function FormationImage({
  title,
  imageSrc,
  altText,
}: FormationImageProps) {
  return (
    <div className="w-full sm:space-y-6 md:w-1/3 md:space-y-2">
      <p className="mb-2 text-center font-bold capitalize sm:text-xl md:h-14 md:text-base lg:h-8">
        {title}
      </p>
      <div className="relative">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={altText}
            width={500}
            height={500}
            className="w-full sm:mx-auto sm:w-1/2"
          />
        )}
      </div>
    </div>
  );
}
