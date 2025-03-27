"use client";

import { AspirationWithUser } from "@/types/entityRelations";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AspirationFigure from "./ApirationFigure";
import { getAspirations } from "@/actions/aspirasi";
import { H3 } from "@/app/_components/global/Text";

const NUMBER_OF_ASPIRATIONS_TO_FETCH = 20;

export default function AspirationList() {
  const [aspirations, setAspirations] = useState<AspirationWithUser[]>([]);
  const [loadingState, setLoadingState] = useState(false);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();

  const filter = {
    organisasi: searchParams.get("organisasi") ?? undefined,
    event: searchParams.get("event") ?? undefined,
    unit: searchParams.get("unit") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  };

  const loadMoreAspirations = async () => {
    const findAspirations = await getAspirations({
      skip: offset,
      take: NUMBER_OF_ASPIRATIONS_TO_FETCH,
      ...filter,
    });

    if (findAspirations.count <= offset + NUMBER_OF_ASPIRATIONS_TO_FETCH)
      setLoadingState(false);

    setAspirations([...aspirations, ...findAspirations.data]);
    setOffset(offset + findAspirations.data.length);
    setCount(findAspirations.count);
  };

  const loadAspirations = async () => {
    setLoadingState(false);
    const findAspirations = await getAspirations({
      take: NUMBER_OF_ASPIRATIONS_TO_FETCH,
      ...filter,
    });

    if (findAspirations.count > NUMBER_OF_ASPIRATIONS_TO_FETCH)
      setLoadingState(true);

    setAspirations(findAspirations.data);
    setOffset(findAspirations.data.length);
    setCount(findAspirations.count);
  };

  useEffect(() => {
    loadAspirations();
  }, [searchParams]);

  useEffect(() => {
    if (inView) {
      loadMoreAspirations();
    }
  }, [inView]);

  return (
    <>
      <H3>Total {count} aspirasi</H3>
      <div className="flex flex-col gap-2">
        {aspirations.map((a) => (
          <AspirationFigure data={a} key={a.id} />
        ))}
      </div>
      {loadingState && (
        <div className="w-full flex justify-center overflow-hidden" ref={ref}>
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-danger motion-reduce:animate-[spin_1.5s_linear_infinite]">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
    </>
  );
}
