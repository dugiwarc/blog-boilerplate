const mongoose = require("mongoose");
const router = require("express").Router();
const Articles = mongoose.model("Articles");

const missingValue = value => {
  return res.status(422).json({
    errors: {
      value: "is required"
    }
  });
};

router.post("/", (req, res, next) => {
  const { body } = req;

  if (!body.title) {
    missingValue(title);
  }

  if (!body.author) {
    missingValue(author);
  }

  if (!body.body) {
    missingValue(body);
  }

  const finalArticle = new Articles(body);
  return finalArticle
    .save()
    .then(() => res.json({ article: finalArticle.toJSON() }));
});

router.get("/", (req, res, next) => {
  return Articles.find()
    .sort({ createdAt: "descending" })
    .then(articles =>
      res.json({ articles: articles.map(article => article.toJSON()) })
    );
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Articles.findOne({ _id: id });
    console.log(article);
    article.remove();
  } catch (error) {
    throw new Error({ message: error.message });
  }
});

router.param("id", (req, res, next, id) => {
  return Articles.findById(id, (err, article) => {
    if (err) {
      return res.sendStatus(404);
    } else if (article) {
      req.article = article;
      return next();
    }
  });
});

router.get("/:id", (req, res, next) => {
  return res.json({
    article: req.article.json()
  });
});

router.patch("/:id", (req, res, next) => {
  const { body } = req;

  req.article.title = typeof body.title !== "undefined" && body.title;
  req.article.author = typeof body.author !== "undefined" && body.author;
  req.article.body = typeof body.body !== "undefined" && body.body;

  return req.article.save().then(() => res.sendStatus(200));
});

module.exports = router;
