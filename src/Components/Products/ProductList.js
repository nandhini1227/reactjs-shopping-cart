﻿import React, { useState, useEffect, useContext } from "react";
import Product from "./Product";
import { faker } from '@faker-js/faker';

import { CartContext } from "../../Services/Cart/CartContext";
import {
  ADD_CART_ITEM,
  REMOVE_CART_ITEM,
  UPDATE_CART_ITEM_COUNT,
} from "../../Services/Cart/action-types";
import { ProductContext } from "../../Services/Product/ProductContext";

import { apiKey, productURL } from "../../Services/util";
import Axios from "axios";

import { FETCH_PRODUCTS } from "../../Services/Product/action-types";
import SyncLoader from "react-spinners/SyncLoader";
import "./ProductList.css";

const ProductList = () => {
  const { cartItem, dispatch } = useContext(CartContext);
  const { products, productDispatch } = useContext(ProductContext);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await Axios.get(productURL, {
        headers: {
          Authorization: apiKey,
        },
      });

      const { photos } = data;

      const allProduct = photos.map((photo) => ({
        smallImage: photo.src.medium,
        tinyImage: photo.src.tiny,
        productName: faker.random.word(),
        productPrice: faker.commerce.price(),
        count: 0,
        id: faker.datatype.uuid(),
        age: faker.datatype.number(6),
      }));

      productDispatch({
        type: FETCH_PRODUCTS,
        payload: allProduct,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("Cart item updated");
  }, [cartItem]);

  const addToCart = (item) => {
    item.isAddedtoCart = true;
    item.count = 1;
    dispatch({
      type: ADD_CART_ITEM,
      payload: item,
    });
  };

  const removeFromCart = (item) => {
    item.isAddedtoCart = false;
    item.count = 0;
    dispatch({
      type: REMOVE_CART_ITEM,
      payload: item,
    });
  };

  const incrementItem = (item) => {
    item.isAddedtoCart = true;
    if (item.count > 0) {
      item.count = item.count + 1;
    }
    dispatch({
      type: UPDATE_CART_ITEM_COUNT,
      payload: item,
    });
  };

  const decrementItem = (item) => {
    item.isAddedtoCart = true;
    if (item.count > 0) {
      item.count = item.count - 1;
    }
    dispatch({
      type: UPDATE_CART_ITEM_COUNT,
      payload: item,
    });
  };

  return (
    <div>
      {loading ? (
        <div className="spinner-container">
          <SyncLoader color="#10b981" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-4 md:grid-cols-3 sm:grid-cols-2 px-4">
          {products.items.map((item) => (
            <Product
              key={item.id}
              product={item}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              incrementItem={incrementItem}
              decrementItem={decrementItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
