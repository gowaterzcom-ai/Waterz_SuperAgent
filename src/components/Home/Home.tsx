import React,{ useState} from "react";
import styles from "../../styles/Home/Home.module.css"
import YachtCard from "../Layouts/YatchCard";
import hh3 from "../../assets/Home/hh3.svg";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SolutionCard from "../Layouts/SolutionCard";
import { useTopYachts } from "../../hooks/useTopYacht";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store/hook";
import { superagentAPI } from "../../api/superagent";
import { useNavigate } from "react-router-dom";
import { setReferralLink } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";


const solutionData = [
  {
    id: "solution-1",
    heading: "Agent  Network Management",
    subheading: "Oversee and manage multiple agents under your network.",
  },
  {
    id: "solution-2",
    heading: "Yacht Assignments & Commissions:",
    subheading: "Assign yachts to agents and customize commission structures.",
  },
  {
    id: "solution-3",
    heading: "Centralized Dashboard",
    subheading: "Sync bookings and schedules with Google calendars  for better organization and time management.",
  },
  {
    id: "solution-4",
    heading: "Calendar Sync",
    subheading: "Create personalized itineraries with ease, ensuring a memorable voyage experience.",
  },
  {
    id: "solution-5",
    heading: "Secure Payment Solutions",
    subheading: "Benefit from robust and secure payment options to safeguard your transactions.",
  },
  {
    id: "solution-6",
    heading: "WhatsApp Integration",
    subheading: "Stay updated with instant system notifications and updates directly through WhatsApp",
  },
];


  

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const { yachts,  error } = useTopYachts();
  const {userDetails}  = useAppSelector((state) => state.user)
  console.log("isVer", userDetails.isVerifiedByAdmin)
  if (error) {
    toast.error("Something Wrong Happened")
  }

//   if (loading) {
//     return <div>Loading...</div>;
// }

  const handleGetReferralLink = async () => {
    try {
        setIsLoading(true);
        const response = await superagentAPI.getReferralLink();
        if (response.link) {
            dispatch(setReferralLink(response.link));
            navigate('/account');
        }
    } catch (error) {
        console.error('Error getting referral link:', error);
    } finally {
        setIsLoading(false);
    }
};

  return(
      <div className={styles.comp_body}>
          <div className={styles.hero_body}>
            <div className={styles.hero_left}>
              <div className={styles.hero_head}>
                  Powering Network Management
              </div>
              <div className={styles.hero_subhead}>
                  Manage multiple agents under your network, assign yachts, and customize commission structures with ease. Streamline your operations and maximize efficiency effortlessly.
              </div>
              {isAuthenticated && userDetails.isVerifiedByAdmin ? (
                  <div className={styles.account_section}>
                      <button 
                          className={styles.hero_btn}
                          onClick={handleGetReferralLink}
                          disabled={isLoading}
                      >
                          {isLoading ? 'Loading...' : 'Get Referral Link'}
                      </button>
                  </div>
              ) : (
                  <Link to="/signup">
                      <div className={styles.hero_btn}>Start Now</div>
                  </Link>
              )}
            </div>
            <div className={styles.hero_right}>
              <div className={styles.hero_box2}>
                  <img src={hh3} className={styles.hh2} alt="hero" />
              </div>
            </div>
          </div>
          
          <div className={styles.yatchBox}>
              <div className={styles.section_head}>
                 Yacht Near You
              </div>
              <div className={styles.yatch_slider}>
                    <Swiper
                      spaceBetween={50}
                      slidesPerView="auto"
                      pagination={{ clickable: true }}
                      style={{ 
                        padding: "20px 0", 
                        width: "100%",
                      }}
                      breakpoints={{
                        320: {
                          slidesPerView: "auto",
                          spaceBetween: 10
                        },
                        480: {
                          slidesPerView: "auto",
                          spaceBetween: 15
                        },
                        768: {
                          slidesPerView: "auto",
                          spaceBetween: 20
                        },
                        1024: {
                          slidesPerView: "auto",
                          spaceBetween: 40
                        }
                      }}
                    >
                    {yachts.map((yacht) => (
                      <SwiperSlide key={yacht._id}  className={styles.swiper_slide}>
                        <YachtCard
                          key={yacht._id}
                          yacht={yacht}
                          showLoc={false}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
              </div>
          </div>

          <div className={styles.yatchBox}>
            <div className={styles.section_head2}>
              Effortless Distribution
            </div>
            <div className={styles.section_head}>
              Seamless Yacht Distribution Solutions
            </div>
            <div className={styles.gridBox}>
              {solutionData.map((solution) => (
                <SolutionCard
                  key={solution.id}
                  heading={solution.heading}
                  subheading={solution.subheading}
                />
              ))}
            </div>
          </div>
      </div>
  )
}

export default Home;