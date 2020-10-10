import React, { useState, useEffect } from "react";
import * as Icons from "react-feather";
import moment from "moment";
import axios from "../axios";
import { AnimatePresence } from "framer-motion";
import ContentLoader from "../components/ContentLoader";
import PaymentConfirmModal from "../components/PaymentConfirmModal";
const MyDonations = ({ deleteButton, hamburger, setHamBurger, history }) => {
  const [donations, setdonations] = useState([]);
  const [loading, setloading] = useState(true);
  const [deleteDono, setdelete] = useState(false);
  const [modal, setModal] = useState(false);
  const [donated, setDonated] = useState(false);
  const amount = parseInt(
    new URLSearchParams(history.location.search).get("amount")
  );

  const campaignId = new URLSearchParams(history.location.search).get(
    "campaign"
  );

  useEffect(() => {
    let mounted = true;
    setloading(true);
    try {
      if (campaignId && amount && !donated) {
        axios
          .post(`/causes/donate/${campaignId}`, { amount })
          .then(({ data }) => {
            if (mounted) {
              setDonated(true);
              setModal(true);
            }
          });
      }
      if (deleteButton) {
        axios
          .get("users/favorites")
          .then((data) => {
            if (mounted) {
              setdonations(data.data);
              setloading(false);
            }
          })
          .catch((err) => {
            if (mounted) {
              setdonations([]);
              setloading(false);
            }
          });
      } else {
        axios
          .get("users/me/donations/")
          .then((data) => {
            if (mounted) {
              setdonations(data.data);
              setloading(false);
            }
          })
          .catch((err) => {
            if (mounted) {
              setdonations([]);
              setloading(false);
            }
          });
      }
    } catch (e) {
      if (mounted) {
        setloading(false);
      }
    }

    return () => {
      mounted = false;
    };
  }, [deleteDono, amount, campaignId, deleteButton, donated]);

  return (
    <div
      className="MyDonations"
      onClick={() => {
        hamburger && setHamBurger(false);
      }}
    >
      <div className="hamburger-button">
        <Icons.Menu
          onClick={() => {
            setHamBurger(true);
          }}
        />
        <span>My {deleteButton ? "Favorites" : "Donations"}</span>
      </div>

      <div className="donations">
        <AnimatePresence initial={false}>
          {modal && (
            <PaymentConfirmModal
              amount={amount}
              id={campaignId}
              closeModal={() => {
                setModal(false);
                history.push("/my-donations");
              }}
            />
          )}
          )
        </AnimatePresence>

        <div className="title">
          <span>{deleteButton ? "Favorites" : "Donations"}</span>
        </div>
        <div className="donation-cards">
          {loading ? (
            <ContentLoader />
          ) : (
            donations.map((hero) => {
              if (deleteButton) {
                const {
                  cause: { title, _id, endDate },
                  amount: donation,
                  _id: dID,
                } = hero;
                return (
                  <div
                    key={_id}
                    className="donation-card"
                    onClick={() => history.push(`/campaign/${_id}`)}
                  >
                    <div className="left">
                      <div className="cause">{title}</div>
                      {!deleteButton ? (
                        <div className="donation">
                          Your Donation: <span>${donation}</span>
                        </div>
                      ) : (
                        <div className="donation">
                          End Date: {moment(endDate).format("MMM DD, YYYY")}
                        </div>
                      )}
                    </div>
                    <div className="right">
                      {deleteButton ? (
                        <Icons.Trash
                          color="red"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              setdelete(!deleteDono);
                              await axios.delete(`/users/favorites/${dID}`);

                              setdonations(
                                [...donations].filter(
                                  ({ _id }) => _id.toString() !== dID
                                )
                              );
                            } catch (error) {}
                          }}
                        />
                      ) : (
                        <Icons.ChevronRight />
                      )}
                    </div>
                  </div>
                );
              } else {
                const {
                  cause: { title, _id: cID },
                  amount: donation,
                  _id,
                } = hero;
                return (
                  <div
                    key={_id}
                    className="donation-card"
                    onClick={() => history.push(`/campaign/${cID}`)}
                  >
                    <div className="left">
                      <div className="cause">{title}</div>
                      {
                        <div className="donation">
                          Your Donation: <span>${donation}</span>
                        </div>
                      }
                    </div>
                    <div className="right">
                      <Icons.ChevronRight />
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>
      </div>

      <div />
    </div>
  );
};

export default MyDonations;
