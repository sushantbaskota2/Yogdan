import React, { useRef, useEffect, useCallback, useState } from "react";
import "./PaymentConfirmModal.scss";
import * as Icons from "react-feather";
import axios from "../axios";
import { motion } from "framer-motion";

const PaymentConfirmModal = ({ closeModal, id, amount }) => {
  const node = useRef();
  const handleClick = useCallback(
    (e) => {
      if (node.current.contains(e.target)) {
        return;
      }
      closeModal();
    },
    [closeModal]
  );

  const [comment, setComment] = useState("");
  const addComment = () => {
    axios.post(`/causes/comment/${id}`, { text: comment }).then(({ data }) => {
      closeModal();
    });
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick]);
  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="confirm-modal"
    >
      <div ref={node} className="main-modal">
        <span onClick={() => closeModal(false)} className="modal-close">
          X
        </span>
        <div className="tickmark-modal">
          <Icons.Check color="white" strokeWidth="0.8rem" />
        </div>
        <div className="wrapping-div">
          <span className="first-header">
            You donated <span className="donation-amount">Rs.{amount}</span> to
            Sushant Baskota
          </span>
          <h1>Thank you for your donation</h1>
          <input
            onChange={(e) => setComment(e.target.value)}
            type="text"
            value={comment}
            placeholder="Add a comment"
            className="comment-input"
          />
          <button onClick={() => addComment()} className="add-comment">
            Submit
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentConfirmModal;
