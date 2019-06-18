const express = require('express');

// products route
const router = express.Router();

const mongoose = require('mongoose');

// model of product
const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find()
    .select('_id name price')
    .exec()
    .then(data => {
      res.status(200).json({
        message: 'All Products Available',
        products: data
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Internal Error',
        error: error
      });
    });
});

router.post('/', (req, res, next) => {
  const newProduct = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  // Save the data
  newProduct
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Product posted',
        product: newProduct
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

// single prduct route
router.get('/:productId', (req, res, next) => {
  // extract the id sent in the url
  const id = req.params.productId;
  Product.findById(id)
    .select('_id name price')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          message: 'Fetched Success',
          product: doc
        });
      } else {
        res.status(404).json({
          message: 'Data not found',
          product: doc
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Internal Error',
        error: err
      });
    });
});

router.patch('/:productId', (req, res, next) => {
  // extract the id sent in the url
  const id = req.params.productId;

  const updateOps = {};

  // Run selected fields to be updated
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(data => {
      res.status(200).json({
        message: `Product ${id} was updated successfully`,
        updatedData: data
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

router.delete('/:productId', (req, res, next) => {
  // extract the id sent in the url
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(data => {
      res.status(200).json({
        message: `Product was deleted successfully`
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

module.exports = router;
