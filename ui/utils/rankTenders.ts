
import * as geolib from 'geolib';
import { Tender } from "@/types";

interface RankingWeights {
  proximity: number;
  deadline: number;
  value: number;
  ratio: number;
}

export type RankedTender = Tender & {
  relevance_score: number;
};

const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const diffInMilliseconds = endDate.getTime() - startDate.getTime();
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(diffInDays));
};

const calculateRelevanceScore = (
  tender: Tender,
  userLocation: { latitude: number; longitude: number },
  weights: RankingWeights
): number => {
  const maxRelevantDistanceKm = 200;
  const maxDaysForUrgency = 90;
  const maxExpectedProperties = 5000;

  let proximityScore = 0;
  const distanceMeters = geolib.getDistance(
    userLocation,
    {
      latitude: tender.tender_latitude ? tender.tender_latitude : tender.center_municipality_latitude,
      longitude: tender.tender_longitude ? tender.tender_longitude : tender.center_municipality_longitude,
    }
  );
  const distanceKm = distanceMeters / 1000;
  proximityScore = 1 - Math.min(distanceKm / maxRelevantDistanceKm, 1.0);

  let deadlineScore = 0;
  const tenderDeadline = tender.tender_deadline ? new Date(tender.tender_deadline) : null;
  const now = new Date();

  if (tenderDeadline && tenderDeadline > now) {
    const daysUntilDeadline = getDaysBetween(now, tenderDeadline);
    deadlineScore = 1 - Math.min(daysUntilDeadline / maxDaysForUrgency, 1.0);
  }

  let valueScore = 0;
  const numberOfProperties = tender.number_of_properties || 0;
  valueScore = Math.min(numberOfProperties / maxExpectedProperties, 1.0);

  const socialRatio = tender.social_ratio || 0;
  const midrangeRatio = tender.midrange_ratio || 0;
  const expensiveRatio = tender.expensive_ratio || 0;

  let ratioScore = (socialRatio * 0.6) + (midrangeRatio * 0.4) - (expensiveRatio * 0.2);
  ratioScore = Math.max(0, ratioScore);

  const finalScore = (
    proximityScore * weights.proximity +
    deadlineScore * weights.deadline +
    valueScore * weights.value +
    ratioScore * weights.ratio
  );
  
  return finalScore;
};


export const rankTenders = (
  tenders: Tender[],
  userLocation: { latitude: number; longitude: number },
  weights: RankingWeights = { proximity: 0.4, deadline: 0.2, value: 0.2, ratio: 0.2 }
): RankedTender[] => {
  const rankedTenders = tenders.map(tender => {
    const relevance_score = calculateRelevanceScore(tender, userLocation, weights);
    return { ...tender, relevance_score };
  });

  rankedTenders.sort((a, b) => b.relevance_score - a.relevance_score);

  console.log(rankedTenders, 'rankTenders');
  

  return rankedTenders;
};