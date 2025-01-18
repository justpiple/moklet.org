import Link from "next/link";
import Image from "@/app/_components/global/Image";
import { H4, P } from "@/app/_components/global/Text";

interface DeveloperData {
  name: string;
  role: string;
  picture: string;
  instagram: string;
  linkedin: string;
  website?: string;
}

export default function DeveloperFigure({
  dev,
}: Readonly<{ dev: DeveloperData }>) {
  return (
    <figure className="w-full bg-white rounded-xl p-6 grid grid-rows-[auto_1fr_auto] h-full gap-6">
      <div className="flex flex-col items-center text-center">
        <div className="max-w-[200px] sm:max-w-full w-full aspect-square mb-6 overflow-hidden rounded-xl">
          <Image
            src={dev.picture || "/placeholder.svg"}
            alt={`${dev.name}'s Picture`}
            width={280}
            height={280}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        <div className="w-full">
          <H4 className="mb-1 line-clamp-2">{dev.name}</H4>
          <P className="text-neutral-500 line-clamp-2">{dev.role}</P>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-200 self-end"></div>

      <div className="space-y-3">
        <ContactInfo
          label="Instagram"
          value={`@${dev.instagram}`}
          href={`https://instagram.com/${dev.instagram}`}
        />
        <ContactInfo
          label="LinkedIn"
          value={dev.linkedin}
          href={`https://linkedin.com/in/${dev.linkedin}`}
        />
        <ContactInfo
          label="Website"
          value={dev.website ?? "-"}
          href={dev.website ? `https://${dev.website}` : "#"}
        />
      </div>
    </figure>
  );
}

function ContactInfo({
  label,
  value,
  href,
}: Readonly<{
  label: string;
  value: string;
  href: string;
}>) {
  return (
    <div className="grid grid-cols-[5rem,1fr] items-start gap-2">
      <span className="text-sm text-neutral-500">{label}</span>
      <Link
        className="text-sm text-black hover:text-primary-400 transition-colors break-all line-clamp-1"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {value}
      </Link>
    </div>
  );
}
