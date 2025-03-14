/**
 * THIS COMPUTE CODE RUNS ON THE FASTLY EDGE 🌎🌍🌏
 * 
 * We're using Expressly and a KV Store to log page hits on the origin website
 * We return two synthetic pages:
 * – '/stats/' displaying the totals 
 * –`/feed/feed.json` displaying the post list with totals
 */

import { KVStore } from "fastly:kv-store";
import { Router } from "@fastly/expressly";
import { _ } from "lodash";

const router = new Router();
let root = "/my-site/"; // Change to your root or "/""
let siteName = "My website";
let backendResponse, store;

router.use(async (req, res) => {
  store = new KVStore('pagehits');
  backendResponse = await fetch(req.url, {
    backend: "blog"
  });
});

// Synthetic HTML page from KV Store data
router.get(`${root}stats`, async (req, res) => {
  let postList = await store.list({});
  let totals = ``;
  /*
    The KV Store has page paths in the site as keys, and the number of hits as values
    Let's turn the list of keys into an array with the values like this:
    [{ page: "/", hits: 3 }, ...]
  */
  postList = _.filter(postList.list, h => { return h.endsWith("/") }); //we only want pages ending /
  let hitList = [];
  for (const pst of postList) {
      let hits = await store.get(pst);
      let num = await hits.text();
      hitList.push({ page: pst, hits: parseInt(num)});
  }
  hitList = _.orderBy(hitList, 'hits', 'desc'); //let's order the list by hits to include in the page
  for (const pst of hitList)
    totals += `<p>🔗 <a href="${pst.page}">${pst.page}</a> – <strong>${pst.hits}</strong></p>`;
  res.withStatus(backendResponse.status).html(getPage("Page hits 📈📊🚀", totals));
});

// Synthetic HTML page from JSON feed data
router.get(`${root}feed/feed.json`, async (req, res) => {
  let originData = await backendResponse.json();
  let posts = ``;
  for (const pst of originData.items) {
    let date = new Date(pst.date_published);
    date = date.toDateString();
    let linkUrl = new URL(pst.url);
    let postRecord = await store.get(linkUrl.pathname);
    let postCount = 0;
    if (postRecord)
      postCount = await postRecord.text();
    posts += `<p><a href="${linkUrl.pathname}"><strong>${pst.title}</strong></a>
      <br/>${date}<br/><em>${postCount} views</em></p>`;
  }
  res.withStatus(backendResponse.status).html(getPage(originData.title + " – Feed 🗞️", posts));
});

// Default response for all other routes
router.all("(.*)", async (req, res) => {
  await incrementCount(req.path);
  res.send(backendResponse);
});

router.listen();

// Add to the total for this page in the KV Store
let incrementCount = async (page) => {
  const postRecord = await store.get(page);
  let count = 1;
    // Increase hits for this page if appropriate
    if (postRecord) {
      let postValue = await postRecord.text();
      count = parseInt(postValue) + 1;
    }
    await store.put(page, count);
}

// Synthetic page helper
let getPage = (title, content) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <!-- 🚧 Change CSS location to suit your site 🚧 -->
      <link rel="stylesheet" href="${root}css/index.css"/>
    </head>
    <body>
      <header><a class="home-link" href="${root}">${siteName}</a></header>
      <h2>${title}</h2>
      <div>${content}</div>
    </body>
  </html>`;
}
