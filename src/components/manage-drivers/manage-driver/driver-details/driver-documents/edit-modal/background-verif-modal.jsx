import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "../../../../manageDriversComponents.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { openInNewTab } from "../../../../../helper";
import CancelModalbtn from "../../../../../utilits/buttons/cancelModalbtn";
import Savebtn from "../../../../../utilits/buttons/savebtn";
import ImageInputField from "../../../../../form/imageInputField";
import ModalHeading from "../../../../../utilits/buttons/modal-header";
import SuccessMessagemodal from "../../../../../modals/successMessageModal";
import { useDispatch } from "react-redux";
import { driverBGverifAction } from "../../../../../../redux/actions/manageDriversAction";
import successToast from "../../../../../utilits/successToast";
import errorToast from "../../../../../utilits/errorToast";
import { UploadBgverifPicAction } from "../../../../../../redux/actions/imageUploadAction";
import SpinnerLoading from "../../../../../utilits/spinnerLoading";
import {
  pendApplicantBGverifAction,
  pendBGverifApproveAction,
} from "../../../../../../redux/actions/pendApplicantAction";
import { rejectApplicantBGverifAction } from "../../../../../../redux/actions/rejectedApplicantAction";
import { useNavigate } from "react-router";
import { expireddocumentBGverifAction } from "../../../../../../redux/actions/expiredDocumentAction";
import { blockedDriversBGverifAction } from "../../../../../../redux/actions/manageDrivers/blockedApplicantAction";
import EyeIcon from "../../../../../../assets/icons/eye-icon";
import DownloadIcon from "../../../../../../assets/icons/download-icon";
import ImageUploadModal from "../../../../../modals/image-upload-modal";

