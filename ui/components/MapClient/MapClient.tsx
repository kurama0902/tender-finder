'use client';

import { Tender } from "@/types";
import dynamic from "next/dynamic";
import { MutableRefObject, Ref } from "react";
import { VirtuosoHandle } from "react-virtuoso";

const Map = dynamic(() => import('../Map').then(mod => mod.Map), {
    ssr: false
})

export const MapClient = ({specificPosition, tendersMapList, virtuosoRef }: { specificPosition?: {
    index: number,
    latitude: number,
    longitude: number
}, tendersMapList: Tender[], virtuosoRef: MutableRefObject<VirtuosoHandle | null> }) => {
    return <Map specificPosition={specificPosition} tendersMapList={tendersMapList} virtuosoRef={virtuosoRef} />
}