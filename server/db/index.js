const conn = require("./conn");
const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const LineItem = require("./LineItem");
const Review = require('./Review')

Order.belongsTo(User);
LineItem.belongsTo(Order);
Order.hasMany(LineItem);
LineItem.belongsTo(Product);
Review.belongsTo(Product);
Product.hasMany(Review)

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [moe, lucy, larry, foo, bar, bazz, ethyl] = await Promise.all([
    User.create({ username: "moe", password: "123", userType: "customer" }),
    User.create({ username: "lucy", password: "123", userType: "customer" }),
    User.create({ username: "larry", password: "123", userType: "customer" }),
    Product.create({ name: "foo", review: "Great product" }),
    Product.create({ name: "bar", review: "Great product" }),
    Product.create({ name: "bazz", review: "Great product" }),
    User.create({ username: "ethyl", password: "123", userType: "admin" }),
  ]);

  // create submitted orders
  const [order1, order2] = await Promise.all([
    Order.create({ isCart: false, userId: ethyl.id }),
    Order.create({ isCart: false, userId: ethyl.id }),
  ]);

  const [line1, line2, line3] = await Promise.all([
    LineItem.create({ quantity: 1, productId: foo.id, orderId: order1.id }),
    LineItem.create({ quantity: 5, productId: bar.id, orderId: order1.id }),
    LineItem.create({ quantity: 3, productId: bazz.id, orderId: order2.id }),
  ]);

  const cart = await ethyl.getCart();
  await ethyl.addToCart({ product: bazz, quantity: 3});
  await ethyl.addToCart({ product: foo, quantity: 2});
  console.log(foo.dataValues.id)
  await Review.create({
    review: "looks great!",
    productId: foo.dataValues.id
  })
  await Review.create({
    review: "looks amazinnggggg!",
    productId: bar.dataValues.id
  })
  await Review.create({
    review: "looks amaeessziiing!",
    productId: bazz.dataValues.id
  })
  return {
    users: {
      moe,
      lucy,
      larry,
    },
    products: {
      foo,
      bar,
      bazz,
    },
  };
};

module.exports = {
  syncAndSeed,
  User,
  Product,
};
