import { UnderlinedTitle } from "@/app/_components/global/Text";
import { SectionWrapper } from "@/app/_components/global/Wrapper";
import Saying from "./Saying";

export default function Opinions() {
  return (
    <SectionWrapper id="pendapat">
      <div className="flex flex-col justify-center">
        <UnderlinedTitle underlineClassName="w-[154px] md:w-[232px] top-4 md:top-[24px]">
          Kata Mereka yang Berorganisasi di Moklet
        </UnderlinedTitle>
        <div className="mt-[54px] flex flex-col md:flex-row gap-[18px] w-full">
          <div className="flex flex-col gap-[24px] w-full md:w-[75%]">
            <div className="flex flex-col md:flex-row gap-[18px] w-full">
              <div className="flex w-full md:w-1/2 items-start justify-center rounded-2xl border border-neutral-400 px-[28px] py-[32px]">
                <Saying
                  personData={{
                    name: "Raisya Ramadhani Achmad",
                    role: "Ketua OSIS Masa Bhakti 2024/2025",
                    image:
                      "https://res.cloudinary.com/dhjeoo1pm/image/upload/v1742740906/yszngh4kngdbywpzdlz7.jpg",
                  }}
                  saying="Mewakili seluruh anggota OSIS 2024/2025, kami merasa sangat berterima kasih atas kesempatannya untuk berkembang dan tumbuh dengan memberikan wadah kepada siswa-siswi untuk mengasah minat bakatnya. Di OSIS kami belajar tentang apa itu kerja sama, tanggung jawab, hingga pertemanan. Dedikasi ini kami berikan untuk menjadikan SMK Telkom Malang terlebih OSIS Moklet untuk tumbuh dan jaya seterusnya. Tidak lupa, saya pribadi selaku Ketua OSIS Moklet 2024/2025 mengucapkan terima kasih kepada seluruh anggota OSIS Moklet 2024/2025 atas dedikasi yang telah diberikan."
                />
              </div>
              <div className="flex w-full md:w-1/2 items-start justify-center rounded-2xl border border-neutral-400 px-[28px] py-[32px]">
                <Saying
                  personData={{
                    name: "Duan Tangguh M. P.",
                    role: "Ketua MEMO 2023/2024",
                    image:
                      "https://res.cloudinary.com/mokletorg/image/upload/v1720768436/assets/testimoni/duan_avfss1.webp",
                  }}
                  saying="Media Moklet atau biasa kita sapa dengan nama MeMo ini bener-bener jadi salah satu primadona buat anak-anak yang hobi banget di bidang multimedia, mulai dari acara, konten dan kegiatannya top semua pokoknya."
                />
              </div>
            </div>
            <div className="flex w-full items-start justify-center rounded-2xl border border-neutral-400 px-[28px] py-[32px]">
              <Saying
                personData={{
                  name: "Ijlal Windhi Saputra",
                  role: "Ketua OSIS Masa Bakti 2021/2022",
                  image:
                    "https://res.cloudinary.com/mokletorg/image/upload/v1720767929/assets/testimoni/Ijlal_Windhi_Saputra_fqdnzb_yu6d9y.jpg",
                }}
                saying="Saya sangat bangga dengan semangat dan dedikasi seluruh anggota OSIS serta organisasi lainnya di SMK Telkom Malang. Melalui kolaborasi dan berbagai kegiatan bersama, kami berhasil menciptakan lingkungan sekolah yang inspiratif dan inovatif. Pengalaman ini tidak hanya memperkuat rasa kebersamaan di antara siswa, tetapi juga membentuk karakter dan kepemimpinan yang kuat. Saya berharap OSIS dan organisasi lainnya di SMK Telkom Malang terus berkontribusi positif dalam mengembangkan potensi siswa di masa depan."
              />
            </div>
          </div>
          <div className="flex w-full md:w-[25%] justify-center rounded-2xl border border-neutral-400 px-[28px] py-[32px]">
            <Saying
              personData={{
                name: "Reyza Daffa W.",
                role: "Anggota Pustel 2023/2024",
                image:
                  "https://res.cloudinary.com/mokletorg/image/upload/v1720278762/assets/testimoni/reja.jpg",
              }}
              saying="Pustel memberikan saya banyak pembelajaran dan pengalaman dalam mengurus Perpustakaan SMK Telkom Malang. Saya disana banyak belajar tentang dunia literasi, cara merawat buku, mendata masuk dan keluarnya buku peminjaman, dan juga cara bekerja sama dengan rekan rekan untuk merawat perpustakaan agar tetap terjaga dan nyaman."
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
