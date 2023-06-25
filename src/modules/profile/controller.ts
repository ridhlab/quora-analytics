import { Router } from "express";
import path from "path";
import { getCsv } from "./scraper";
import { getAnswersProfile } from "./service";

const router = Router();

router.get("/answers/:profile", async (req, res) => {
  const resScraping = await getAnswersProfile(req.params.profile);
  const csv = await getCsv(resScraping);
  await csv.toDisk(`./data/scraping/${req.params.profile}.csv`);
  res.sendFile(path.resolve(`data/scraping/${req.params.profile}.csv`));
});

router.get("/questions", (req, res) => {
  res.send("Hello World!");
});

export default router;
