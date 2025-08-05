"use client";

import { MapClient } from "@/components/MapClient";
import { TendersListClient } from "@/components/TendersListClient";
import { useEffect, useRef, useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Tender } from "@/types";
import { VirtuosoHandle } from "react-virtuoso";
import { rankTenders } from "@/utils/rankTenders";

export const HomeWrapper = ({ tenders }: { tenders: Tender[] }) => {
  const [tenderMapList, setTenderMapList] = useState<Tender[]>(tenders);
  const [distance, setDistance] = useState<string>("50");
  const [usersLocation, setUsersLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });
  const [specificPosition, setSpecificPosition] = useState<
    | {
        index: number;
        latitude: number;
        longitude: number;
      }
    | undefined
  >(undefined);

  const virtuosoRef = useRef<VirtuosoHandle | null>(null);

  const handleSetSpecificPosition = (position: {
    index: number;
    latitude: number;
    longitude: number;
  }) => {
    setSpecificPosition(position);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const filteredMapList = tenders.filter((tender) => {
        const L = require("leaflet");
        const point1 = L.latLng(
          tender.center_municipality_latitude,
          tender.center_municipality_longitude
        );
        const point2 = L.latLng(
          position.coords.latitude,
          position.coords.longitude
        );

        const distanceInKm = point1.distanceTo(point2) / 1000;
        return distanceInKm <= Number(distance);
      });

      const userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const rankedAndFilteredTenders = rankTenders(
        filteredMapList,
        userLocation
      );

      setTenderMapList(rankedAndFilteredTenders);
      setUsersLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, [distance]);

  return (
    <main className="flex">
      <div className="w-1/2 p-2">
        <Select
          disallowEmptySelection={true}
          size="lg"
          className="mb-2"
          selectedKeys={[distance]}
          onChange={(e) => {
            setDistance(e.target.value);
          }}
          color="primary"
          label="KM Range"
        >
          {[
            "25",
            "50",
            "75",
            "100",
            "125",
            "150",
            "175",
            "200",
            "225",
            "250",
            "275",
            "300",
          ].map((dis) => {
            return <SelectItem key={dis}>{`${dis}km`}</SelectItem>;
          })}
        </Select>
        <TendersListClient
          virtuosoRef={virtuosoRef}
          tenderList={tenderMapList}
          usersLocation={usersLocation}
          handleSetSpecificPosition={handleSetSpecificPosition}
        />
      </div>
      <MapClient
        specificPosition={specificPosition}
        virtuosoRef={virtuosoRef}
        tendersMapList={tenderMapList}
      />
    </main>
  );
};
