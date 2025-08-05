"use client";

import { Tender } from "@/types";
import { formatGmtDateToDMY } from "@/utils/formatGmtDateToDMY";
import L from "leaflet";
import {
  MutableRefObject,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { VirtuosoHandle } from "react-virtuoso";

const customIcon = new L.Icon({
  iconUrl: "/pin.svg", // Fallback for direct path if .src is not available (e.g. for static imports)
  // iconRetinaUrl: '/images/custom-marker-2x.png', // Optional: for high-res screens
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location (center-bottom)
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
  // shadowUrl: defaultMarkerIcon.src || '/images/marker-shadow.png', // Optional: path to a shadow image
  shadowSize: [41, 41], // Size of the shadow
  shadowAnchor: [12, 41], // Point of the shadow which will correspond to marker's location
});

function FitBoundsToMarkers({ tendersMapList }: { tendersMapList: Tender[] }) {
  const map = useMap();

  useEffect(() => {
    // Этот эффект будет срабатывать только при изменении tendersMapList
    // (при первой загрузке или при изменении данных).
    // Он не будет срабатывать при каждом рендере Map компонента, вызванном setElementIndex.
    if (tendersMapList.length > 0) {
      const bounds = L.latLngBounds([]);
      tendersMapList.forEach(
        ({ center_municipality_latitude, center_municipality_longitude }) => {
          bounds.extend([
            center_municipality_latitude,
            center_municipality_longitude,
          ]);
        }
      );
      map.fitBounds(bounds, { padding: [50, 50] }); // Добавьте padding, если нужно
    }
  }, [tendersMapList, map]); // Зависимости: tendersMapList и объект map

  return null;
}

function MapUpdater({
  specificPosition,
  markers,
}: {
  specificPosition:
    | { index: number; latitude: number; longitude: number }
    | undefined;
  markers: MutableRefObject<{
    [id: string]: L.Marker<any> | null;
  }>;
}) {
  const map = useMap(); // Получаем экземпляр карты Leaflet

  useEffect(() => {
    if (specificPosition) {
      // Используем map.flyTo() для плавной анимации центрирования
      // или map.setView() для мгновенной смены центра
      map.flyTo([specificPosition.latitude, specificPosition.longitude], 12, {
        duration: 0.7,
      });

      setTimeout(() => {
        if (markers.current[specificPosition.index]) {
          markers.current[specificPosition.index]?.openPopup();
        }
      }, 700);
    }
  }, [specificPosition, map]);

  return null; // Этот компонент ничего не рендерит
}

export const Map = ({
  tendersMapList,
  virtuosoRef,
  specificPosition,
}: {
  tendersMapList: Tender[];
  virtuosoRef: MutableRefObject<VirtuosoHandle | null>;
  specificPosition?: {
    index: number;
    latitude: number;
    longitude: number;
  };
}) => {
  const [elementIndex, setElementIndex] = useState<number | null>(null);
  const markerRefs = useRef<{ [id: string]: L.Marker | null }>({});

  const flag = useRef<boolean>(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const savedElement = useRef<Element | null>(null);

  console.log(specificPosition, "specificPosition");

  useEffect(() => {
    const virtusoList = document.querySelector(
      '[data-testid="virtuoso-scroller"]'
    );

    const handleScrollEnd = () => {
      if (!flag.current) return;
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => {
        const seekedElement = document.querySelector(
          `[data-item-index="${elementIndex}"] section div`
        );

        if (seekedElement) {
          savedElement.current = seekedElement;
          seekedElement.classList.add("animate-blink-blue");
          flag.current = false;
          setTimeout(() => {
            seekedElement.classList.remove("animate-blink-blue");
          }, 500);
        }
      }, 500);
    };

    virtusoList?.addEventListener("scroll", handleScrollEnd);
    if (elementIndex !== null) {
      virtuosoRef.current?.scrollToIndex({
        index: elementIndex,
        align: "start",
        behavior: "smooth",
      });
    }
    return () => {
      virtusoList?.removeEventListener("scroll", handleScrollEnd);
    };
  }, [elementIndex]);

  return (
    <MapContainer
      center={{
        lat: tendersMapList[0].tender_latitude
          ? tendersMapList[0].tender_latitude : tendersMapList[0].center_municipality_latitude,
        lng: tendersMapList[0].tender_longitude
          ? tendersMapList[0].tender_longitude : tendersMapList[0].center_municipality_longitude
      }}
      zoom={10}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {tendersMapList.map((tender, index) => {
        return (
          <Marker
            ref={(ref) => {
              markerRefs.current[index] = ref;
            }}
            key={tender.id}
            eventHandlers={{
              click: () => {
                console.log(index, "index");
                console.log(elementIndex, "element index");

                if (index !== elementIndex) {
                  flag.current = true;
                }
                if (index === elementIndex && savedElement.current) {
                  savedElement.current.classList.add("animate-blink-blue");
                  setTimeout(() => {
                    if (savedElement.current) {
                      savedElement.current.classList.remove(
                        "animate-blink-blue"
                      );
                    }
                  }, 500);
                }
                setElementIndex(index);
              },
            }}
            position={[
              tender.center_municipality_latitude,
              tender.center_municipality_longitude,
            ]}
            icon={customIcon}
          >
            <Popup>
              <p>Location: {tender.location}</p>
              <p>Province: {tender.province}</p>
              <p>Property quantity: {tender.number_of_properties}</p>
              <p>
                Publication date: {formatGmtDateToDMY(tender.publication_date)}
              </p>
            </Popup>
          </Marker>
        );
      })}
      <MapUpdater markers={markerRefs} specificPosition={specificPosition} />
      <FitBoundsToMarkers tendersMapList={tendersMapList} />
    </MapContainer>
  );
};
