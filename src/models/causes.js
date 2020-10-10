const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const causesSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    goal: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    images: [
      {
        image: {
          type: String,
          required: true,
        },
      },
    ],

    endDate: {
      type: Date,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],

    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        text: {
          type: String,
          required: true,
        },

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

causesSchema.virtual("donations", {
  ref: "donation",
  localField: "_id",
  foreignField: "cause",
});
causesSchema.set("toObject", { virtuals: true });
causesSchema.set("toJSON", { virtuals: true });
module.exports = Cause = mongoose.model("cause", causesSchema);
