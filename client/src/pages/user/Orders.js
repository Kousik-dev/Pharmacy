import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const generatePDF = () => {
    const input = document.getElementById("pdf-content");
    if (!input) {
        console.error("Element with id 'pdf-content' not found.");
        return;
    }

    const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
    });

    html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png", 1.0);
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        // Add user name, products, quantity, total bill, and payment status
        orders.forEach((order, index) => {
            let y = imgHeight + 10;
            pdf.text(`User Name: ${order.buyer.name}`, 10, y);
            y += 10;
            order.products.forEach((product) => {
                const totalPrice = product.price * product.quantity; // Calculate total price
                pdf.text(`Quantity: ${product.quantity}`, 10, y); // Adjusted x-coordinate
                pdf.text(`Total Price: ${totalPrice}`, 120, y); // Adjusted x-coordinate for total price
                y += 10;
            });
            pdf.text(`Total Bill: ${order.totalBill}`, 10, y);
            y += 10;
            pdf.text(`Payment Status: Success`, 10, y); // Payment status set to Success
            y += 10;

            if (index < orders.length - 1) {
                pdf.addPage();
            }
        });

        pdf.save("receipt.pdf");
    });
};




  return (
    <Layout title={"Orders - E-Medical Pharmacy"}>
      <div className="container-flui p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders?.map((o, i) => {
              return (
                <div className="border shadow" key={i}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createAt).fromNow()}</td>
                        {/* <td>{o?.payment.success ? "Success" : "Failed"}</td> */}
                        <td>{"Success"}</td>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container" id="pdf-content">
                    {o?.products?.map((p, j) => (
                      <div
                        className="row mb-2 p-3 card flex-row"
                        key={p._id + j}
                      >
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                            width="100px"
                            height={"100px"}
                          />
                        </div>
                        <div className="col-md-8">
                          <p>{p.name}</p>
                          <p>{p.description.substring(0, 30)}</p>
                          <p>Price : {p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <button className="btn btn-primary" onClick={generatePDF}>
              Generate PDF Receipt
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
