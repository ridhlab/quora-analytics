import { getProfileAnswerUrl } from "../../helper/url";
import startScrapingAnswers from "./scraper";

export async function getAnswersProfile(profile: string) {
  const url = getProfileAnswerUrl(profile);
  const resScraping = await startScrapingAnswers(url);
  return resScraping;
}
