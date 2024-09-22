import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { expiredReferralAllViewAction } from "../../../redux/actions/referrals/expiredReferralAction";
import * as expiredRefAction from "../../../redux/actions/referrals/expiredReferralAction";
import SearchInputfield from "../../form/searchInputfield";
import { insertSpaces, statusColor, useSortableData } from "../../helper";
import errorToast from "../../utilits/errorToast";
import LoadAndError from "../../utilits/loadAndError";
import LoadingSpinnerTable from "../../utilits/loadingSpinnerTable";
import TablePaginations from "../../utilits/pagination";

const ReferralExpiredMainTable = ({ type = "", search }) => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState({ noOfItems: 0, noOfPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [expiredReferralData, setExpiredReferralData] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (type === "driverReferral") {
      setLoading(true);
      dispatch(
        expiredRefAction?.expiredDriverRefIdListAction(
          {
            search: {
              id: "",
              referral_code: search?.referral_id ?? "",
              referral_classification: search?.referral_classification ?? "",
              coupon_code: search?.coupon_code ?? "",
              coupon_title: search?.coupon_title ?? "",
              referral_status: search?.referral_status ?? "",
              expired_at: search?.expired_at ?? "",
            },
          },
          page,
          onSuccess,
          onError
        )
      );
    } else {
      setLoading(true);
      dispatch(
        expiredRefAction?.expiredReferralAllViewAction(
          {
            search: {
              id: "",
              referral_id: search?.referral_id ?? "",
              referral_classification: search?.referral_classification ?? "",
              coupon_code: search?.coupon_code ?? "",
              coupon_title: search?.coupon_title ?? "",
              referral_status: search?.referral_status ?? "",
              expired_at: search?.expired_at ?? "",
            },
          },
          page,
          onSuccess,
          onError
        )
      );
    }
  }, [page, search]);
  const onSuccess = (data) => {
    setError(false);
    setLoading(false);
    console.log(data);
    console.log(data?.data?.data);
    setExpiredReferralData(data?.data?.data);
    setPageData({
      noOfItems: data?.data?.count,
      noOfPages: data?.data?.pages,
    });
  };
  const onError = (data) => {
    setLoading(false);
    errorToast(data?.data?.data);
    setError(true);
    setErrorMessage(data?.data?.data);
  };

  function handlePagination(type) {
    if (type === "+") {
      if (page + 1 < pageData.noOfPages) setPage((prev) => prev + 1);
    } else if (type === "-") if (page > 0) setPage((prev) => prev - 1);
  }

  const RiderReferraltableHeading = [
    {
      title: "Referral ID",
      value:
        type === "riderReferral"
          ? "referral_id"
          : type === "driverReferral"
          ? "referral_code"
          : "",
    },
    { title: "Referral Classification", value: "referral_classification" },
    { title: "Coupon Code", value: "coupon_code" },
    { title: "Coupon Title", value: "coupon_title" },
    { title: "Referral Status", value: "referral_status" },
    { title: "Expired At", value: "expired_at" },
  ];

  const [activeSortIndex, setActiveSortIndex] = useState(null);

  const { items, requestSort, sortConfig } =
    useSortableData(expiredReferralData);
  return (
    <div>
      <div className="mt-2">
        <div className=" table_container">
          {loading && <LoadingSpinnerTable />}
          <table className="table  ">
            <thead>
              <tr className="pale_blue_bg text-nowrap">
                <th scope="col" className="ongoing_heading_first_list">
                  <input
                    type="checkbox"
                    className="manage_fare_checkbox_row ms-2 d-flex align-items-center"
                    id="mastercheck"
                  />
                </th>
                {/* <SearchInputfield title={"Referral ID"} />
                <SearchInputfield title={"Referral Classification"} />
                <SearchInputfield title={"Coupon Code"} />
                <SearchInputfield title={"Coupon Title"} />
                <SearchInputfield title={"Referral Status"} />
                <SearchInputfield title={"Expired At"} /> */}
                {RiderReferraltableHeading?.map((item, index) => {
                  const isActiveSortIndex = activeSortIndex === index;
                  return (
                    <SearchInputfield
                      title={item?.title}
                      requestSort={requestSort}
                      sortName={item?.value}
                      key={item?.title}
                      index={index}
                      isActiveSortIndex={isActiveSortIndex}
                      setActiveSortIndex={setActiveSortIndex}
                      sortConfig={sortConfig}
                    />
                  );
                })}

                <th className="ongoing_heading_last_list"></th>
              </tr>
            </thead>
            <tbody className="light_blue_bg text-nowrap">
              <LoadAndError
                loader={loading}
                error={error}
                status={expiredReferralData?.length === 0}
                errorMessage={errorMessage}
              >
                {items?.map((item, id) => (
                  <tr key={id} className={"light_blue_bg text-nowrap"}>
                    <th scope="row">
                      <input
                        id={item?.id}
                        type="checkbox"
                        className="manage_fare_checkbox ms-2 "
                      />
                    </th>

                    <td>
                      <a className=" secondary_color">
                        <span className="secondary_color fs_14 fw_500">
                          {item?.referral_id ?? item?.referral_code ?? "--"}
                        </span>
                      </a>
                    </td>

                    <td>
                      <span className="secondary_color fs_14 fw_500">
                        {item?.referral_classification
                          ? insertSpaces(item?.referral_classification)
                          : "--"}
                      </span>
                    </td>

                    <td>
                      <span className={"secondary_color fs_14 fw_500"}>
                        {item?.coupon_code ?? "--"}
                      </span>
                    </td>
                    <td>
                      <span className="secondary_color fs_14 fw_500">
                        {item?.coupon_title ?? "--"}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span
                        className={`${statusColor(
                          item?.referral_status
                        )} fs_14 fw_500`}
                      >
                        {item?.referral_status ?? "--"}
                      </span>
                    </td>
                    <td>
                      <span className="secondary_color fs_14 fw_500">
                        {item?.expired_at
                          ? moment(item?.expired_at).format("DD-MM-YYYY,HH:mm")
                          : "--"}
                      </span>
                    </td>

                    <td className="">
                      <NavLink
                        className="border_none border_radius fs_14 me-4 text-decoration-none fw_500 px-3 py-1 white_color blue_color_bg view_text"
                        to={`expired/view/${item?.id}`}
                        state={{
                          edit: false,
                          referral_status: item?.referral_status,
                          referralID: item?.referral_id,
                        }}
                      >
                        View
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </LoadAndError>
            </tbody>
          </table>
        </div>
      </div>
      {expiredReferralData?.length === 0 ? (
        <></>
      ) : (
        <TablePaginations
          paginate={handlePagination}
          currentPage={page}
          pageData={pageData}
        />
      )}
    </div>
  );
};

export default ReferralExpiredMainTable;
