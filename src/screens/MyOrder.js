import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Title from '../components/Title/Title';
import Button from '../components/Button/Button';
import Map from '../components/Map/Map';
import classes from './checkoutPage.module.css';
import { useNavigate } from "react-router-dom";


export default function MyOrder() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({});
  const [addressLatLng, setAddressLatLng] = useState(null); 

  const fetchMyOrder = async () => {
    const userEmail = localStorage.getItem("userEmail");
    try {
      const response = await fetch("http://localhost:5000/api/auth/myOrderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setOrderData(data);
      } else {
        console.error("Failed to fetch order data");
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  const handlePaymentCOD = () => {
    navigate("/");
    window.alert("Order is placed");
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          {orderData !== null
            ? Array(orderData).map((data) => {
                return data.orderData
                  ? data.orderData.order_data
                      .slice(0)
                      .reverse()
                      .map((item) => {
                        return item.map((arrayData) => {
                          return (
                            <div className="col-12 col-md-6 col-lg-3">
                              {arrayData.Order_date ? (
                                <div className="m-auto mt-5">
                                  {(data = arrayData.Order_date)}
                                  <hr />
                                </div>
                              ) : (
                                <div className="card mt-3">
                                  <img
                                    src={arrayData.img}
                                    className="card-img-top"
                                    alt="..."
                                    style={{ height: "120px", objectFit: "fill" }}
                                  />
                                  <div className="card-body">
                                    <h5 className="card-title">{arrayData.name}</h5>
                                    <div className="container w-100 p-0" style={{ height: "38px" }}>
                                      <span className="m-1">{arrayData.qty}</span>
                                      <span className="m-1">{arrayData.size}</span>
                                      <span className="m-1">{data}</span>
                                      <div className="d-inline ms-2 h-100 w-20 fs-5">
                                        ₹{arrayData.price}/-
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        });
                      })
                  : "";
              })
            : ""}
          <div className="col-12 col-md-6 col-lg-6">
            <Title title="Choose Your Location" fontSize="1.6rem" />
            <Map
              location={addressLatLng} // Use addressLatLng here
              onChange={(latlng) => {
                console.log(latlng);
                setAddressLatLng(latlng); // Update addressLatLng state
              }}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className={classes.buttons_container}>
              <div className={classes.buttons}>
              <Button
              type="button" // Change type to "button" for handling click event
              text="Payment (COD)"
              width="100%"
              height="3rem"
              onClick={handlePaymentCOD} // Call handlePaymentCOD on button click
            />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
