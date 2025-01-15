import LinkButton from "@/app/_components/global/Button";
import Image from "@/app/_components/global/Image";
import { H1, P, UnderlinedTitle } from "@/app/_components/global/Text";
import { SectionWrapper } from "@/app/_components/global/Wrapper";

function SubOrganCount({
  count,
  title,
}: Readonly<{ count: number; title: string }>) {
  return (
    <div>
      <H1 className="text-primary-400">{count < 10 ? `0${count}` : count}</H1>
      <P>{title}</P>
    </div>
  );
}
export default function SubOrgan() {
  return (
    <SectionWrapper id="sub-organ">
      <div className="flex flex-col-reverse md:flex-row gap-[72px] md:gap-0 w-full items-start md:items-center justify-start md:justify-between">
        <div className="w-full max-w-3xl">
          <div className="mb-[42px]">
            <UnderlinedTitle underlineClassName="w-[166px] md:w-[249px] top-4 md:top-[24px]">
              Kembangkan Bakat di Sub-organ
            </UnderlinedTitle>
            <P>
              Temukan potensi terbaik bakatmu melalui Sub-Organisasi OSIS Moklet
              yang beragam. Bergabunglah dengan Sub-organ dan kembangkan bakat
              serta minat bersama komunitas yang kolaboratif serta inovatif.
            </P>
          </div>
          <div className="mb-11 flex flex-col sm:flex-row w-full md:items-center gap-[62px]">
            <SubOrganCount count={3} title="Bidang Olahraga" />
            <SubOrganCount count={2} title="Bidang Seni & Bahasa" />
            <SubOrganCount count={5} title="Bidang Lainnya" />
          </div>
          <LinkButton variant={"primary"} href="/organisasi">
            Explorasi lebih jauh
          </LinkButton>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            src={"/images/Sub-organ.png"}
            width={470}
            height={390}
            alt="Sub-organ"
            className="w-full"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
