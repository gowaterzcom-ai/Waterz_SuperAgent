import React, { useState, useEffect } from "react";
import styles from "../../styles/Booking/Booking.module.css";
import Y2 from "../../assets/Yatch/Y2.svg";
import BookedCard from "../Layouts/BookedCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { superagentAPI } from "../../api/superagent";
import { useAppSelector } from "../../redux/store/hook";
import { IAgent } from "../../types/agent";
import { useAppDispatch } from "../../redux/store/hook";
import { setLoading } from "../../redux/slices/loadingSlice";
interface Booking {
    _id: string;
    user: string;
    name: string;
    yacht: string;
    agent: string | null;
    location: string;
    duration: number;
    startDate: string;
    startTime: string;
    endDate: string;
    sailingTime: number;
    stillTime: number;
    capacity: number;
    PeopleNo: number;
    specialEvent: string;
    specialRequest: string;
    totalAmount: number;
    services: any[];
    paymentStatus: string;
    status: string;
    rideStatus: string;
    calendarSync: boolean;
    razorpayOrderId: string;
    createdAt: string;
    updatedAt: string;
    images: string[];
}


const Booking: React.FC = () => {
    const dispatch = useAppDispatch();
    const [currentBookings, setCurrentBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [bookingStatus, setBookingStatus] = useState('all');
    const [selectedAgent, setSelectedAgent] = useState('all');
    const [agents, setAgents] = useState<IAgent[]>([]);

    // Get agents from redux store
    const { allAgents } = useAppSelector((state) => state.agent);
 console.log("error",error);
    const bookingStatusOptions = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Upcoming' },
        { value: 'completed', label: 'Completed' }
    ];

    // Use agents from Redux or fetch if not available
    useEffect(() => {
        if (allAgents.length > 0) {
            setAgents(allAgents);
        } else {
            const fetchAgents = async () => {
                try {
                    dispatch(setLoading(true));
                    const response = await superagentAPI.getAllAgents();
                    if (response.allAgents) {
                        setAgents(response.allAgents);
                    }
                    dispatch(setLoading(false));
                } catch (err) {
                    dispatch(setLoading(false));
                    console.error("Error fetching agents:", err);
                }
            };
            fetchAgents();
        }
    }, [allAgents]);

    // Generate agent options dynamically
    const agentOptions = [
        { value: 'all', label: 'All Agents' },
        ...agents.map(agent => ({
            value: agent._id,
            label: agent.name
        }))
    ];

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                dispatch(setLoading(true));
                setError(null);

                // Create filter object for body params
                const filterParams: { status?: string; agentWise?: string } = {};
                if (bookingStatus !== 'all') {
                    filterParams.status = bookingStatus;
                }
                if (selectedAgent !== 'all') {
                    filterParams.agentWise = selectedAgent;
                }

                const response = await superagentAPI.getBookings(filterParams);
                // Check if response has allAgents property and it's an array
                if (response && response.allAgents && Array.isArray(response.allAgents)) {
                    setCurrentBookings(response.allAgents);
                } else {
                    setCurrentBookings([]);
                }
            } catch (err: any) {
                dispatch(setLoading(false));
                setError(err?.message || 'Failed to fetch bookings');
                console.error("Error fetching bookings:", err);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchBookings();
    }, [bookingStatus, selectedAgent]);

    // if (error) {
    // toast.error("Something Wrong Happened")
    //   }

    const NoBookingsMessage = ({ type }: { type: string }) => (
        <div className={styles.noBookings}>
            <p>No {type} bookings available</p>
        </div>
    );

    const handleBookingStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBookingStatus(event.target.value);
    };

    const handleAgentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAgent(event.target.value);
    };

    return (
        <div className={styles.comp_body}>
            <div className={styles.image_box}>
                <img src={Y2} alt="Yacht" className={styles.Y2} />
            </div>
            <div className={styles.yatchBox}>
                <div className={styles.section_head2}>The Bookings</div>
                <div className={styles.section_head}>
                    Track upcoming, ongoing, and completed bookings by Agents
                </div>
                
                <div className={styles.filterContainer}>
                    <select 
                        className={styles.filterDropdown}
                        value={bookingStatus}
                        onChange={handleBookingStatusChange}
                    >
                        {bookingStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select 
                        className={styles.filterDropdown}
                        value={selectedAgent}
                        onChange={handleAgentChange}
                    >
                        {agentOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.yatch_slider}>
                    {currentBookings.length === 0 ? (
                        <NoBookingsMessage type="current" />
                    ) : (
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
                            {currentBookings.map((booking) => (
                                <SwiperSlide key={booking._id} className={styles.swiper_slide}>
                                    <BookedCard
                                        name={booking.name}
                                        capacity={booking.capacity}
                                        startDate={booking.startDate}
                                        images={booking.images[0]}
                                        bookingId={booking._id}
                                        booking={booking}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Booking;