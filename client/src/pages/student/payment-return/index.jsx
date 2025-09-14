import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureFinalizePaymentService } from "@/services";
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router";

const PaypalPaymentReturnPage = () => {
  // This page is used to display a message to the user while the payment is being processed.
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  const hasCaptured = useRef(false);

  useEffect(() => {
    if (paymentId && payerId && !hasCaptured.current) {
      hasCaptured.current = true;
      async function capturePayment() {
        const currentOrderId = JSON.parse(
          sessionStorage.getItem("currentOrderId")
        );

        const response = await captureFinalizePaymentService(
          paymentId,
          payerId,
          currentOrderId
        );

        if (response.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/student-courses";
        }
      }
      capturePayment();
    }
  }, [paymentId, payerId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing payment... Please Wait...</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default PaypalPaymentReturnPage;