const BackgroundVerifModal = ({
  backgroundVerifModalshow,
  handlebackgroundVerifModalClose,
  backgroundVerificationData,
  driverData,
  setDriverData,
  action,
  setAction,
  id,
  is_editable,
  type,
}) => {
  const currentPath = window?.location?.pathname;
  const mainPagePath = "/" + currentPath?.split("/")[1];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [backUploadLoading, setBackUploadLoading] = useState(false);
  const [imageModalShow, setImageModalShow] = useState(false);
  const [photoUrl, setPhotoUrl] = useState([]);
  const [photo2Url, setPhoto2Url] = useState([]);
  const [imageName, setImageName] = useState([]);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const [frontImageLink, setFrontImageLink] = useState({
    img: "",
    error: false,
  });

  const [backImageLink, setBackImageLink] = useState({
    img: "",
    error: false,
  });
  useEffect(() => {
    setFrontImageLink({
      img: backgroundVerificationData?.photo_1 ?? "",
      error: false,
    });
    setBackImageLink({
      img: backgroundVerificationData?.photo_2 ?? "",
      error: false,
    });
  }, [backgroundVerificationData]);

  const [successMessageShow, setSuccessMessageShow] = useState(false);
  const handleSuccessMessageClose = () => {
    setSuccessMessageShow(false);
    if (
      type === "rejectApplication" &&
      backgroundVerificationData?.status !== "Approved"
    ) {
      navigate(`${mainPagePath}`);
    } else {
      setDriverData(!driverData);
    }
  };
  const handleSuccessMessageShow = () => setSuccessMessageShow(true);
  function handleImage1FileChange(e) {
    if (e.target?.files.length !== 0) {
      setImageName("Upload");
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setPhotoUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
      setImageModalShow(true);
    }
  }
  function handleImage2FileChange(e) {
    if (e.target?.files.length !== 0) {
      setImageName("photo2");
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setPhoto2Url(reader.result);
        };
        reader.readAsDataURL(file);
      }
      setImageModalShow(true);
    }
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      Upload: backgroundVerificationData?.photo_1
        ? backgroundVerificationData?.photo_1
        : "",
      photo2: backgroundVerificationData?.photo_2
        ? backgroundVerificationData?.photo_2
        : "",
      action: "save",
    },
    validationSchema: Yup.object({
      Upload: Yup.mixed("").required("Please fill this field to proceed"),
      photo2: Yup.mixed(""),
    }),

    onSubmit: (values) => {
      const bgVerifInputData = {
        driver_id: id,
        photo_1: frontImageLink?.img,
        photo_2: backImageLink?.img,
      };

      if (values.action === "save") {
        if (type === "manageDrivers") {
          setLoading(true);
          dispatch(driverBGverifAction(bgVerifInputData, onSuccess, onError));
        } else if (type === "blockedDrivers") {
          setLoading(true);
          dispatch(
            blockedDriversBGverifAction(bgVerifInputData, onSuccess, onError)
          );
        } else if (type === "pendingRideHistory") {
          setLoading(true);
          dispatch(
            pendApplicantBGverifAction(bgVerifInputData, onSuccess, onError)
          );
        } else if (type === "expiredDocuments") {
          setLoading(true);
          dispatch(
            expireddocumentBGverifAction(bgVerifInputData, onSuccess, onError)
          );
        } else if (type === "rejectedApplications") {
          setLoading(true);
          dispatch(
            rejectApplicantBGverifAction(bgVerifInputData, onSuccess, onError)
          );
        }
      } else if (values.action === "Approve") {
        setLoading(true);
        dispatch(
          pendBGverifApproveAction(bgVerifInputData, onSuccess, onError)
        );
      }
    },
  });

  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    if (
      frontImageLink?.img ||
      backImageLink?.img ||
      JSON.stringify(formik.initialValues) !== JSON.stringify(formik.values)
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formik.values]);

  const onSuccess = (data) => {
    setLoading(false);
    if (
      frontImageLink?.img ||
      backImageLink?.img ||
      JSON.stringify(formik.initialValues) !== JSON.stringify(formik.values)
    ) {
      handleSuccessMessageShow();
      successToast(data?.message);
    }
    handlebackgroundVerifModalClose();
  };
  const onError = (data) => {
    setLoading(false);
    setDriverData(false);
    errorToast(data?.data?.data);
    setError(data?.data);
  };

  return (
    <>
      <SuccessMessagemodal
        successMessageShow={successMessageShow}
        handleSuccessMessageClose={handleSuccessMessageClose}
        title="Changes made Successfully"
      />
      <Modal
        centered
        show={backgroundVerifModalshow}
        onHide={handlebackgroundVerifModalClose}
        dialogClassName="driver_document_modal_container"
        contentClassName="border_radius_10px"
        backdropClassName="add_admin_modal_backdrop"
        backdrop={action === "view" ? true : "static"}
        keyboard={false}
      >
        <Modal.Body>
          <div className="px-2">
            <ModalHeading
              title={"Background Verification"}
              closeFn={() => {
                handlebackgroundVerifModalClose();
                formik?.resetForm();
              }}
              status={backgroundVerificationData?.status ?? "Incomplete"}
            />

            <form onSubmit={formik.handleSubmit}>
              <ImageUploadModal
                dogImg={imageName === "Upload" ? photoUrl : photo2Url}
                setPhotoUrl={
                  imageName === "Upload" ? setPhotoUrl : setPhoto2Url
                }
                formik={formik}
                imageModalShow={imageModalShow}
                imageModalClose={() => setImageModalShow(false)}
                setUploadLoading={setUploadLoading}
                modalType={"profilePhoto"}
                setFrontImageLink={
                  imageName === "Upload" ? setFrontImageLink : setBackImageLink
                }
                imageAction1={UploadBgverifPicAction}
                field_name={imageName}
              />
              <div className="row mt-4 mx-1">
                <span className="primary_color fw_600">Photo 1*</span>
                <div className="d-sm-flex justify-content-between align-items-center document_upload_container py-2 border_radius">
                  {(frontImageLink?.img !== null &&
                    frontImageLink?.img !== "") ||
                  backgroundVerificationData?.photo_1 ? (
                    <span className="green_color">document uploaded</span>
                  ) : (
                    <span className="light_red_color">
                      {action === "view"
                        ? "document is yet to be uplaoded"
                        : "Please upload the document"}
                    </span>
                  )}

                  <div className="d-flex gap-sm-3 gap-2">
                    {action === "edit" && (
                      <ImageInputField
                        type="file"
                        name={"Upload"}
                        onChangeFn={(e) => {
                          handleImage1FileChange(e);
                        }}
                        title={
                          (frontImageLink?.img !== null &&
                            frontImageLink?.img !== "") ||
                          backgroundVerificationData?.photo_1
                            ? "Re-upload"
                            : "upload"
                        }
                        loader={uploadLoading}
                      />
                    )}
                    {(frontImageLink?.img !== null &&
                      frontImageLink?.img !== "") ||
                    backgroundVerificationData?.photo_1 ? (
                      <>
                        <button
                          className="primary_bg white_color border_radius_5px border_none"
                          onClick={() =>
                            openInNewTab(
                              frontImageLink?.img !== null &&
                                frontImageLink?.img !== ""
                                ? frontImageLink?.img
                                : formik.values.Upload
                            )
                          }
                          type="button"
                        >
                          <EyeIcon fill="white" className={`mb-1`} />
                        </button>

                        <a
                          className=""
                          href={
                            frontImageLink?.img !== null &&
                            frontImageLink?.img !== ""
                              ? frontImageLink?.img
                              : formik.values.Upload
                          }
                          download={
                            frontImageLink?.img !== null &&
                            frontImageLink?.img !== ""
                              ? frontImageLink?.img
                              : formik.values.Upload
                          }
                        >
                          <button
                            className="primary_bg white_color border_radius_5px border_none"
                            type="button"
                          >
                            <DownloadIcon fill="white" className={`mb-1`} />
                          </button>
                        </a>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className="row mt-4 mx-1">
                <span className="primary_color fw_600">Photo 2</span>
                <div className="d-sm-flex justify-content-between align-items-center document_upload_container py-2 border_radius">
                  {(backImageLink?.img !== null && backImageLink?.img !== "") ||
                  backgroundVerificationData?.photo_2 ? (
                    <span className="green_color">document uploaded</span>
                  ) : (
                    <span className="light_red_color">
                      {action === "view"
                        ? "document is yet to be uplaoded"
                        : "Please upload the document"}
                    </span>
                  )}

                  <div className="d-flex gap-sm-3 gap-2">
                    {action === "edit" && (
                      <ImageInputField
                        type="file"
                        name={"photo2"}
                        onChangeFn={(e) => {
                          handleImage2FileChange(e);
                        }}
                        title={
                          (backImageLink?.img !== null &&
                            backImageLink?.img !== "") ||
                          backgroundVerificationData?.photo_2
                            ? "Re-upload"
                            : "upload"
                        }
                        loader={backUploadLoading}
                      />
                    )}
                    {(backImageLink?.img !== null &&
                      backImageLink?.img !== "") ||
                    backgroundVerificationData?.photo_2 ? (
                      <>
                        <button
                          className="primary_bg white_color border_radius_5px border_none"
                          onClick={() =>
                            openInNewTab(
                              backImageLink?.img !== null &&
                                backImageLink?.img !== ""
                                ? backImageLink?.img
                                : formik.values.photo2
                            )
                          }
                          type="button"
                        >
                          <EyeIcon fill="white" className={`mb-1`} />
                        </button>

                        <a
                          className=""
                          href={
                            backImageLink?.img !== null &&
                            backImageLink?.img !== ""
                              ? backImageLink?.img
                              : formik.values.photo2
                          }
                          download={
                            backImageLink?.img !== null &&
                            backImageLink?.img !== ""
                              ? backImageLink?.img
                              : formik.values.photo2
                          }
                        >
                          <button
                            className="primary_bg white_color border_radius_5px border_none"
                            type="button"
                          >
                            <DownloadIcon fill="white" className={`mb-1`} />
                          </button>
                        </a>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>

              {/* <div className="row mt-5">
                <div className="d-flex justify-content-end gap-3">
                  {action === "edit" ? (
                    <>
                      {" "}
                      <CancelModalbtn
                        cancelModalFn={handlebackgroundVerifModalClose}
                      />
                      <Savebtn
                        submitFn={() => formik.setFieldValue("action", "save")}
                        disabled={disabled}
                        btnClassName={`${
                          disabled
                            ? `disabled_color_bg white_color px-5`
                            : `light_green_bg px-5`
                        }`}
                        loader={loading}
                      />
                    </>
                  ) : (
                    is_editable && (
                      <button
                        type="button"
                        className="white_color border_none px-5 me-1 py-1 fs_16 primary_bg border_radius_5px"
                        onClick={() => {
                          setAction("edit");
                        }}
                      >
                        Edit
                      </button>
                    )
                  )}
                </div>
              </div> */}
              <div className="row mt-5">
                <div className="d-flex justify-content-sm-end justify-content-center gap-sm-2">
                  {backgroundVerificationData?.status !== "Approved" &&
                  type === "pendingRideHistory" &&
                  action === "edit" ? (
                    <>
                      <Savebtn
                        submitFn={() => formik.setFieldValue("action", "save")}
                        loader={loading}
                        disabled={disabled}
                        btnClassName={`${
                          disabled
                            ? `disabled_color_bg white_color px-5`
                            : `primary_bg px-5`
                        }`}
                      />
                      <button
                        onClick={() =>
                          formik.setFieldValue("action", "Approve")
                        }
                        className="border_radius_5px white_color border_none fs_16 px-4 light_green_bg py-1 fs_14"
                        type="submit"
                      >
                        {loading ? <SpinnerLoading /> : <> Approve</>}
                      </button>
                    </>
                  ) : action === "edit" ? (
                    <>
                      {" "}
                      <CancelModalbtn
                        cancelModalFn={() => {
                          handlebackgroundVerifModalClose();
                          formik?.resetForm();
                        }}
                      />
                      <Savebtn
                        submitFn={() => formik.setFieldValue("action", "save")}
                        disabled={disabled}
                        btnClassName={`${
                          disabled
                            ? `disabled_color_bg white_color px-5`
                            : `light_green_bg px-5`
                        }`}
                        loader={loading}
                      />
                    </>
                  ) : (
                    is_editable &&
                    type !== "deletedDrivers" && (
                      <button
                        type="button"
                        className="white_color border_none px-5 me-1 py-1 fs_16 primary_bg border_radius_5px"
                        onClick={() => {
                          setAction("edit");
                        }}
                      >
                        Edit
                      </button>
                    )
                  )}
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default BackgroundVerifModal;
