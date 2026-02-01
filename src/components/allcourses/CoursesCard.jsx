import { useState } from "react";
import "./courses.css";
import { useNavigate } from "react-router-dom";
import Loader from "../home/Loader";
import Heading from "../common/heading/Heading";
import AppToast from "../toast/AppToast";
import { isAuthenticated } from "../auth";
import { coursesCard } from "../../dummydata";



const CoursesCard = () => {
  
  const history = useNavigate();
 const [courses] = useState(coursesCard);

 // 👈 DIRECT DATA
  const [loading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  if (loading) return <Loader />;

  return (
    <section
      className="coursesCard"
      style={{ background: "#f9f9f9", padding: "80px 0" }}
    >
      <Heading subtitle="COURSES" title="Browse Our Online Courses" />

      <div className="container grid2">
        {courses.map((course) => (
          <div className="items" key={course.id}>
            <div className="content flex">
              <div className="left">
                <div className="img">
                  <img src={course.cover} alt={course.coursesName||"courses"} />
                </div>
              </div>

              <div className="text">
                <h1>{course.coursesName}</h1>

                <div className="rate">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <label>(5.0)</label>
                </div>

                <div className="details">
                  {course.courTeacher.map((t, i) => (
                    <div key={i}>
                      <div className="box">
                        <div className="dimg">
                          <img src={t.dcover} alt={t.name} />
                        </div>
                        <div className="para">
                          <h4>{t.name}</h4>
                        </div>
                      </div>
                      <span>{t.totalTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="price">
              <h3>{course.priceAll}</h3>
            </div>

            <button
              className="outline-btn"
              onClick={() => {
                if (isAuthenticated()) {
                  history("/enroll", {state:{
                    courseName: course.coursesName,
                    fullPrice: course.priceAll?.replace(/[^\d]/g, ""),
                    monthlyPrice: course.pricePer,
                  }});
                  return;
                }
                setToast({
                  open: true,
                  message:
                    "Oops! It appears you're not logged in. Please log in to proceed further.",
                  severity: "error",
                });
              }}
            >
              ENROLL NOW
            </button>
          </div>
        ))}
      </div>

      <AppToast
        open={toast.open}
        setOpen={(open) => setToast({ ...toast, open })}
        message={toast.message}
        severity={toast.severity}
      />
    </section>
  );
};

export default CoursesCard;
