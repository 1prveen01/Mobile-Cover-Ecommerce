import didYouMean from "didyoumean"
import { deviceModels } from "@/utils/deviceModels";

// set the match list globally
didYouMean.returnFirstMatch = true;

export function correctDeviceModel(input: string) {
  const correction = didYouMean(input, deviceModels);
  return correction || input; // return correction if found, else return original
}
