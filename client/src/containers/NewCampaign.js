import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import * as Icons from "react-feather";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "../axios";
const NewCampaign = ({ history }) => {
  const handleUploadClick = useRef(null);
  const [files, setfiles] = useState([]);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [goal, setgoal] = useState(0);
  const [endDate, setendDate] = useState(moment().add(5, "days").toDate());
  const [uploadFiles, setuploadfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleFileChange = (e) => {
    setuploadfiles([...uploadFiles, e.target.files[0]]);
    setfiles([...files, URL.createObjectURL(e.target.files[0])]);
  };

  const handleCreateFundRaiser = async () => {
    const formData = new FormData();

    uploadFiles.forEach((file) => {
      formData.append("files", file);
    });

    const body = {
      goal,
      title,
      description,
      endDate,
    };
    Object.keys(body).forEach((key) => {
      formData.append(key, body[key]);
    });

    try {
      setLoading(true);
      const { data } = await axios.post("/causes/", formData);
      history.push("/my-fundraisers");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="NewCampaign">
      <div className="title">
        <span>Start New Campaign</span>
        <Icons.XCircle onClick={() => history.push("/")} />
      </div>

      <div className="campaign-form-div">
        <div className="input-div">
          <label>Campaign Name</label>
          <input
            type="text"
            onChange={(e) => settitle(e.target.value)}
            value={title}
          />
        </div>
        <div className="input-div">
          <label>Campiagn Story</label>
          <textarea
            width="100%"
            type="textarea"
            onChange={(e) => setdescription(e.target.value)}
            value={description}
          />
        </div>
        <div className="input-div">
          <label>Campaign Goal</label>
          <input
            type="number"
            onChange={(e) => setgoal(e.target.value)}
            value={goal}
          />
        </div>
        <div className="input-div">
          <label>End Date</label>
          <DatePicker
            id="date-picker"
            selected={endDate}
            onChange={(date) => {
              setendDate(date);
            }}
            minDate={moment().add(1, "days").toDate()}
          />
        </div>
        <div className="input-div file-div">
          <div className="fileupload">
            <label> Upload Images </label>
            <input
              type="file"
              style={{ display: "none" }}
              ref={handleUploadClick}
              onChange={handleFileChange}
              multiple
            />
          </div>
          <div className="new-images">
            {files.length !== 0 &&
              files.map((a) => (
                <div key={a} className="new-image-div">
                  <span>
                    <div
                      className="cross"
                      onClick={() => {
                        setuploadfiles(
                          uploadFiles.filter(
                            (file) => URL.createObjectURL(file) !== a
                          )
                        );
                        setfiles(files.filter((file) => file !== a));
                      }}
                    >
                      <Icons.XCircle
                        size={"2rem"}
                        color={"white"}
                        fill={"red"}
                      />
                    </div>
                  </span>
                  <img className="new-image" src={a} />
                </div>
              ))}

            <div
              className="new-image-button"
              onClick={() => {
                handleUploadClick.current.click();
              }}
            >
              <Icons.Plus />
            </div>
          </div>
        </div>

        <div className="submit-button-div">
          <button
            onClick={() => handleCreateFundRaiser()}
            className="submit-button"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCampaign;
