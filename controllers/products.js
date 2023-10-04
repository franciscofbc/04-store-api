const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({
    company: 'marcos',
  });
  return res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObj = {};
  if (featured) {
    queryObj.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObj.company = company;
  }
  if (name) {
    queryObj.name = { $regex: name, $options: 'i' };
  }
  if (numericFilters) {
    const operators = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regex = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regex,
      (match) => `-${operators[match]}-`
    );
    const options = ['price', 'rating']; //properties with number value
    filters = filters.split(',');
    filters.forEach((item) => {
      const data = item.split('-');
      const [field, operator, value] = data;
      if (options.includes(field)) {
        queryObj[field] = { [operator]: Number(value) };
      }
    });
  }
  console.log(queryObj);

  let result = Product.find(queryObj);
  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result.sort(sortList);
  } else {
    result.sort('createdAt');
  }
  // fields
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result.select(fieldsList);
  }

  //pagination
  page = Number(req.query.page) || 1;
  limit = Number(req.query.limit) || 10;
  skip = (page - 1) * limit;
  result.skip(skip).limit(limit);

  const products = await result;

  return res.status(200).json({ nbHits: products.length, products });
};

module.exports = { getAllProductsStatic, getAllProducts };
