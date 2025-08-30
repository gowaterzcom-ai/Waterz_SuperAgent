import React, { useState, useEffect } from "react";
import styles from "../../styles/Earning/Earning.module.css";
import 'swiper/swiper-bundle.css';
import earnings from "../../assets/Yatch/sa-earnings.webp";
import { superagentAPI } from "../../api/superagent";
import { useAppSelector } from "../../redux/store/hook";
import { useAppDispatch } from "../../redux/store/hook";
import { setLoading } from "../../redux/slices/loadingSlice";
import { IAgent } from "../../types/agent";

const Earnings: React.FC = () => {
    const dispatch = useAppDispatch();
    const [earningsData, setEarningsData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedAgent, setSelectedAgent] = useState('all');
    const [agents, setAgents] = useState<IAgent[]>([]);
    const { allAgents } = useAppSelector((state) => state.agent);


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
    console.log("error", error);

        // Generate agent options dynamically
        const agentOptions = [
            { value: '', label: 'All Agents' },
            ...agents.map(agent => ({
                value: agent._id,
                label: agent.name
            }))
        ];
    

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                dispatch(setLoading(true));
                const earnings = await superagentAPI.getEarnings(selectedAgent);
                console.log("earnig", earnings.allAgents)
                setEarningsData(earnings.allAgents);
            } catch (err: any) {
                setError(err?.message || 'Failed to fetch earnings');
                console.error("Error fetching earnings:", err);
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchEarnings();
    }, [ selectedAgent]);

    const NoEarningsMessage = ({  }: { type: string }) => (
        <div className={styles.noBookings}>
            <p>No Earnings</p>
        </div>
    );

    const handleAgentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAgent(event.target.value);
    };

    return (
        <div className={styles.comp_body}>
            <div className={styles.image_box}>
                <img src={earnings} alt="Yacht" className={styles.Y2} />
            </div>
            <div className={styles.yatchBox}>
                <div className={styles.section_head2}>My Earnings</div>
                <div className={styles.section_head}>Monitor performance, track payouts, and analyze income trends</div>
                
                <div className={styles.filterContainer}>
                    {/* <select 
                        className={styles.filterDropdown}
                        value={bookingStatus}
                        onChange={handleBookingStatusChange}
                    >
                        {bookingStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select> */}

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

                <div className={styles.earnigs_box}>
                    <div className={styles.text}>Total:</div>
                    <div className={styles.earning}>
                        { earningsData ? (
                            earningsData || '0'
                        ) : (
                            <NoEarningsMessage type="earnings" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Earnings;