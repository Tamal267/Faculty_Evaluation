import dotenv from 'dotenv'
import { chromium } from 'playwright-extra'

dotenv.config({ path: '.env.local' })
;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('https://student.mist.ac.bd/login')
  await page.getByRole('textbox', { name: 'Username' }).dblclick()
  await page
    .getByRole('textbox', { name: 'Username' })
    .fill(process.env.UNIPLEX_USERNAME)
  await page.getByRole('textbox', { name: 'Password' }).dblclick()
  await page
    .getByRole('textbox', { name: 'Password' })
    .fill(process.env.UNIPLEX_PASSWORD)
  await page.getByRole('button', { name: 'LOG IN' }).click()

  await page.waitForSelector('.MuiBox-root > .MuiButton-root')

  while (
    await page.locator('.MuiBox-root > .MuiButton-root').first().isVisible()
  ) {
    await page.locator('.MuiBox-root > .MuiButton-root').first().click()

    const questions = [
      /^Q1\.Syllabus CoverageVery GoodGoodAveragePoorVery Poor$/,
      /^Q2\.Teacher's ContributionVery GoodGoodAveragePoorVery Poor$/,
      /^Q3\.Communication skillVery GoodGoodAveragePoorVery Poor$/,
      /^Q4\.Classroom DiscussionsVery GoodGoodAveragePoorVery Poor$/,
      /^Q5\.PunctualityVery GoodGoodAveragePoorVery Poor$/,
      /^Q6\.Time ManagementVery GoodGoodAveragePoorVery Poor$/,
      /^Q7\.Timely AssessmentsVery GoodGoodAveragePoorVery Poor$/,
      /^Q8\.Guidance \/ SupportVery GoodGoodAveragePoorVery Poor$/,
      /^Q9\.BehaviourVery GoodGoodAveragePoorVery Poor$/,
      /^Q10\.Overall ExperienceVery GoodGoodAveragePoorVery Poor$/,
    ]

    for (const question of questions) {
      await page
        .locator('div')
        .filter({
          hasText: question,
        })
        .getByTestId('CircleOutlinedIcon')
        .nth(2)
        .click()
    }

    await page.getByRole('button', { name: 'Submit' }).click()
    await page.getByRole('textbox', { name: 'Overall Comments' }).click()
    await page
      .getByRole('textbox', { name: 'Overall Comments' })
      .fill('Everything was average')
    await page.getByRole('textbox', { name: 'Recommendations' }).click()
    await page
      .getByRole('textbox', { name: 'Recommendations' })
      .fill('I have no recommendations')
    await page.getByRole('button', { name: 'Submit' }).click()
  }

  await browser.close()
})()
