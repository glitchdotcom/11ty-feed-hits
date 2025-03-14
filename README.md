# Hit counter with KV Store on Fastly Compute

This starter kit sets up a basic page hit counter for a website using a KV Store in a Fastly Compute app written in JavaScript. The app creates two synthetic pages, one to display the hit stats for the site, and one to display the JSON RSS feed in an HTML page that includes the page hits.

* The app uses a default origin website as its backend `glitchdotcom.github.io` with the sample site at `/my-site/`: [glitchdotcom.github.io/my-site/](https://glitchdotcom.github.io/my-site/)
  * The sample site is a variant of the [Eleventy Base Blog](https://demo-base-blog.11ty.dev/) which you can also [clone and deploy to Github Pages](https://github.com/glitchdotcom/my-site) if you like
* The app uses [Expressly](https://expressly.edgecompute.app/) for routing requests with the [Fastly JavaScript Compute SDK](https://js-compute-reference-docs.edgecompute.app/docs/)
* We create a KV Store named `pagehits` 
* Each page request increments the number of hits in the store
* The `/stats` page displays a list of the pages and their hits
* The `/feed/feed.json` endpoint returns a synthetic page from the 11ty feed

You can use this starter kit out of the box with the default backend, or you can use your own website by changing it in the `fastly.toml` section `[setup.backends.blog]` and changing the `root` variable in the `src/index.js` file __before you deploy the app for the first time__ (otherwise you need to update the backend address via the Fastly CLI).

⏲️ _Stay tuned for more including a tutorial series on using this starter kit..._

> This repo is cloned from the [default starter kit for Expressly](https://github.com/fastly/compute-starter-kit-javascript-expressly).

## Demo

Explore an example of what this starter does: [hit-counter.edgecompute.app/my-site/](https://hit-counter.edgecompute.app/my-site/)

![stats page](https://github.com/user-attachments/assets/8eb54839-ff88-4ba6-929f-074c62dda9c2)
 
## 1. Setup

Develop with the project locally by [installing the Fastly tools](https://www.fastly.com/documentation/guides/compute/) and starting a new Compute project.

Create a new directory and navigate to it in your Terminal. Install the CLI:

```
npm install @fastly/cli
```

Start a new Compute project using this app as a template:

```
fastly compute init --from=https://github.com/glitchdotcom/hit-counter/
```

> 💡 Include the flag `--accept-defaults` if you don't want to choose all the details.

Install dependencies: `npm install`

Create an environment variable named `FASTLY_API_TOKEN` and set the token you copied from your account as the value.

> 💡 You can [authenticate in other ways](https://www.fastly.com/documentation/reference/tools/cli/#configuring), like including your token with the commands as `--token` or creating a profile. 

By default the edge app will use `glitchdotcom.github.io` as its origin, but you can change it to use your own site if you like:

* In the `fastly.toml` file, change the `backend` address to your domain
* In `src/index.js` change the `root` variable to the path for your site or "/"

## 2. Publish your app

Once you have the repo installed locally and your API token set up in your environment, use the publish command to deploy the app to a Compute service:

```
fastly compute publish
```

![cli output](https://github.com/user-attachments/assets/fc53135d-af14-4f10-843a-1f7ccaacaebc)

Your terminal will output the address of your new Compute app – make sure you open the path set as `root` in `src/index.js` which is `my-site` by default.

* Open a few pages then check out your stats page at `your-project.edgecompute.app/my-site/stats/` changing `my-site` if you used a different root
  * Example: [11ty-feed-hits.edgecompute.app/my-site/stats/](https://11ty-feed-hits.edgecompute.app/my-site/stats/)
* Open the `/feed/feed.json` page (you can click the link in the site header) to see the HTML feed page including the number of hits
  * Example: [11ty-feed-hits.edgecompute.app/my-site/feed/feed.json](https://11ty-feed-hits.edgecompute.app/my-site/feed/feed.json)

## 3. Edit your code 

Make an edit to your Compute app to learn what else you can do at the edge! You could change the way the synthetic HTML pages work, or log different information to your data store. 

Fastly gives you access to lots of other information about the user request, so you could log additional data to your KV Store and render it in the stats page. Check out the docs for [Expressly](https://expressly.edgecompute.app/docs/handling-data/request), [KV Store in the JavaScript Compute SDK](https://js-compute-reference-docs.edgecompute.app/docs/fastly:kv-store/KVStore/) and the [code examples](https://www.fastly.com/documentation/solutions/examples/) for functionality you can build into your app.

Each time you edit your Compute code, run the publish command again and give it a minute to deploy your changes!

## Help

[Get help on the Fastly community forum!](https://community.fastly.com)
