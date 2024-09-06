const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 9999;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Route to render search form
app.get("/", (req, res) => {
  res.render("index", { items: [] });
});

// Route to handle search
app.post("/search", async (req, res) => {
  const query = req.body.query;
  const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let items = [];
    $(".s-item").each((i, element) => {
      const title = $(element).find(".s-item__title").text();
      const price = $(element).find(".s-item__price").text();
      const image = $(element).find(".s-item__image-wrapper img").attr("src");
      const link = $(element).find(".s-item__link").attr("href");
      const affiliateLink = link + "&affilid=5717685";
      if (title && price) {
        items.push({ title, price, image, affiliateLink });
      }
    });

    res.render("index", { items });
  } catch (error) {
    console.error(error);
    res.render("index", { items: [] });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
