import React from "react";
import RiderBilling from "../manage-bookings/booking-trip-billing/billing-details/riderBilling";

const BookingRequestBillingDetails = ({ billingDetails }) => {
  console.log(
    billingDetails,
    "billingDetails?.Billing_Details?.payment_method"
  );
  const billingDetailsData = [
    {
      label: "Coupon Code Applied",
      value:
        billingDetails?.rider_details?.coupon_code_applied === true
          ? "Yes"
          : "No",
    },
    {
      label: "Coupon Code",
      value: billingDetails?.rider_details?.rider_coupon?.coupon_code
        ? billingDetails?.rider_details?.rider_coupon?.coupon_code
        : "--",
    },
    {
      label: "Payment Method",
      value: billingDetails?.rider_details?.payment_method
        ? billingDetails?.rider_details?.payment_method
        : "--",
    },
  ];

  return (
    <div className="d-flex justify-content-center ">
      <div className={`col-lg-8 col-10`}>
        <div className="mt-5">
          <span className="fs_16 fw_600 primary_color heading_border_bottom">
            Billing Details
          </span>
          {billingDetailsData?.map((item) => {
            return (
              <>
                <div className="row">
                  <div className=" col-5">
                    <span className=" fs_14 fw_500 primary_color">
                      {item?.label}
                    </span>
                  </div>
                  <div className=" col-5">
                    <span className=" fs_14 fw_500 secondary_color">
                      {item?.value}
                    </span>
                  </div>
                </div>
              </>
            );
          })}
        </div>

        <RiderBilling billingDetailsEdit={false} Data={billingDetails} />
      </div>
    </div>
  );
};

export default BookingRequestBillingDetails;
