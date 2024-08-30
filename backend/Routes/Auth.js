const express = require("express");
const User = require("../models/User");
const Order = require("../models/Orders");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const axios = require("axios");
const fetch = require("../middleware/fetchdetails");
const jwtSecret = "HaHa";
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
      await User.create({
        name: req.body.name,
        password: securePass,
        email: req.body.email,
        location: req.body.location,
      })
        .then((user) => {
          const data = {
            user: {
              id: user.id,
            },
          };
          const authToken = jwt.sign(data, jwtSecret);
          success = true;
          res.json({ success, authToken });
        })
        .catch((err) => {
          console.log(err);
          res.json({ error: "Please enter a unique value." });
        });
    } catch (error) {
      console.error(error.message);
    }
  }
);
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Try Logging in with correct credentials" });
      }

      const pwdCompare = await bcrypt.compare(password, user.password);
      if (!pwdCompare) {
        return res
          .status(400)
          .json({ success, error: "Try Logging in with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      const authToken = jwt.sign(data, jwtSecret);
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.send("Server Error");
    }
  }
);

router.post("/getuser", fetch, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
});
router.post("/getlocation", async (req, res) => {
  try {
    let lat = req.body.latlong.lat;
    let long = req.body.latlong.long;
    console.log(lat, long);
    let location = await axios
      .get(
        "https://api.opencagedata.com/geocode/v1/json?q=" +
          lat +
          "+" +
          long +
          "&key=74c89b3be64946ac96d777d08b878d43"
      )
      .then(async (res) => {
        console.log(res.data.results);
        let response = res.data.results[0].components;
        console.log(response);
        let { village, county, state_district, state, postcode } = response;
        return String(
          village +
            "," +
            county +
            "," +
            state_district +
            "," +
            state +
            "\n" +
            postcode
        );
      })
      .catch((error) => {
        console.error(error);
      });
    res.send({ location });
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
});
router.get("/foodData", async (req, res) => {
  try {
    res.send([
      [
        {
          CategoryName: "Biryani/Rice",
          name: "Chicken Fried Rice",
          img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMGZyaWVkJTIwcmljZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
          options: [
            {
              half: "130",
              full: "220",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
        {
          CategoryName: "Biryani/Rice",
          name: "Veg Fried Rice",
          img: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dmVnJTIwZnJpZWQlMjByaWNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
          options: [
            {
              half: "110",
              full: "200",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
        {
          CategoryName: "Biryani/Rice",
          name: "Fish Biryani",
          img: "https://media.istockphoto.com/photos/king-fish-biryani-with-raita-served-in-a-golden-dish-isolated-on-dark-picture-id1409942571?b=1&k=20&m=1409942571&s=170667a&w=0&h=ozlMJf5hsDmS2sSdEdBWnoSZOEITef4qGMeWeq2lyTc=",
          options: [
            {
              half: "200",
              full: "320",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
        {
          CategoryName: "Biryani/Rice",
          name: "Chicken Biryani",
          img: "https://cdn.pixabay.com/photo/2019/11/04/12/16/rice-4601049__340.jpg",
          options: [
            {
              half: "170",
              full: "300",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
        {
          CategoryName: "Biryani/Rice",
          name: "Veg Biryani",
          img: "https://media.istockphoto.com/photos/veg-biryani-picture-id1363306527?b=1&k=20&m=1363306527&s=170667a&w=0&h=VCbro7CX8nq2kruynWOCO2GbMGCea2dDJy6O6ebCKD0=",
          options: [
            {
              half: "150",
              full: "260",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
        {
          CategoryName: "Biryani/Rice",
          name: "Prawns Fried Rice",
          img: "https://cdn.pixabay.com/photo/2018/03/23/08/27/thai-fried-rice-3253027__340.jpg",
          options: [
            {
              half: "120",
              full: "220",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
        {
          CategoryName: "Starter",
          name: "Chilli Paneer",
          img: "https://media.istockphoto.com/photos/spicy-paneer-or-chilli-paneer-or-paneer-tikka-or-cottage-cheese-in-picture-id697316634?b=1&k=20&m=697316634&s=170667a&w=0&h=bctfHdYTz9q2dJUnuxGRDUUwC9UBWjL_oQo5ECVVDAs=",
          options: [
            {
              half: "120",
              full: "200",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
        {
          CategoryName: "Starter",
          name: "Paneer 65",
          img: "https://media.istockphoto.com/photos/paneer-tikka-kabab-in-red-sauce-is-an-indian-dish-made-from-chunks-of-picture-id1257507446?b=1&k=20&m=1257507446&s=170667a&w=0&h=Nd7QsslbvPqOcvwu1bY0rEPZXJqwoKTYCal3nty4X-Y=",
          options: [
            {
              half: "150",
              full: "260",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
        {
          CategoryName: "Starter",
          name: "Chicken Tikka",
          img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMHRpa2thfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
          options: [
            {
              half: "170",
              full: "300",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
        {
          CategoryName: "Starter",
          name: "Paneer Tikka",
          img: "https://media.istockphoto.com/photos/paneer-tikka-at-skewers-in-black-bowl-at-dark-slate-background-paneer-picture-id1186759790?k=20&m=1186759790&s=612x612&w=0&h=e9MlX_7cZtq9_-ORGLPNU27VNP6SvDz7s-iwTxrf7wU=",
          options: [
            {
              half: "170",
              full: "250",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
        {
          CategoryName: "Pizza",
          name: "Chicken Cheese Pizza",
          img: "https://media.istockphoto.com/photos/double-topping-pizza-on-the-wooden-desk-isolated-picture-id1074109872?k=20&m=1074109872&s=612x612&w=0&h=JoYwwTfU_mMBykXpRB_DmgeecfotutOIO9pV5_JObpk=",
          options: [
            {
              regular: "120",
              medium: "230",
              large: "350",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
        {
          CategoryName: "Pizza",
          name: "Mix Veg Pizza",
          img: "https://media.istockphoto.com/photos/chinese-food-veg-pizza-picture-id1341905237?k=20&m=1341905237&s=612x612&w=0&h=Lbuza1Ig5cC1PwQhqTsq-Uac8hg1W-V0Wx4d4lqDeB0=",
          options: [
            {
              regular: "100",
              medium: "200",
              large: "300",
            },
          ],
          description:
            "Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.",
        },
      ],
      [
        {
          CategoryName: "Biryani/Rice",
        },
        {
          CategoryName: "Starter",
        },
        {
          CategoryName: "Pizza",
        },
      ],
    ]);
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
});

router.post("/orderData", async (req, res) => {
  let data = req.body.order_data;
  await data.splice(0, 0, { Order_date: req.body.order_date });
  console.log("1231242343242354", req.body.email);
  let eId = await Order.findOne({ email: req.body.email });
  console.log(eId);
  if (eId === null) {
    try {
      console.log(data);
      console.log("1231242343242354", req.body.email);
      await Order.create({
        email: req.body.email,
        order_data: [data],
      }).then(() => {
        res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      res.send("Server Error", error.message);
    }
  } else {
    try {
      await Order.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: data } }
      ).then(() => {
        res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      res.send("Server Error", error.message);
    }
  }
});

router.post("/myOrderData", async (req, res) => {
  try {
    console.log(req.body.email);
    let eId = await Order.findOne({ email: req.body.email });
    res.json({ orderData: eId });
  } catch (error) {
    res.send("Error", error.message);
  }
});

module.exports = router;