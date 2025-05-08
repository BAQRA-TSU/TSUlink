import { useEffect } from "react";
import { BogPaymentSession } from "@bankofgeorgia/bog-payments-web-sdk";
// import BtnStandardIconText from "../../../ds/BtnStandardIconText/BtnStandardIconText";
import styles from "./Bogpay.module.css";
// import { useContent, useLanguages } from "../../../hooks/content";
// import { Returntext } from "../../../pages/Landings/common/returnText";
// import { useSnackbar } from "notistack";
import PropTypes from 'prop-types';


const BOGPaymentIframe = ({ orderId, setShowModal, setOrderId }) => {

    useEffect(() => {
        const session = new BogPaymentSession(orderId, {
            width: "100%",
            height: "100%",
            lang: "ka",
            theme: "dark",
            submitButton: {
                display: true,
            },
            style:{}
        });
        const iframe = document.getElementById("bog-payment-iframe");
        session.render(iframe);

        // setSess(session);

        session.on("form_layout_changed", (data) => {
          if (data.reason === "3ds_page_displayed") {
            console.log("3d");
          }
        });

        // session.on("submit_available_changed", (data) => {
        //     if (data.canPay) {
        //         setCanP(true);
        //     } else {
        //         setCanP(false);
        //     }
        // });

        session.on("payment_complete", (data) => {
            console.log(data);
            if (data && data.error) {
                setShowModal(false);
                setOrderId(false);
                // enqueueSnackbar("Card addition failed. Please try again later. 🚫🛑", {
                //   variant: "error",
                // });
            } else {
                setShowModal(false);
                setOrderId(true);

                // enqueueSnackbar("Card added successfully! 🎉💳", {
                //   variant: "success",
                // });
            }
        });
    }, [orderId]);

    //   const { lang } = useLanguages();
    //   const { contentManagementData } = useContent();

    return (
        <div className={styles.bogIframe}>
            {/* <h1 className={styles.header}>BOG modal</h1> */}
            <div className={styles.middleBog}>
                <div id="bog-payment-iframe" className={styles.innerIframe}></div>
            </div>

            {/* <div className="bottom-bog">
        <BtnStandardIconText
          mode=""
          txt={Returntext(contentManagementData, "btn_cancel", lang)}
          disabled={false}
          size={"standard"}
          icon={false}
          mainColor={"white"}
          onClick={() => {
            setShowModal(false);
            setOrderId(false);
          }}
        />
        {btns && (
          <BtnStandardIconText
            mode=""
            txt={Returntext(contentManagementData, "btn_save", lang)}
            disabled={canP ? false : true}
            size={"standard"}
            icon={false}
            mainColor={"green"}
            onClick={PayBOG}
          />
        )}                  
      </div> */}
        </div>
    );
};

export default BOGPaymentIframe;

BOGPaymentIframe.propTypes = {
    orderId: PropTypes.string.isRequired,
    setShowModal: PropTypes.func.isRequired,
    setOrderId: PropTypes.func.isRequired,
};