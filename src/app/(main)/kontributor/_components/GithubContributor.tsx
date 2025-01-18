import Image from "@/app/_components/global/Image";
import { GitHubContributorType } from "../page";

interface GitHubContributorProps {
  contributor: GitHubContributorType;
}

export default function GitHubContributor({
  contributor,
}: Readonly<GitHubContributorProps>) {
  return (
    <a
      href={contributor.html_url}
      target="_blank"
      className="flex flex-col items-center p-4 rounded-lg hover:bg-neutral-50 transition-all"
    >
      <Image
        src={contributor.avatar_url}
        alt={`${contributor.login}'s GitHub avatar`}
        width={80}
        height={80}
        className="rounded-full mb-2"
        unoptimized
      />
      <p className="text-sm font-medium text-center">{contributor.login}</p>
      <p className="text-xs text-neutral-500">
        {contributor.contributions} contributions
      </p>
    </a>
  );
}
