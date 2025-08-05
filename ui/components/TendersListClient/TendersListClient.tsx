"use client";

import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { MutableRefObject, useEffect, useState } from "react";
import { formatGmtDateToDMY } from "@/utils/formatGmtDateToDMY";
import { Tender } from "@/types";

const ItemContent = ({
  index,
  handleSetModalData,
  data,
  handleSetSpecificPosition,
}: {
  index: number;
  data: Tender;
  handleSetModalData: (data: Tender) => void;
  handleSetSpecificPosition: (position: {
    index: number;
    latitude: number;
    longitude: number;
  }) => void;
}) => {
  return (
    <section className="p-2">
      <div
        onClick={() => {
          console.log({
            latitude: data.tender_latitude
              ? data.tender_latitude
              : data.center_municipality_latitude,
            longitude: data.tender_longitude
              ? data.tender_longitude
              : data.center_municipality_longitude,
          });

          handleSetSpecificPosition({
            index,
            latitude: data.tender_latitude
              ? data.tender_latitude
              : data.center_municipality_latitude,
            longitude: data.tender_longitude
              ? data.tender_longitude
              : data.center_municipality_longitude,
          });
        }}
        className="relative cursor-pointer transition duration-300 hover:bg-[#80808073] p-2 rounded-lg border-2 border-solid border-white"
      >
        <p>Province: {data.province}</p>
        <p>Location: {data.location}</p>
        <p>Municipality: {data.municipality}</p>
        <p>Tender publication: {formatGmtDateToDMY(data.publication_date)}</p>
        <p>
          Tender deadline:{" "}
          {data.tender_deadline
            ? formatGmtDateToDMY(data.tender_deadline)
            : "N/A"}
        </p>
        <Button
          onPress={() => handleSetModalData(data)}
          color="primary"
          className="absolute right-2 bottom-2"
        >
          See more..
        </Button>
      </div>
    </section>
  );
};

export const TendersListClient = ({
  tenderList,
  usersLocation,
  virtuosoRef,
  handleSetSpecificPosition,
}: {
  tenderList: Tender[];
  usersLocation: {
    latitude: number;
    longitude: number;
  };
  handleSetSpecificPosition: (position: {
    index: number;
    latitude: number;
    longitude: number;
  }) => void;
  virtuosoRef: MutableRefObject<VirtuosoHandle | null>;
}) => {
  const [modalData, setModalData] = useState<Tender | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSetModalData = (data: Tender) => {
    onOpen();
    setModalData(data);
  };

  useEffect(() => {
    const L = require("leaflet");
    console.log(modalData, 'modalData');
    
    if (modalData) {
      const point1 = L.latLng(
        modalData.center_municipality_latitude,
        modalData.center_municipality_longitude
      );
      const point2 = L.latLng(usersLocation.latitude, usersLocation.longitude);

      const distanceInKm = point1.distanceTo(point2) / 1000;

      console.log(distanceInKm, 'distanceInKm');
      
      setDistance(distanceInKm);
    }
  }, [modalData]);

  return (
    <div>
      <Virtuoso
        ref={virtuosoRef}
        data={tenderList}
        style={{ height: "calc(100vh - 88px)", width: "100%" }}
        itemContent={(index) => (
          <ItemContent
            index={index}
            handleSetSpecificPosition={handleSetSpecificPosition}
            handleSetModalData={handleSetModalData}
            data={tenderList[index]}
          />
        )}
      />
      {modalData ? (
        <Modal
          classNames={{
            backdrop: "z-[1000]",
            wrapper: "z-[1000] cursor-pointer",
            base: "cursor-auto",
          }}
          className="z-[10000]"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {modalData.province}, {modalData.location}
                </ModalHeader>
                <ModalBody>
                  <p>Status: {modalData.status}</p>
                  <p>Details: {modalData.details}</p>
                  <p>Properties quantity: {modalData.number_of_properties}</p>
                  <p>Winner: {modalData.winner ? modalData.winner : "N/A"}</p>
                  <p>
                    Distance from you: {distance ? distance.toFixed(3) : null}
                    km
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="shadow" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      ) : null}
    </div>
  );
};
