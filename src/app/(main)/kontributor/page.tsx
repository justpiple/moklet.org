import { H1, H4, P } from "@/app/_components/global/Text";
import { SectionWrapper } from "@/app/_components/global/Wrapper";
import { sortData, type Developer } from "@/utils/contributorsSorting";
import DeveloperFigure from "./_components/DeveloperFigure";
import GitHubContributor from "./_components/GithubContributor";

export interface GitHubContributorType {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export default async function Developers() {
  const [contributorsData, githubData] = (await Promise.all([
    fetch(
      "https://raw.githubusercontent.com/mokletdev/moklet.org/refs/heads/development/public/contributors.json",
    ).then((res) => res.json()),
    fetch(
      "https://api.github.com/repos/mokletdev/moklet.org/contributors?per_page=30",
    ).then((res) => res.json()),
  ])) as [Array<Developer>, Array<GitHubContributorType>];

  return (
    <SectionWrapper id="contributors">
      <div>
        <div className="flex flex-col gap-[18px] mb-6 text-wrap">
          <H1>Kontributor Moklet.org</H1>
          <div className="flex flex-col gap-4">
            <P>
              Selamat datang di halaman kontributor Moklet.org! Anda akan
              menemukan daftar kontributor Moklet.org beserta gambaran singkat
              tentang peran atau kontribusi yang mereka berikan. Baik melalui
              kontribusi kode, perbaikan bug, peningkatan dokumentasi, perbaikan
              desain, atau dukungan komunitas, setiap individu ini telah
              memainkan peran penting dalam pembuatan proyek ini dan
              mendorongnya maju.
            </P>
            <P>
              Proyek ini bersifat open-source dan dapat diakses di{" "}
              <a
                href="https://github.com/mokletdev/moklet.org"
                target="_blank"
                className="text-primary-400 hover:underline"
              >
                github.com/mokletdev/moklet.org
              </a>
              . Kami mengundang siapapun yang ingin berkontribusi untuk
              bergabung dalam pengembangan website ini.
            </P>
          </div>
        </div>

        <div className="flex flex-col gap-[18px] mb-8 text-wrap">
          <H4>Informasi kontributor pada proyek open-source Moklet.org</H4>
          <ol className="px-6 list-decimal text-neutral-500">
            <li>
              <P>
                <b>Manager</b>
                <br />
                Pemimpin utama dalam proyek ini yang bertanggung jawab
                sepenuhnya terhadap keseluruhan proyek dan memandu anggota tim
                lainnya.
              </P>
            </li>
            <li>
              <P>
                <b>Maintainer</b>
                <br />
                Individu yang bertanggung jawab atas perkembangan dan kelancaran
                proyek, serta memberikan kontribusi yang signifikan.
              </P>
            </li>
            <li>
              <P>
                <b>Graphic & UI/UX Designer</b> <br />
                Bertanggung jawab merancang antarmuka pengguna (UI) yang
                intuitif dan menarik serta mengoptimalkan pengalaman pengguna
                (UX).
              </P>
            </li>
            <li>
              <P className="text-neutral-500">
                <b>Contributor</b> <br />
                Individu yang berpartisipasi dalam menulis kode, patch
                dokumentasi, atau memberikan kontribusi positif lainnya terhadap
                proyek ini.
              </P>
            </li>
          </ol>
        </div>

        <div>
          <H4>Kontributor GitHub</H4>
          <P className="mt-4 mb-8">
            Berikut adalah daftar kontributor yang telah memberikan kontribusi
            melalui GitHub.
          </P>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {githubData.map((contributor: GitHubContributorType) => (
              <GitHubContributor
                key={contributor.login}
                contributor={contributor}
              />
            ))}
          </div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortData(contributorsData).map((dev) => (
            <DeveloperFigure dev={dev} key={dev.name} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

export const revalidate = 10_800;
