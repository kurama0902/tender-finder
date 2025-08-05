import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Tender = {
  id: number,
  province: string,
  location: string,
  tender_deadline?: string,
  status: string,
  details: string,
  expensive_ratio?: number,
  midrange_ratio?: number,
  social_ratio?: number,
  municipality: string,
  winner?: string
  number_of_properties?: number,
  publication_date: string,
  tender_longitude?: number,
  tender_latitude?: number,
  center_municipality_longitude: number,
  center_municipality_latitude: number;
}