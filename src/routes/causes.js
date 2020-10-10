const express = require("express");
const router = new express.Router();
const multer = require("multer");
const Donation = require("../models/donations");
const auth = require("../middleware/auth");
const Cause = require("../models/causes");
const User = require("../models/users");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/assets/causes");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/",
  auth,
  upload.array("files", 5),
  async (req, res) => {
    const cause = new Cause({
      ...req.body,
      creator: req.user,
    });

    const createdCause = await cause.save();

    await createdCause.save();

    for (let i = 0; i < req.files.length; i++) {
      createdCause.images.push({ image: `/causes/${req.files[i].filename}` });
    }

    await createdCause.save();
    res.send(createdCause);
  },
  (err, req, res, next) => {
    console.log(err);
    res.status(400).send({
      errMessage: err.message ? err.message : err,
    });
  }
);

router.get("/me", auth, async (req, res) => {
  try {
    const causes = await Cause.find({
      creator: req.user,
    })
      .populate({ path: "donations", select: "amount" })
      .select("-description -startDate -creator -comments")
      .exec();
    if (causes.length === 0) {
      return res.status(400).send({
        errMessage: "No any causes found",
      });
    }

    res.send(causes);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const causes = await Cause.find()
      .populate({ path: "donations", select: "amount" })
      .select("title goal endDate images");

    if (causes.length === 0) {
      return res.status(400).send({
        errMessage: "No causes created yet",
      });
    }
    res.send(causes);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id)
      .populate({ path: "creator", select: "name avatar favorites" })
      .populate({ path: "comments.user", select: "name avatar" })
      .populate({
        path: "donations",
        populate: {
          path: "user",
          select: "avatar",
        },
      })
      .select("title goal tags images comments description")
      .exec();

    if (!cause) {
      return res.status(400).send({
        errMessage: "No such cause found",
      });
    }

    res.send(cause);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) {
      return res.status(400).send({
        errMessage: "No such cause found",
      });
    }
    if (cause.comments.length !== 0) {
      await cause
        .populate({
          path: "comments.user",
          select: "name avatar",
        })
        .execPopulate();
    }

    res.send(cause.comments);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/:id/donations", async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) {
      return res.status(400).send({
        errMessage: "No Such Cause found",
      });
    }

    const donations = await Donation.find({
      cause: cause._id,
    })
      .populate({
        path: "user",
        select: "name avatar",
      })
      .select("-cause");

    res.send(donations.sort((a, b) => new Date(b.date) - new Date(a.date)));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/comment/:id", auth, async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) {
      return res.status(404).send({
        errMessage: "Cause Not Found",
      });
    }

    const donation = await Donation.findOne({
      cause: cause._id,
      user: req.user._id,
    });
    if (!donation) {
      return res.status(404).send({
        errorMesssage: "Not allowed ",
      });
    }
    const comment = {
      ...req.body,
      user: req.user,
    };
    cause.comments.unshift(comment);
    await cause.save();
    res.send(cause.comments);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) {
      return res.status(404).send({
        errorMesssage: "Cause Not Found",
      });
    }

    const comment = cause.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).send({
        msg: "Comment Not Found",
      });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).send({
        msg: "Not Authorized",
      });
    }
    const newComments = cause.comments.filter((comment) => {
      return comment.id !== req.params.comment_id;
    });
    cause.comments = newComments;
    await cause.save();

    res.json({
      msg: "Comment Removed",
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/donate/:cause_id", auth, async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.cause_id);
    if (!cause) {
      return res.status(404).send({
        errorMesssage: "Cause Not Found",
      });
    }

    const donation = new Donation({
      user: req.user,
      cause: req.params.cause_id,
      amount: req.body.amount,
    });

    await donation.save();
    res.send(donation);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
