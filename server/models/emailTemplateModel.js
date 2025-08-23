const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EmailTemplateSchema = new Schema(
  {
    slug: {
      type: String,
      trim: true,
      required: false,
    },
    subject: {
      type: String,
      trim: true,
      required: false,
    },
    keywords: [
      {
        type: String,
        trim: true,
        required: false,
      },
    ],
    content: {
      type: String,
      trim: true,
      required: true,
    },
    emailLayout: {
      type: String,
      trim: true,
      default: "",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

EmailTemplateSchema.statics = {
  async listAllEmailTemplates(options) {
    const result = await this.aggregate([
      {
        $facet: {
          pagination: [
            { $count: "total" },
            { $addFields: { page: parseInt(options.page) } },
            { $addFields: { limit: parseInt(options.limit) } },
            {
              $addFields: {
                perviousPage: {
                  $cond: {
                    if: {
                      $ne: [parseInt(options.page), 1],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
            },
            {
              $addFields: {
                nextPage: {
                  $cond: {
                    if: {
                      $gt: [
                        "$total",
                        parseInt(options.page) * parseInt(options.limit),
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
            },
          ],
          docs: [
            {
              $sort: {
                [options.sort]: options.dir,
              },
            },
            {
              $skip: (parseInt(options.page) - 1) * parseInt(options.limit),
            },

            {
              $limit: parseInt(options.limit),
            },
            {
              $project: {
                slug: 1,
                subject: 1,
                keywords: 1,
                content: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ])
      .allowDiskUse(true)
      .collation({ locale: "en" });

    const desiredDocs = result[0].docs ? result[0].docs : [];
    const pagination =
      result[0].pagination && result[0].pagination[0] !== undefined
        ? result[0].pagination[0]
        : {
            total: 0,
            page: parseInt(options.page),
            limit: parseInt(options.limit),
            nextPage: false,
            perviousPage: false,
          };
    return { pagination: pagination, docs: desiredDocs };
  },
};

module.exports = mongoose.model("EmailTemplate", EmailTemplateSchema);
