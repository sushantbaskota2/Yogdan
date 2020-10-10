import React from "react";
import "./Comments.scss";
const Comment = ({ image, name, date, text }) => {
  return (
    <div className="comments">
      <div className="comment-card">
        <div className="commenter-info">
          <img src={image} />
          <span className="name">{name}</span>
          <span className="date">{date}</span>
        </div>
        <span className="comment">{text}</span>
      </div>
    </div>
  );
};

// const comments = [
//   {
//     id: 1,
//     image:
//       "https://pickaface.net/gallery/avatar/leo.medina.56451fbc80b6c17c.png",
//     name: "Sushant Baskota",
//     date: "2 hrs ago",
//     text: "I hope you beat corona super fast",
//   },
//   {
//     id: 2,
//     image: "https://pickaface.net/gallery/avatar/jcoote54ff1fe2082d1.png",
//     name: "Ashish Panta",
//     date: "25 secs ago",
//     text: "I hope you die of corona and come back to life as a gay",
//   },

//   {
//     id: 3,
//     image: "https://pickaface.net/gallery/avatar/thisalviano53d7f271e5ccb.png",
//     name: "Aayush Upadhyaya",
//     date: "1 hr ago",
//     text: "Machikni randi ko choro kta ho Among us khelne haina",
//   },
// ];

// const Comments = () => {
//   return (
//     <div className="comments">
//       {comments.map(({ id, ...props }) => (
//         <Comment key={id} {...props} />
//       ))}
//     </div>
//   );
// };

export default Comment;
