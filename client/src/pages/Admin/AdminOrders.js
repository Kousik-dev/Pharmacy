import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import * as XLSX from "xlsx"; // Import XLSX for Excel export
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "delivered",
    "cancel",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const [originalCreateAt, setOriginalCreateAt] = useState({}); // State to store original creation time

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
      // Save original creation time for each order
      setOriginalCreateAt(
        data.reduce((acc, order) => {
          acc[order._id] = moment(order.createAt).format("YYYY-MM-DD ");
          return acc;
        }, {})
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  // Function to export orders as Excel
  // Function to export orders as Excel
const exportOrdersToExcel = () => {
  const formattedOrders = orders.map((order) => ({
    Status: order.status,
    Buyer: order.buyer.name,
    Date: originalCreateAt[order._id], // Use original creation time
    Payment: order.payment.success ? "Success" : "Failed",
    Quantity: order.products.length,
    "Total Amount": calculateTotalAmount(order),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedOrders);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
  XLSX.writeFile(workbook, "orders.xlsx");
};

  // Calculate total amount for each order
  const calculateTotalAmount = (order) => {
    let total = order.products.reduce((acc, product) => acc + product.price, 0);
    return total.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>
          <button
            onClick={exportOrdersToExcel}
            className="btn btn-primary mb-3"
          >
            Download as Excel
          </button>
          {orders.length === 0 ? (
            <p className="text-center">No orders available</p>
          ) : (
            orders.map((o, i) => {
              return (
                <div className="border shadow" key={o._id}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total Amount</th>{" "}
                        {/* Added Total Amount column */}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o?.status}
                          >
                            {status.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{o?.buyer?.name}</td>
                        <td>{originalCreateAt[o._id]}</td>{" "}
                        {/* Use original creation time */}
                        <td>{o?.payment.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length}</td>
                        <td>{calculateTotalAmount(o)}</td>{" "}
                        {/* Display total amount */}
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {o?.products?.map((p, i) => (
                      <div className="row mb-2 p-3 card flex-row" key={p._id}>
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                            width="100px"
                            height={"200px"}
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
            })
          )}
        </div>
        
      </div>
    </Layout>
  );
};

export default AdminOrders;