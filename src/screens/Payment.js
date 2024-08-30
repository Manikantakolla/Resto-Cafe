import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { QrReader } from "react-qr-reader";
import QRCode from "qrcode.react";
import paymentBackground from "./background.jpg";

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [upiId, setUpiId] = useState("");
  
  const [scannedQRCodeData, setScannedQRCodeData] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const handleScanQrCode = (data) => {
    if (data) {
      console.log(`Scanned QR code: ${data}`);
      setScannedQRCodeData(data);
      
      setPaymentStatus("Payment successful!");
    }
  };

  const handleShowQrScanner = () => {
    setShowQrScanner(true);
  };

  const handleHideQrScanner = () => {
    setShowQrScanner(false);
  };

 

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedPaymentMethod === "creditCard") {
      console.log("Processing credit card payment...");
      setPaymentStatus("Payment successful!");
    } else if (selectedPaymentMethod === "upi") {
      console.log("Processing UPI payment...");
      setPaymentStatus("Payment successful!");
    } else {
      console.log("Please select a payment method.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${paymentBackground})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.1)",
          padding: "30px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1
          style={{
            color: "#333",
            fontFamily: "sans-serif",
            fontSize: "24px",
            marginTop: "0",
          }}
        >
          Payment Page
        </h1>

        <Form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <Form.Label htmlFor="paymentMethod" style={{ marginBottom: "20px",color:"blue"}}>
            Payment Method
          </Form.Label>
          <Form.Control
            as="select"
            name="paymentMethod"
            id="paymentMethod"
            value={selectedPaymentMethod}
            onChange={(event) => setSelectedPaymentMethod(event.target.value)}
            style={{ width: "100%" }}
          >
            <option value="">Select a payment method</option>
            <option value="creditCard">Credit Card</option>
            <option value="upi">UPI</option>
          </Form.Control>

          {selectedPaymentMethod === "creditCard" && (
            <>
              {/* Credit Card Input Fields */}
            </>
          )}

          {selectedPaymentMethod === "upi" && (
            <>
              <Form.Label htmlFor="upiId" style={{ marginBottom: "10px", marginTop: "20px", color:"red"}}>
                UPI ID
              </Form.Label>
              <Form.Control
                type="text"
                name="upiId"
                id="upiId"
                value={upiId}
                onChange={(event) => setUpiId(event.target.value)}
                style={{ width: "100%" }}
                disabled={showQrScanner}
              />


             
              {showQrScanner && (
                <>
                  <QrReader
                    delay={300}
                    onError={handleHideQrScanner}
                    onScan={handleScanQrCode}
                    style={{ width: "100%", marginTop: "20px" }}
                  />
                  <Button
                    type="button"
                    style={{
                      backgroundColor: "#000088",
                      color: "#fff",
                      fontFamily: "sans-serif",
                      fontSize: "16px",
                      lineHeight: "1.5",
                      marginTop: "20px",
                    }}
                    onClick={handleHideQrScanner}
                  >
                    Stop Scanning
                  </Button>
                </>
              )}
            </>
          )}

          {selectedPaymentMethod && (
            <>
              <Form.Label htmlFor="amount" style={{ marginBottom: "20px", marginTop: "20px",color:"green" }}>
                Amount
              </Form.Label>
              <Form.Control
                type="text"
                name="amount"
                id="amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                style={{ width: "100%" }}
              />
            </>
          )}

          {/* Payment Button */}
          <Button
            type="submit"
            style={{
              backgroundColor: "#000088",
              color: "#fff",
              fontFamily: "sans-serif",
              fontSize: "16px",
              lineHeight: "1.5",
              marginTop: "20px",
            }}
            disabled={!selectedPaymentMethod || !amount}
          >
            Pay
          </Button>

          {paymentStatus && <p style={{ marginTop: "20px" }}>{paymentStatus}</p>}
        </Form>
      </div>
    </div>
  );
};

export default PaymentPage;
