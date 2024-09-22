import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import PasswordInputField from "../form/passwordInputField";
import SuccessMessagemodal from "../modals/successMessageModal";
import Cancelbtn from "../utilits/buttons/cancelbtn";
import { useDispatch } from "react-redux";
import successToast from "../utilits/successToast";
import errorToast from "../utilits/errorToast";
import { useNavigate } from "react-router";
import {
  riderBroadCastApproveAction,
  riderBroadCastRejectAction,
} from "../../redux/actions/broadcast/pendandCreateBroadcastAction";
import SpinnerLoading from "../utilits/spinnerLoading";
import { riderBroadCastDeleteAction } from "../../redux/actions/broadcast/deletedBroadcastAction";
import * as reviewReqBroadcastAction from "../../redux/actions/broadcast/pendandCreateBroadcastAction";
import * as activeBroadcastAction from "../../redux/actions/broadcast/activeBroadcastAction";
import * as rejectBroadcastAction from "../../redux/actions/broadcast/rejectbroadcastAction";
import * as deletedBroadcastAction from "../../redux/actions/broadcast/deletedBroadcastAction";
import * as expiredBroadcastAction from "../../redux/actions/broadcast/expiredBroadcastAction";

const BroadcastPasswordModal = ({
  passwordModalShow,
  handlePasswordClose,
  id,
  status,
  title = "",
  type,
  loadingStatus = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [successMessageShow, setSuccessMessageShow] = useState(false);

  const handleSuccessMessageClose = () => {
    setSuccessMessageShow(false);
    if (type === "Rider") {
      navigate("/rider-broadcast");
    } else if (type === "Driver") {
      navigate("/driver-broadcast");
    }
  };
  const handleSuccessMessageShow = () => setSuccessMessageShow(true);
  const formik = useFormik({
    initialValues: {
      ConfirmPassword: ``,
    },
    validationSchema: Yup.object({
      ConfirmPassword: Yup.string(),
    }),
    onSubmit: (values) => {
      if (type === "Rider") {
        if (status === "Approve") {
          setLoading(true);
          dispatch(
            reviewReqBroadcastAction?.riderBroadCastApproveAction(
              {
                broadcast_id: id,
                password: values?.ConfirmPassword,
              },
              onSuccess,
              onError
            )
          );
        } else if (status === "Reject") {
          setLoading(true);
          dispatch(
            reviewReqBroadcastAction?.riderBroadCastRejectAction(
              {
                broadcast_id: id,
                password: values?.ConfirmPassword,
              },
              onSuccess,
              onError
            )
          );
        } else if (status === "Delete") {
          setLoading(true);
          dispatch(
            riderBroadCastDeleteAction(
              {
                broadcast_id: id,
                password: values?.ConfirmPassword,
              },
              onSuccess,
              onError
            )
          );
        }
      } else if (type === "Driver") {
        if (status === "Approve") {
          setLoading(true);
          dispatch(
            reviewReqBroadcastAction?.driverBroadCastApproveAction(
              {
                broadcast_id: id,
                password: values?.ConfirmPassword,
              },
              onSuccess,
              onError
            )
          );
        } else if (status === "Reject") {
          setLoading(true);
          dispatch(
            reviewReqBroadcastAction?.driverBroadCastRejectAction(
              {
                broadcast_id: id,
                password: values?.ConfirmPassword,
              },
              onSuccess,
              onError
            )
          );
        } else if (status === "Delete") {
          setLoading(true);
          dispatch(
            deletedBroadcastAction.driverBroadCastDeleteAction(
              {
                broadcast_id: id,
                password: values?.ConfirmPassword,
              },
              onSuccess,
              onError
            )
          );
        }
      }
    },
  });

  const onSuccess = (data) => {
    setLoading(false);
    console.log(data);
    successToast(data?.data);
    handleSuccessMessageShow();
    handlePasswordClose();
  };

  const onError = (data) => {
    setLoading(false);
    errorToast(data?.data?.data);
    setError(data?.data?.data);
    console.log(data);
  };

  return (
    <>
      <Modal
        centered
        show={passwordModalShow}
        onHide={handlePasswordClose}
        dialogClassName="ban_application_container"
        contentClassName="border_radius_10px"
        backdropClassName="rating_password_modal_backdrop"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div className="px-4">
            <form onSubmit={formik.handleSubmit}>
              <div className="d-flex justify-content-center   mt-3 mb-4">
                <span className="fs_21 primary_color fw_600 text-center">
                  {title}
                </span>
              </div>
              <PasswordInputField
                inputContainer={"px-4"}
                reason={false}
                itemName={"ConfirmPassword"}
                inputValue={formik.values.ConfirmPassword}
                onChangeFn={(e) => {
                  formik.handleChange(e);
                  setError(false);
                }}
                onBlurFn={formik.handleBlur}
                formikError={formik.errors.ConfirmPassword}
                formikTouched={formik.touched.ConfirmPassword}
                error={error}
              />
              <span className="red_color fw_500 ps-4">{error}</span>
              <div className="d-flex justify-content-between mt-4 px-5 mb-3 ">
                <Cancelbtn
                  cancelFn={() => {
                    handlePasswordClose();
                    setError(false);
                    formik.resetForm();
                  }}
                />
                <button
                  disabled={loadingStatus}
                  className="primary_bg border_radius_5px px-5 py-1 border_none"
                  type="sumbit"
                >
                  {loading ? (
                    <SpinnerLoading />
                  ) : (
                    <span className=" fs_18 white_color">Proceed</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      <SuccessMessagemodal
        successMessageShow={successMessageShow}
        handleSuccessMessageClose={() => {
          handleSuccessMessageClose();
        }}
        title={
          status === "Approve"
            ? "Broadcast successfully approved!"
            : status === "Reject"
            ? "Broadcast Rejected!"
            : status === "Delete"
            ? "Broadcast Deleted!"
            : "changes made successfully !"
        }
      />
    </>
  );
};

export default BroadcastPasswordModal;
