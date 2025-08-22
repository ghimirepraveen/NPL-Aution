const mongoose = require("mongoose");

const createSlug = async (db, doc, field) => {
  let oldDoc = JSON.parse(JSON.stringify(doc));
  doc[`${field}`] = doc[`${field}`]
    .trim()
    .replace(/[\s\W_]+/gi, " ")
    .trim();
  let countQuery = {};
  countQuery[`${field}`] = {
    $regex: doc[field]
      .trim()
      .replace(/[\s\W_]+/gi, " ")
      .trim(),
    $options: "i",
  };

  const count = await mongoose
    .model(`${db}`)
    // .find()
    .countDocuments(countQuery);
  let slug =
    doc[`${field}`]
      .trim()
      .replace(/[\s\W_]+/gi, "-")
      .trim()
      .toLowerCase() +
    "-" +
    (count + 1);

  const oldDocFound = await mongoose.model(`${db}`).findOne({ slug });
  if (oldDocFound) {
    slug =
      doc[`${field}`]
        .trim()
        .replace(/[\s\W_]+/gi, "-")
        .trim()
        .toLowerCase() +
      "-" +
      (parseInt(slug.split("-").pop()) + 1);
    doc.slug = slug;
    doc[`${field}`] = await oldDoc[`${field}`];
    return doc;
  } else {
    doc.slug = slug;
    doc[`${field}`] = await oldDoc[`${field}`];
    return doc;
  }
};

module.exports = {
  createSlug,
};
