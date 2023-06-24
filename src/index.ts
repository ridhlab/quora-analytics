import puppeteer, { Page } from "puppeteer";
import ObjectsToCsv from "objects-to-csv";

type ResultScraping = {
  questionsContent: (string | null)[];
  answersContent: (string | null)[];
};

type Content = { question: string | null; answer: string | null };

const profileUrl = "Muhammad-Ridwan-123";

async function exportToCsv(res: ResultScraping) {
  const arr: Content[] = [];
  for (let i = 0; i < res.questionsContent.length; i++) {
    arr.push({ question: res.questionsContent[i], answer: res.answersContent[i] });
  }
  const csv = new ObjectsToCsv(arr);

  await csv.toDisk(`./data/${profileUrl}.csv`);
}

async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 600);
    });
    window.scrollTo(0, document.body.scrollHeight);
  });
}

async function clickReadMore(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      const selectorReadMore = ".q-click-wrapper.qu-display--block.qu-tapHighlight--none.qu-cursor--pointer";
      const btn = document.querySelectorAll(selectorReadMore);
      console.log(btn);
      btn.forEach((b) => {
        (b as HTMLElement).click();
      });
      resolve();
    });
  });
}

async function doScraping(page: Page) {
  const res = await page.evaluate(async () => {
    const res = await new Promise<ResultScraping>((resolve) => {
      const selectorAnswers = "div.q-box.spacing_log_answer_content.puppeteer_test_answer_content > div > span > span.q-box.qu-userSelect--text";
      const selectorQuestions = "a > div > div > div > div > span.q-box.qu-userSelect--text";
      const questionsDom = document.querySelectorAll(selectorQuestions);
      const answersDom = document.querySelectorAll(selectorAnswers);
      let questionsContent: (string | null)[] = [];
      let answersContent: (string | null)[] = [];
      questionsDom.forEach((q) => {
        questionsContent.push(q.textContent);
      });
      answersDom.forEach((ans) => {
        answersContent.push(ans.textContent);
      });
      console.log({ questionsContent, answersContent });
      const result = { questionsContent, answersContent };
      resolve(result);
    });
    return res;
  });

  exportToCsv(res);
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, isMobile: false });
  await page.goto(`https://id.quora.com/profile/${profileUrl}/answers`, { waitUntil: "networkidle2" });

  await autoScroll(page);

  await clickReadMore(page);

  await doScraping(page);

  await browser.close();
})();
